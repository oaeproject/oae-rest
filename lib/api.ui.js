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

const RestUtil = require('./util');

/**
 * Get all of the widget manifest files through the REST API.
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Function}     callback            Standard callback method
 * @param  {Object}       callback.err        Error object containing error code and error message
 * @param  {Object}       callback.manifests  The aggregated widget manifest files where the keys represent the widget ids and the values contain the widget manifest.
 */
const getWidgetManifests = (restCtx, callback) => {
  RestUtil.RestRequest(restCtx, '/api/ui/widgets', 'GET', null, callback);
};

/**
 * Get the file content for a number of static files through the REST API.
 *
 * @param  {RestContext}        restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String|String[]}    files               A path or array of paths relative to the 3akai-ux folder that need to be retrieved.
 * @param  {Function}           callback            Standard callback method
 * @param  {Object}             callback.err        Error object containing error code and error message
 * @param  {String[]}           callback.data       Array containing the file content for the requested static files.
 */
const getStaticBatch = (restCtx, files, callback) => {
  if (!Array.isArray(files)) {
    files = [files];
  }
  RestUtil.RestRequest(restCtx, '/api/ui/staticbatch', 'GET', { files }, callback);
};

/**
 * Retrieve the CSS for a specific tenant.
 *
 * @param  {RestContext}        restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Function}           callback            Standard callback method
 * @param  {Object}             callback.err        Error object containing error code and error message
 * @param  {String}             callback.css        The skin file for this tenant (in CSS).
 */
const getSkin = function(restCtx, callback) {
  RestUtil.RestRequest(restCtx, '/api/ui/skin', 'GET', null, callback);
};

/**
 * Retrieve the URL for the logo of a specific tenant.
 *
 * @param  {RestContext}        restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Function}           callback            Standard callback method
 * @param  {Object}             callback.err        Error object containing error code and error message
 * @param  {String}             callback.css        The URL String for the logo of this tenant.
 */
const getLogo = function(restCtx, callback) {
  RestUtil.RestRequest(restCtx, '/api/ui/logo', 'GET', null, callback);
};

/**
 * Get the skin variables that are defined in the UI's skin file.
 *
 * @param  {RestContext}    restCtx                 Standard REST Context object associated to an administrator.
 * @param  {String}         tenantAlias             The alias of the tenant for which the variables should be retrieved.
 * @param  {Function}       callback                Standard callback method
 * @param  {Object}         callback.err            Error object containing error code and error message
 * @param  {Object}         callback.variables      The variables grouped by their respective groups.
 */
const getSkinVariables = function(restCtx, tenantAlias, callback) {
  RestUtil.RestRequest(restCtx, '/api/ui/skin/variables', 'GET', { tenant: tenantAlias }, callback);
};

/**
 * Upload a new logo file to use as the tenant logo
 *
 * @param  {RestContext}    restCtx                 Standard REST Context object associated to an administrator.
 * @param  {Function}       fileGenerator           A method that returns an open stream to a file
 * @param  {String}         tenantAlias             The alias of the tenant for which the variables should be retrieved.
 * @param  {Function}       callback                Standard callback method
 * @param  {Object}         callback.err            Error object containing error code and error message
 * @param  {Object}         callback.url            The variables grouped by their respective groups.
 */
const uploadLogo = function(restCtx, file, tenantAlias, callback) {
  const params = {
    file,
    tenantAlias
  };
  RestUtil.RestRequest(restCtx, '/api/ui/skin/logo', 'POST', params, callback);
};

module.exports = {
  getWidgetManifests,
  getStaticBatch,
  getSkin,
  getLogo,
  getSkinVariables,
  uploadLogo
};
