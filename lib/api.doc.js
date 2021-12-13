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
import { performRestRequest, encodeURIComponent, parseResponse } from './util.js';

const doRequest = callbackify(performRestRequest);

const HTTP_GET = 'GET';

/**
 * Get a list of all of the available modules of a certain type through the REST API.
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}       type                The type of modules being listed. Accepted values are `backend` or `frontend`.
 * @param  {Function}     callback            Standard callback method
 * @param  {Object}       callback.err        Error object containing error code and error message
 * @param  {String[]}     callback.modules    Array containing the names of all of the available modules
 */
const getModules = (restCtx, type, callback) => {
  doRequest(restCtx, `/api/doc/${encodeURIComponent(type)}`, HTTP_GET, null, parseResponse(callback));
};

/**
 * Get the documentation of a particular module through the REST API.
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}       type                The type of module to get documentation for. Accepted values are `backend` or `frontend`.
 * @param  {String}       moduleId            The module to get the documentation for
 * @param  {Function}     callback            Standard callback method
 * @param  {Object}       callback.err        Error object containing error code and error message
 * @param  {Dox}          callback.doc        Dox object containing the JSDoc information for the requested module
 */
const getModuleDocumentation = (restCtx, type, moduleId, callback) => {
  doRequest(
    restCtx,
    `/api/doc/${encodeURIComponent(type)}/${encodeURIComponent(moduleId)}`,
    HTTP_GET,
    null,
    parseResponse(callback)
  );
};

export { getModules, getModuleDocumentation };
