/*!
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

import { callbackify } from 'node:util';
import { parseResponse, performRestRequest, encodeURIComponent } from './util.js';

const doRequest = callbackify(performRestRequest);

const HTTP_GET = 'GET';
const HTTP_POST = 'POST';

/**
 * Log a user in through the REST API
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL. For this function to work, the passed in restCtx should be an anonymous REST context
 * @param  {String}         username        Username for the user logging in. This should not be the globally unique userid (e.g. u:cam:nm417), but the login id a user would actually use (e.g. nm417)
 * @param  {String}         password        The user's password
 * @param  {Function}       callback        Standard callback method takes argument `err`
 * @param  {Object}         callback.err    Error object containing error code and error message
 */
const login = (restCtx, username, password, callback) => {
  doRequest(restCtx, '/api/auth/login', HTTP_POST, { username, password }, parseResponse(callback));
};

/**
 * Log a user out through the REST API
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials. This is the user that will be logged out
 * @param  {Function}       callback        Standard callback method takes argument `err`
 * @param  {Object}         callback.err    Error object containing error code and error message
 */
const logout = (restCtx, callback) => {
  doRequest(restCtx, '/api/auth/logout', HTTP_POST, null, parseResponse(callback));
};

/**
 * Change a user's password through the REST API
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         userId          The user id for which we want to update the password
 * @param  {String}         oldPassword     The user's current password
 * @param  {String}         newPassword     The user's new password
 * @param  {Function}       callback        Standard callback method takes argument `err`
 * @param  {Object}         callback.err    Error object containing error code and error message
 */
const changePassword = (restCtx, userId, oldPassword, newPassword, callback) => {
  const parameters = {
    oldPassword,
    newPassword
  };

  doRequest(
    restCtx,
    `/api/user/${encodeURIComponent(userId)}/password`,
    HTTP_POST,
    parameters,
    parseResponse(callback)
  );
};

/**
 * Check whether or not a login id exists
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         username        Username we're checking existence. This should not be the globally unique userid (e.g. u:cam:nm417), but the login id a user would actually use (e.g. nm417) to log in.
 * @param  {Function}       callback        Standard callback method takes argument `err`
 * @param  {Object}         callback.err    Error object containing error code and error message
 */
const exists = (restCtx, username, callback) => {
  doRequest(restCtx, `/api/auth/exists/${encodeURIComponent(username)}`, HTTP_GET, null, parseResponse(callback));
};

/**
 * Check whether or not a login id exists on a specified tenant. Only global administrators can check this
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         tenantAlias     The alias of the tenant to check for the existence of the user ID
 * @param  {String}         username        Username we're checking existence. This should not be the globally unique userid (e.g. u:cam:nm417), but the login id a user would actually use (e.g. nm417) to log in
 * @param  {Function}       callback        Standard callback method takes argument `err`
 * @param  {Object}         callback.err    Error object containing error code and error message
 */
const existsOnTenant = (restCtx, tenantAlias, username, callback) => {
  doRequest(
    restCtx,
    `/api/auth/${encodeURIComponent(tenantAlias)}/exists/${encodeURIComponent(username)}`,
    HTTP_GET,
    null,
    parseResponse(callback)
  );
};

/**
 * Return the login ids for a user
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         userId              The user id for which we want to return the login ids
 * @param  {Function}       callback            Standard callback method takes argument `err`
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Object}         callback.loginIds   Object containing the login ids for a user
 */
const getUserLoginIds = (restCtx, userId, callback) => {
  doRequest(restCtx, `/api/auth/loginIds/${encodeURIComponent(userId)}`, HTTP_GET, null, parseResponse(callback));
};

/**
 * External authentication strategies
 */

/**
 * Initiate the three-legged OAuth authorization steps for Twitter authentication
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        An error object, if any
 * @param  {String}         callback.body       The response body
 * @param  {Object}         callback.response   The HTTP response object
 */
