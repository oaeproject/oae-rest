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

import * as RestUtil from './util';
import { compose, not, is } from 'ramda';

const HTTP_GET = 'GET';
const HTTP_POST = 'POST';
const HTTP_PUT = 'PUT';
const HTTP_DELETE = 'DELETE';

const isNotArray = compose(not, is(Array));

/**
 * Get all of the widget manifest files through the REST API.
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Function}     callback            Standard callback method
 * @param  {Object}       callback.err        Error object containing error code and error message
 * @param  {Object}       callback.manifests  The aggregated widget manifest files where the keys represent the widget ids and the values contain the widget manifest.
 */
const getWidgetManifests = (restCtx, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/ui/widgets', HTTP_GET, null, callback);
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
  if (isNotArray(files)) {
    files = [files];
  }

  RestUtil.performRestRequest(restCtx, '/api/ui/staticbatch', HTTP_GET, { files }, callback);
};

/**
 * Retrieve the CSS for a specific tenant.
 *
 * @param  {RestContext}        restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Function}           callback            Standard callback method
 * @param  {Object}             callback.err        Error object containing error code and error message
 * @param  {String}             callback.css        The skin file for this tenant (in CSS).
 */
const getSkin = (restCtx, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/ui/skin', HTTP_GET, null, callback);
};

/**
 * Retrieve the URL for the logo of a specific tenant.
 *
 * @param  {RestContext}        restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Function}           callback            Standard callback method
 * @param  {Object}             callback.err        Error object containing error code and error message
 * @param  {String}             callback.css        The URL String for the logo of this tenant.
 */
const getLogo = (restCtx, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/ui/logo', HTTP_GET, null, callback);
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
const getSkinVariables = (restCtx, tenantAlias, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/ui/skin/variables', HTTP_GET, { tenant: tenantAlias }, callback);
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
const uploadLogo = (restCtx, file, tenantAlias, callback) => {
  const params = {
    file,
    tenantAlias
  };
  RestUtil.performRestRequest(restCtx, '/api/ui/skin/logo', HTTP_POST, params, callback);
};

export { getWidgetManifests, getStaticBatch, getSkin, getLogo, getSkinVariables, uploadLogo };
