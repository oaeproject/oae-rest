/*
 * Copyright 2014 Apereo Foundation (AF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://opensource.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import events from 'events';
import util from 'util';
import { Stream } from 'stream';
import request from 'request';

import {
  either,
  filter,
  lte,
  mergeAll,
  map,
  split,
  isEmpty,
  toString,
  forEach,
  forEachObjIndexed,
  equals,
  defaultTo,
  not,
  is,
  and,
  compose
} from 'ramda';

const HTTP_GET = 'GET';
const HTTP_POST = 'POST';

const emptyString = '';
const isNotEmpty = compose(not, isEmpty);
const isArray = is(Array);
const isFunction = is(Function);
const isDefined = Boolean;
const isNotDefined = compose(not, isDefined);
const isUndefined = equals(undefined);
const isNotUndefined = compose(not, isUndefined);
const isNull = equals(null);
const isNotNull = compose(not, isNull);
const isBoolean = is(Boolean);
const isObject = is(Object);
const differs = compose(not, equals);

/**
 * ### Events
 *
 * The `RestUtil` emits the following events:
 *
 * * `error(err, [body, response])`: An error occurred with the HTTP request. `err` is the error, the body is the body of the response (if applicable), and the response is the response object (if applicable)
 * * `request(restCtx, url, method, data)`: A request was sent. `restCtx` is the RestContext, `url` is the url of the request, `method` is the HTTP method, and `data` is the data that was sent (either in query string or POST body)
 * * `response(body, response)`: A successful response was received from the server. `body` is the response body and `response` is the express Response object
 */

const emitter = new events.EventEmitter();

/**
 * Utility wrapper around the native JS encodeURIComponent function, to make sure that
 * encoding null doesn't return "null". In tests, null will often be passed in to validate
 * validation, and there's no need to catch the "null" string everywhere.
 *
 * @param  {String}     uriComponent        The URL part to encode and make URL safe
 * @return {String}                         The encoded URL part. When null was passed in, this will return ''
 */
const encodeURI = uriComponent => (isNull(uriComponent) ? emptyString : encodeURIComponent(uriComponent));

/**
 * Perform an HTTP request, automatically handling whether or not it should be multipart.
 *
 * @param  {Object}         opts                The opts that would normally be sent to the request module
 * @param  {Object}         data                The request data (e.g., query string values or request body)
 * @param  {Function}       callback            Invoked when the process completes
 * @param  {Object}         callback.err        An error that occurred, if any
 * @param  {String|Object}  callback.body       The response body received from the request. If this is JSON, a parsed JSON object will be returned, otherwise the response will be returned as a string
 * @param  {Response}       callback.response   The response object that was returned by the request node module
 */
const doRequest = (options, data, callback) => {
  data = defaultTo({}, data);
  callback = defaultTo(function() {}, callback);

  /*!
   * Expand values and check if we're uploading a file (a stream value). Since:
   *
   *  a) Streams start pumping out data as soon as they're opened in a later process tick
   *  b) We may not necessarily be in the same process tick as the stream was opened
   *
   * ... we allow a function to be sent in which opens the stream only in the 'tick' that
   * the request will be sent. This avoids the possibility of missing some 'data' callbacks
   * from the file stream.
   */
  let hasStream = false;
  forEachObjIndexed((value, key) => {
    if (isArray(value)) {
      // For an array, resolve all inner values and reassign it to the data array
      value = map(innerValue => {
        if (isFunction(innerValue)) {
          innerValue = innerValue();
          if (innerValue instanceof Stream) {
            hasStream = true;
          }

          return innerValue;
        }

        return innerValue;
      }, value);

      data[key] = value;
    } else if (isFunction(value)) {
      // Invoke any values that are functions in order to resolve the returned value
      // for the request
      value = value();
      if (value instanceof Stream) {
        hasStream = true;
      }

      data[key] = value;
    } else if (value instanceof Stream) {
      hasStream = true;
    }
  }, data);

  // Sanitize the parameters to not include null / unspecified values
  forEachObjIndexed((value, key) => {
    if (either(isNull, isUndefined)(value)) {
      delete data[key];
    } else if (isArray(value)) {
      // Filter out unspecified items from the parameter array, and remove it if it is empty
      value = filter(isDefined, value);
      if (isEmpty(value)) {
        delete data[key];
      } else {
        data[key] = value;
      }
    }
  }, data);

  if (isNotEmpty(data)) {
    if (equals(options.method, HTTP_GET)) {
      options.qs = data;
    } else if (and(isNotDefined(hasStream), differs(options.method, HTTP_GET))) {
      options.form = data;
    }
  }

  const request_ = request(options, (err, response, body) => {
    if (err) {
      emitter.emit('error', err);
      return callback({
        code: 500,
        msg: util.format('Something went wrong trying to contact the server:\n%s\n%s', err.message, err.stack)
      });
    }

    if (lte(400, response.statusCode)) {
      err = { code: response.statusCode, msg: body };
      emitter.emit('error', err, body, response);
      return callback(err);
    }

    // Check if the response body is JSON
    try {
      body = JSON.parse(body);
    } catch {
      /* This can be ignored, response is not a JSON object */
    }

    emitter.emit('response', body, response);
    return callback(null, body, response);
  });

  if (hasStream) {
    // We append our data in a multi-part way.
    // That way we can support buffer/streams as well.
    const form = request_.form();
    forEachObjIndexed((value, key) => {
      // If we're sending parts which have the same name, we have to unroll them
      // before appending them to the form
      if (isArray(value)) {
        forEach(innerValue => {
          // Stringify Booleans when uploading files
          if (isBoolean(value)) {
            form.append(key, toString(innerValue));
          } else {
            form.append(key, innerValue);
          }
        }, value);
        // Stringify Booleans when uploading files
      } else if (isBoolean(value)) {
        form.append(key, toString(value));
      } else {
        form.append(key, value);
      }
    }, data);
  }
};

