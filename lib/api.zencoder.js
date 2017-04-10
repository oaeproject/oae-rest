/*!
 * Copyright 2016 Apereo Foundation (AF) Licensed under the
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

/**
 * Notify the server that encoding for a particular media item has completed.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Object}         body                The request body containing the Zencoder notification
 * @param  {Object}         callback.err        Error object containing error code and error message
 */
var encodingComplete = module.exports.encodingComplete = function(restCtx, body, callback) {
    RestUtil.RestRequest(restCtx, '/api/zencoder/encodingNotification', 'POST', body, callback);
};