const twitterRedirect = (restCtx, callback) => {
  doRequest(restCtx, '/api/auth/twitter', HTTP_POST, null, parseResponse(callback));
};

/**
 * Send a request to the callback endpoint for Twitter authentication
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL
 * @param  {Object}         params              Any OAuth parameters you wish to include in the request
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        An error object, if any
 * @param  {String}         callback.body       The response body
 * @param  {Object}         callback.response   The HTTP response object
 */
const twitterCallback = (restCtx, parameters, callback) => {
  doRequest(restCtx, '/api/auth/twitter/callback', HTTP_GET, parameters, parseResponse(callback));
};

/**
 * Initiate the three-legged OAuth authorization steps for Facbeook authentication
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        An error object, if any
 * @param  {String}         callback.body       The response body
 * @param  {Object}         callback.response   The HTTP response object
 */
const facebookRedirect = (restCtx, callback) => {
  doRequest(restCtx, '/api/auth/facebook', HTTP_POST, null, parseResponse(callback));
};

/**
 * Send a request to the callback endpoint for Facebook authentication
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL
 * @param  {Object}         params              Any OAuth parameters you wish to include in the request
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        An error object, if any
 * @param  {String}         callback.body       The response body
 * @param  {Object}         callback.response   The HTTP response object
 */
const facebookCallback = (restCtx, parameters, callback) => {
  doRequest(restCtx, '/api/auth/facebook/callback', HTTP_GET, parameters, parseResponse(callback));
};

/**
 * Initiate the three-legged OAuth authorization steps for Google authentication
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        An error object, if any
 * @param  {String}         callback.body       The response body
 * @param  {Object}         callback.response   The HTTP response object
 */
const googleRedirect = (restCtx, callback) => {
  doRequest(restCtx, '/api/auth/google', HTTP_POST, null, parseResponse(callback));
};

/**
 * Send a request to the callback endpoint for Google authentication
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL
 * @param  {Object}         params              Any OAuth parameters you wish to include in the request
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        An error object, if any
 * @param  {String}         callback.body       The response body
 * @param  {Object}         callback.response   The HTTP response object
 */
const googleCallback = (restCtx, parameters, callback) => {
  doRequest(restCtx, '/api/auth/google/callback', HTTP_GET, parameters, parseResponse(callback));
};

/**
 * Initiate authentication with a CAS server
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        An error object, if any
 * @param  {String}         callback.body       The response body
 * @param  {Object}         callback.response   The HTTP response object
 */
const casRedirect = (restCtx, callback) => {
  doRequest(restCtx, '/api/auth/cas', HTTP_POST, null, parseResponse(callback));
};

/**
 * Send a request to the callback endpoint for CAS authentication
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL
 * @param  {Object}         params              Extra query string parameters that should be sent along
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        An error object, if any
 * @param  {String}         callback.body       The response body
 * @param  {Object}         callback.response   The HTTP response object
 */
const casCallback = (restCtx, parameters, callback) => {
  doRequest(restCtx, '/api/auth/cas/callback', HTTP_GET, parameters, parseResponse(callback));
};

/**
 * Redirect a user from a tenant to the SP
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL
 * @param  {String}         redirectUrl         The URL where the user should be redirect to once he succesfully authenticates
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        An error object, if any
 * @param  {String}         callback.body       The response body
 * @param  {Object}         callback.response   The HTTP response object
 */
const shibbolethTenantRedirect = (restCtx, redirectUrl, callback) => {
  doRequest(restCtx, '/api/auth/shibboleth', HTTP_POST, { redirectUrl }, parseResponse(callback));
};

/**
 * Redirect a user from the SP to the IdP
 *
 * @param  {RestContext}    restCtx                 Standard REST Context object that contains the current tenant URL
 * @param  {Object}         params                  The query string parameters for this endpoint
 * @param  {String}         params.tenantAlias      The alias of the tenant on which the user wants to authenticate sign on
 * @param  {String}         params.signature        The signature for the tenant alias
 * @param  {Number}         params.expires          The time in ms since epoch when the signature expires
 * @param  {Function}       callback                Standard callback method
 * @param  {Object}         callback.err            An error object, if any
 * @param  {String}         callback.body           The response body
 * @param  {Object}         callback.response       The HTTP response object
 */