/**
 * Internal Function that will perform a REST request. If no user is provided, the request will be done anonymously
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         url                 The URL of the REST endpoint that should be called
 * @param  {String}         method              The HTTP method that should be used for the request (i.e. GET or POST)
 * @param  {Object}         data                The form data that should be passed into the request [optional]
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        Error object containing the error code and message
 * @param  {String|Object}  callback.response   The response received from the request. If this is JSON, a parsed JSON object will be returned, otherwise the response will be returned as a string
 * @api private
 */
const _performRestRequest = (...args) => {
  const [restCtx, url, method, data, callback] = args;
  emitter.emit('request', restCtx, url, method, data);

  const requestOptions = {
    url: restCtx.host + url,
    method,
    jar: restCtx.cookieJar,
    strictSSL: restCtx.strictSSL,
    followRedirect: restCtx.followRedirect,
    followOriginalHttpMethod: true,
    followAllRedirects: false,
    removeRefererHeader: false,
    headers: {}
  };

  if (isObject(restCtx.additionalHeaders)) {
    requestOptions.headers = mergeAll([requestOptions.headers, restCtx.additionalHeaders]);
  }

  let referer = `${restCtx.host}/`;
  if (restCtx.hostHeader) {
    // Set the host header so the app server can determine the tenant
    requestOptions.headers.host = restCtx.hostHeader;

    // Grab the protocol from the host to create a referer header value
    const [protocol] = split(':', restCtx.host);
    referer = util.format('%s://%s/', protocol, restCtx.hostHeader);
  }

  // If a referer was explicitly set, we use that
  if (and(isNotNull(restCtx.refererHeader), isNotUndefined(restCtx.refererHeader))) {
    referer = restCtx.refererHeader;
  }

  requestOptions.headers.referer = referer;
  return doRequest(requestOptions, data, callback);
};

/**
 * Fills the jar for a rest context.
 *
 * @param  {RestContext}     restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Function}        callback        Standard callback method.
 * @param  {Object}          callback.err    Standard error object (if any.)
 */
const fillCookieJar = (restCtx, callback) => {
  // If no user is specified, there is no point in doing a login request.
  if (isNotDefined(restCtx.username)) return callback();

  // Log the user in
  _performRestRequest(
    restCtx,
    '/api/auth/login',
    HTTP_POST,
    {
      username: restCtx.username,
      password: restCtx.userPassword
    },
    callback
  );
};

/**
 * Function that will perform a REST request using the Node.js request module. It will check whether
 * or not the request should be authenticated, for which it will check the presence of a Cookie Jar
 * for that user. If no cookie jar exists, the user will be logged in first. After that, the actual
 * request will be made by the internal _RestRequest function
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         url                 The URL of the REST endpoint that should be called
 * @param  {String}         method              The HTTP method that should be used for the request (i.e. GET or POST)
 * @param  {Object}         data                The form data that should be passed into the request [optional]
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        Error object containing the error code and message
 * @param  {String|Object}  callback.body       The response body received from the request. If this is JSON, a parsed JSON object will be returned, otherwise the response will be returned as a string
 * @param  {Response}       callback.response   The response object that was returned by the node module requestjs.
 */
const performRestRequest = (...args) => {
  const [restCtx, url, method, data, callback] = args;
  // If we already have a cookieJar, we can perform the request directly
  if (restCtx.cookieJar) {
    return _performRestRequest(restCtx, url, method, data, callback);
  }

  // Otherwise we create a new one
  restCtx.cookieJar = request.jar();

  // Fill the new cookie jar
  fillCookieJar(restCtx, err => {
    if (err) return callback(err);

    return _performRestRequest(restCtx, url, method, data, callback);
  });
};

export { encodeURI as encodeURIComponent, performRestRequest, fillCookieJar, doRequest as request, emitter };
