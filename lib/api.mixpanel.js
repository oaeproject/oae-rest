/*!
 * Copyright 2015 Apereo Foundation (AF) Licensed under the
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

var RestUtil = require('./util');


/////////////
// CONTENT //
/////////////

/**
 * Get the total uploaded file size stats for the current month
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Object}         callback            Standard callback function
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Object}         callback.stats      Object containing the total uploaded file size stats
 */
var getUploadedFilesFileSize = module.exports.getUploadedFilesFileSize = function(restCtx, callback) {
    RestUtil.RestRequest(restCtx, '/api/mixpanel/stats/fileSize', 'GET', null, callback);
};

/**
 * Get the total uploaded file size stats for a specific tenant for the current month
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         tenantAlias         The alias of the tenant to get the unique users stats for
 * @param  {Object}         callback            Standard callback function
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Object}         callback.stats      Object containing the total uploaded file size stats
 */
var getUploadedFilesFileSizeForTenant = module.exports.getUploadedFilesFileSizeForTenant = function(restCtx, tenantAlias, callback) {
    RestUtil.RestRequest(restCtx, '/api/mixpanel/stats/fileSize/' + tenantAlias, 'GET', null, callback);
};


///////////
// USERS //
///////////

/**
 * Get the unique user count stats for the current month
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Object}         callback            Standard callback function
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Object}         callback.stats      Object containing the unique user stats
 */
var getUniqueUsers = module.exports.getUniqueUsers = function(restCtx, callback) {
    RestUtil.RestRequest(restCtx, '/api/mixpanel/stats/uniqueUsers', 'GET', null, callback);
};

/**
 * Get the unique user count stats for a specific tenant for the current month
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         tenantAlias         The alias of the tenant to get the unique users stats for
 * @param  {Object}         callback            Standard callback function
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Object}         callback.stats      Object containing the unique user stats
 */
var getUniqueUsersForTenant = module.exports.getUniqueUsersForTenant = function(restCtx, tenantAlias, callback) {
    RestUtil.RestRequest(restCtx, '/api/mixpanel/stats/uniqueUsers/' + tenantAlias, 'GET', null, callback);
};
