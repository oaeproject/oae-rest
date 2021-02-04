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

import * as RestUtil from './util.js';

const HTTP_GET = 'GET';
const HTTP_POST = 'POST';

/**
 * Get the global config schema through the REST API. This should only return for a global or tenant admin.
 *
 * @param  {RestContext}   restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Function}      callback            Standard callback method
 * @param  {Object}        callback.err        Error object containing error code and error message
 * @param  {Object}        callback.schema     JSON object representing the global config schema
 */
const getSchema = (restCtx, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/config/schema', HTTP_GET, null, callback);
};

/**
 * Get the global or tenant config through the REST API.
 *
 * @param  {RestContext}   restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}        [tenantAlias]       Optional tenant alias of the tenant to get configuration of. If no tenantAlias is passed in, the current tenant will be used
 * @param  {Function}      callback            Standard callback method
 * @param  {Object}        callback.err        Error object containing error code and error message
 * @param  {Object}        callback.config     JSON object representing the global/tenant config values
 */
const getTenantConfig = (restCtx, tenantAlias, callback) => {
  let url = '/api/config';
  if (tenantAlias) {
    url += `/${RestUtil.encodeURIComponent(tenantAlias)}`;
  }

  RestUtil.performRestRequest(restCtx, url, HTTP_GET, null, callback);
};

/**
 * Update a configuration values for a specific tenant
 *
 * @param  {RestContext}   restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global/tenant admin context will need to be passed in.
 * @param  {String}        [tenantAlias]   Optional tenant alias of the tenant to get configuration of. If no tenantAlias is passed in, the current tenant will be used.
 * @param  {Object}        update          The object that contains the updates that should be made. The keys are of the form `oae-authentication/twitter/enabled`.
 * @param  {Function}      callback        Standard callback method
 * @param  {Object}        callback.err    Error object containing error code and error message
 */
const updateConfig = (restCtx, tenantAlias, update, callback) => {
  let url = '/api/config';
  if (tenantAlias) {
    url += `/${RestUtil.encodeURIComponent(tenantAlias)}`;
  }

  RestUtil.performRestRequest(restCtx, url, HTTP_POST, update, callback);
};

/**
 * Clear configuration values for a specific tenant
 *
 * @param  {RestContext}   restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global/tenant admin context will need to be passed in.
 * @param  {String}        [tenantAlias]   Optional tenant alias of the tenant to get configuration of. If no tenantAlias is passed in, the current tenant will be used.
 * @param  {String[]}      configFields    The config fields that should be cleared.
 * @param  {Function}      callback        Standard callback method
 * @param  {Object}        callback.err    Error object containing error code and error message
 */
const clearConfig = (restCtx, tenantAlias, configFields, callback) => {
  let url = '/api/config';
  if (tenantAlias) {
    url += `/${RestUtil.encodeURIComponent(tenantAlias)}`;
  }

  url += '/clear';
  RestUtil.performRestRequest(restCtx, url, HTTP_POST, { configFields }, callback);
};

export { getSchema, getTenantConfig, clearConfig, updateConfig };