const shibbolethSPRedirect = (restCtx, parameters, callback) => {
  doRequest(restCtx, '/api/auth/shibboleth/sp', HTTP_GET, parameters, parseResponse(callback));
};

/**
 * The request Apache's mod_shib would make to our app server once a user authenticates
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL
 * @param  {Object}         attributes          The attributes that should be sent to the app server
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        An error object, if any
 * @param  {String}         callback.body       The response body
 * @param  {Object}         callback.response   The HTTP response object
 */
const shibbolethSPCallback = (restCtx, attributes, callback) => {
  restCtx.additionalHeaders = attributes;
  doRequest(restCtx, '/api/auth/shibboleth/sp/callback', HTTP_GET, null, (error, response) => {
    delete restCtx.additionalHeaders;

    return parseResponse(callback)(error, response);

    // if (error) return callback(JSON.parse(error.message));
    // return callback(null, );
    // Return parseResponse(callback).apply(this, args);
  });
};

/**
 * Send a request to the tenant callback endpoint for Shibboleth authentication
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL
 * @param  {Object}         params              The query string parameters for this endpoint
 * @param  {String}         params.userId       The id of the user that will be signing in
 * @param  {String}         params.signature    A signature for the user id
 * @param  {Number}         params.expires      The time in ms since epoch when the signature expires
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        An error object, if any
 * @param  {String}         callback.body       The response body
 * @param  {Object}         callback.response   The HTTP response object
 */
const shibbolethTenantCallback = (restCtx, parameters, callback) => {
  doRequest(restCtx, '/api/auth/shibboleth/callback', HTTP_GET, parameters, parseResponse(callback));
};

/**
 * Log a user in with LDAP credentials through the REST API
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL
 * @param  {String}         username        The username that identifies a user in LDAP
 * @param  {String}         password        The corresponding password
 * @param  {Function}       callback        Standard callback method
 * @param  {Object}         callback.err    An error that occurred, if any
 */
const ldapLogin = (restCtx, username, password, callback) => {
  doRequest(restCtx, '/api/auth/ldap', HTTP_POST, { username, password }, parseResponse(callback));
};

/**
 * Get a secret token to be used to reset password
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL
 * @param  {String}         username        The username for which a password needs to be reset
 * @param  {Function}       callback        Standard callback method
 * @param  {Object}         callback.err    An error that occurred, if any
 */
const getResetPasswordSecret = (restCtx, username, callback) => {
  doRequest(restCtx, `/api/auth/local/reset/secret/${username}`, HTTP_GET, null, parseResponse(callback));
};

/**
 * Reset a password for a user using a token
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL
 * @param  {String}         username        The username for which a password needs to be reset
 * @param  {String}         secret          The token identifying the user trying to reset their password
 * @param  {String}         newPassword     The new password to reset
 * @param  {Function}       callback        Standard callback method
 * @param  {Object}         callback.err    An error that occurred, if any
 */
const resetPassword = (restCtx, username, secret, newPassword, callback) => {
  doRequest(
    restCtx,
    `/api/auth/local/reset/password/${username}`,
    HTTP_POST,
    { secret, newPassword },
    parseResponse(callback)
  );
};

export {
  resetPassword,
  getResetPasswordSecret,
  ldapLogin,
  shibbolethTenantCallback,
  shibbolethSPCallback,
  shibbolethSPRedirect,
  shibbolethTenantRedirect,
  casCallback,
  casRedirect,
  googleRedirect,
  googleCallback,
  facebookCallback,
  facebookRedirect,
  login,
  logout,
  changePassword,
  exists,
  existsOnTenant,
  getUserLoginIds,
  twitterRedirect,
  twitterCallback
};
