/*!
 * Copyright 2017 Apereo Foundation (AF) Licensed under the
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
 * Creates a LTI tool through the REST API. Optional arguments will only be added if they are defined
 * and will be sent as is.
 *
 * @param  {RestContext}   restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}        groupId             The id of the group this LTI tool belongs to
 * @param  {String}        url                 The launch URL for the new LTI tool
 * @param  {String}        secret              The OAUTH secret for the new LTI tool
 * @param  {String}        key                 The OAUTH consumer key for the new LTI tool
 * @param  {String}        [displayName]       The name of the new LTI tool (resource_link_title)
 * @param  {String}        [description]       A description of the new LTI tool (resource_link_description)
 * @param  {Function}      callback            Standard callback function
 * @param  {Object}        callback.err        An error that occurred, if any
 * @param  {LtiTool}       callback.response   A LTI tool object representing the created LTI tool
 */
const createLtiTool = (restCtx, groupId, url, secret, key, displayName, description, callback) => {
  const postData = {
    url,
    secret,
    key,
    displayName,
    description
  };
  RestUtil.performRestRequest(
    restCtx,
    '/api/lti/' + RestUtil.encodeURIComponent(groupId) + '/create',
    'POST',
    postData,
    callback
  );
};

/**
 * Deletes a LTI tool through the REST API.
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         groupId         The id of the group the LTI tool you wish to delete belongs to
 * @param  {String}         toolId          The id of the LTI tool you wish to delete
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error that occurred, if any
 */
const deleteLtiTool = (restCtx, groupId, toolId, callback) => {
  return RestUtil.performRestRequest(
    restCtx,
    '/api/lti/' + RestUtil.encodeURIComponent(groupId) + '/' + RestUtil.encodeURIComponent(toolId),
    'DELETE',
    null,
    callback
  );
};

/**
 * Get a LTI tool trough the REST API.
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         groupId             The id of the group the LTI tool belongs to
 * @param  {String}         toolId              The id of the LTI tool you wish to retrieve
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error that occurred, if any
 * @param  {LtiTool}        callback.response   The LTI tool object representing the requested LTI tool
 */
const getLtiTool = (restCtx, groupId, toolId, callback) => {
  return RestUtil.performRestRequest(
    restCtx,
    '/api/lti/' + RestUtil.encodeURIComponent(groupId) + '/' + RestUtil.encodeURIComponent(toolId),
    'GET',
    null,
    callback
  );
};

/**
 * Get the LTI tools belonging to a group through the REST API.
 *
 * @param  {RestContext}        restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}             groupId             The id of the group you wish to fetch LTI tools for
 * @param  {Function}           callback            Standard callback function
 * @param  {Object}             callback.err        An error that occurred, if any
 * @param  {LtiTool[]}          callback.tools      An array of LTI tool objects
 */
const getLtiTools = (restCtx, groupId, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    '/api/lti/' + RestUtil.encodeURIComponent(groupId),
    'GET',
    null,
    callback
  );
};

module.exports = {
  createLtiTool,
  deleteLtiTool,
  getLtiTool,
  getLtiTools
};
