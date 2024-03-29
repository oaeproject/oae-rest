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

import { defaultTo, map, join } from 'ramda';
import * as RestUtil from './util.js';

const HTTP_GET = 'GET';
const HTTP_POST = 'POST';

/**
 * Perform a search.
 *
 * @param  {RestContext}             restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}                  searchType          The type of search to perform (e.g., general)
 * @param  {String[]}                [params]            The parameters (i.e., path parameters) for the search. These are given as the `opts.params` value in the custom search. While these are optional for this API call, they may be required by the particular search type you are executing.
 * @param  {Object}                  [opts]              Options for the search
 * @param  {String}                  [opts.q]            The full-text search term. If unspecified it will be the server-side default.
 * @param  {Number}                  [opts.limit]        The number of items to retrieve. If -1, then return all. (default: -1)
 * @param  {Number}                  [opts.start]        What item to start on in the results, for paging. If unspecified it will be the server-side default.
 * @param  {String}                  [opts.sort]         The direction of sorting: asc, or desc. If unspecified it will be the server-side default.
 * @param  {Function}                callback            Standard callback method
 * @param  {Object}                  callback.err        Error object containing error code and error message
 * @param  {SearchResult}            callback.result     SearchResult object representing the search result
 */
const search = (restCtx, searchType, parameters, options, callback) => {
  parameters = defaultTo([], parameters);
  options = defaultTo({}, options);

  // Url-encode and join the path parameters into a path string
  parameters = map((parameter) => RestUtil.encodeURIComponent(parameter), parameters);
  parameters = join('/', parameters);

  let path = `/api/search/${RestUtil.encodeURIComponent(searchType)}`;
  if (parameters) {
    path += `/${parameters}`;
  }

  RestUtil.performRestRequest(restCtx, path, HTTP_GET, options, callback);
};

/**
 * Refresh the search index. This ensures that all documents that have been indexed up to this point will turn up in search
 * queries.
 *
 * @param  {RestContext}   restCtx          Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Function}      callback         Invoked when the request completes
 * @param  {Object}        callback.err     An error that occurred, if any
 */
const refresh = (restCtx, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/search/_refresh', HTTP_POST, null, callback);
};

/**
 * Reindex all items in storage. Intended for use by global administrator contexts only.
 *
 * @param  {RestContext}   globalAdminRestCtx   A global administrator REST Context
 * @param  {Function}      callback             Invoked when the request completes
 * @param  {Object}        callback.err         An error that occurred, if any
 */
const reindexAll = (globalAdminRestCtx, callback) => {
  RestUtil.performRestRequest(globalAdminRestCtx, '/api/search/reindexAll', HTTP_POST, null, callback);
};

export { search, refresh, reindexAll };
