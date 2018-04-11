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

const API_ENDPOINT = '/api/meeting-jitsi';

/**
 * Create a new meeting through the REST API.
 *
 * @param {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param {String}          displayName         Display name for the created meeting item
 * @param {String}          description         The meeting item's description
 * @param {Boolean}         chat                The meeting items's chat option
 * @param {Boolean}         contactList         The meeting item's contactList option
 * @param {String}          visibility          The meeting item's visibility. This can be public, loggedin or private
 * @param {String[]}        managers            Array of user/group ids that should be added as managers to the meeting item
 * @param {String[]}        members             Array of user/group ids that should be added as members to the meeting item
 * @param {Function}        callback            Standard callback method
 * @param {Object}          callback.err        Error object containing error code and error message
 * @param {Meeting}         callback.meeting    Meeting object representing the created meeting
 */
const createMeeting = function(
  restCtx,
  displayName,
  description,
  chat,
  contactList,
  visibility,
  managers,
  members,
  callback
) {
  const params = {
    displayName,
    description,
    visibility,
    chat,
    contactList,
    managers,
    members
  };
  RestUtil.RestRequest(restCtx, API_ENDPOINT + '/create', 'POST', params, callback);
};

/**
 * Get meeting members through the REST API.
 *
 * @param {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param {String}          meetingId           Meeting id of the meeting item we're trying to retrieve the members for
 * @param {String}          start               The principal id to start from (this will not be included in the response)
 * @param {Number}          limit               The number of members to retrieve
 * @param {Function}        callback            Standard callback method
 * @param {Object}          callback.err        Error object containing error code and error message
 * @param {User[]|Group[]}  callback.members    Array that contains an object for each member. Each object has a role property that contains the role of the member and a profile property that contains the principal profile of the member
 */
const getMembers = function(restCtx, meetingId, start, limit, callback) {
  const params = {
    start,
    limit
  };
  RestUtil.RestRequest(
    restCtx,
    API_ENDPOINT + '/' + RestUtil.encodeURIComponent(meetingId) + '/members',
    'GET',
    params,
    callback
  );
};

/**
 * Update a meeting item's metadata through the REST API.
 *
 * @param {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param {String}          meetingId           Meeting id of the meeting item we're trying to update
 * @param {Object}          params              JSON object where the keys represent all of the profile field names we want to update and the values represent the new values for those fields
 * @param {Function}        callback            Standard callback method
 * @param {Object}          callback.err        Error object containing error code and error message
 * @param {Meeting}         callback.meeting    The updated meeting object
 */
const updateMeeting = function(restCtx, meetingId, params, callback) {
  RestUtil.RestRequest(
    restCtx,
    API_ENDPOINT + '/' + RestUtil.encodeURIComponent(meetingId),
    'PUT',
    params,
    callback
  );
};

/**
 * Delete a meeting item through the REST API.
 *
 * @param {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param {String}          meetingId           Meeting id of the meeting item we're trying to delete
 * @param {Function}        callback            Standard callback method
 * @param {Object}          callback.err        Error object containing error code and error message
 */
const deleteMeeting = function(restCtx, meetingId, callback) {
  RestUtil.RestRequest(
    restCtx,
    API_ENDPOINT + '/' + RestUtil.encodeURIComponent(meetingId),
    'DELETE',
    null,
    callback
  );
};

/**
 * Get a meeting item through the REST API.
 *
 * @param {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param {String}          meetingId           Meeting id of the meeting item we're trying to get
 * @param {Function}        callback            Standard callback method
 * @param {Object}          callback.err        Error object containing error code and error message
 * @param {Meeting}         callback.meeting    The updated meeting object
 */
const getMeeting = function(restCtx, meetingId, callback) {
  RestUtil.RestRequest(
    restCtx,
    API_ENDPOINT + '/' + RestUtil.encodeURIComponent(meetingId),
    'GET',
    null,
    callback
  );
};

/**
 * Get a principal meetings library through the REST API.
 *
 * @param {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param {String}          principalId         User or group id for who we want to retrieve the library
 * @param {Function}        callback            Standard callback method
 * @param {Object}          callback.err        Error object containing error code and error message
 * @param {Meeting[]}       callback.meeting    The updated meeting object
 */
const getMeetingsLibrary = function(restCtx, principalId, callback) {
  RestUtil.RestRequest(
    restCtx,
    API_ENDPOINT + '/library/' + RestUtil.encodeURIComponent(principalId),
    'GET',
    null,
    callback
  );
};

/**
 * Change the members and managers of a meeting item through the REST API.
 *
 * @param {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param {String}          meetingId           Meeting id of the meeting item we're trying to update the members for
 * @param {Object}          updatedMembers      JSON Object where the keys are the user/group ids we want to update membership for, and the values are the roles these members should get (manager or member). If false is passed in as a role, the principal will be removed as a member
 * @param {Function}        callback            Standard callback method
 * @param {Object}          callback.err        Error object containing error code and error message
 */
const updateMembers = function(restCtx, meetingId, updatedMembers, callback) {
  RestUtil.RestRequest(
    restCtx,
    API_ENDPOINT + '/' + RestUtil.encodeURIComponent(meetingId) + '/members',
    'PUT',
    updatedMembers,
    callback
  );
};

/**
 * Creates a comment on a meeting item or a reply to another comment if the `replyTo` parameter is specified
 *
 * @param {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param {String}          meetingId           Meeting id of the meeting item we're trying to comment on
 * @param {String}          body                The comment to be placed on the meeting item
 * @param {String}          replyTo             Id of the comment to reply to
 * @param {Function}        callback            Standard callback method
 * @param {Object}          callback.err        Error object containing error code and error message
 * @param {Comment}         callback.comment    The created comment
 */
const createComment = function(restCtx, meetingId, body, replyTo, callback) {
  RestUtil.RestRequest(
    restCtx,
    API_ENDPOINT + '/' + RestUtil.encodeURIComponent(meetingId) + '/messages',
    'POST',
    {
      body,
      replyTo
    },
    callback
  );
};

/**
 * Delete a comment from a meeting item
 *
 * @param {RestContext}     restCtx                  Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param {String}          meetingId                Meeting id of the meeting item we're trying to delete a comment from
 * @param {String}          created                  The timestamp (in millis since the epoch) that the comment to delete was created
 * @param {Function}        callback                 Standard callback method
 * @param {Object}          callback.err             Error object containing error code and error message
 * @param {Comment}         callback.softDeleted     If the comment is not deleted, but instead flagged as deleted because it has replies, this will return a stripped down comment object representing the deleted comment, with the `deleted` parameter set to `false`. If the comment has been properly deleted, no comment will be returned.
 */
const deleteComment = function(restCtx, meetingId, created, callback) {
  RestUtil.RestRequest(
    restCtx,
    API_ENDPOINT +
      '/' +
      RestUtil.encodeURIComponent(meetingId) +
      '/messages/' +
      RestUtil.encodeURIComponent(created),
    'DELETE',
    null,
    callback
  );
};

module.exports = {
  deleteComment,
  createComment,
  updateMembers,
  getMeetingsLibrary,
  getMeeting,
  deleteMeeting,
  updateMeeting,
  getMembers,
  createMeeting
};
