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

import { compose, not } from 'ramda';
import * as CropAPI from './api.crop.js';
import * as RestUtil from './util.js';

const HTTP_GET = 'GET';
const HTTP_POST = 'POST';
const HTTP_PUT = 'PUT';
const HTTP_DELETE = 'DELETE';

// Auxiliary functions
const isDefined = Boolean;
const isNotDefined = compose(not, isDefined);

/**
 * Creates a group through the REST API. Optional arguments will only be added if they are defined
 * and will be sent as is.
 *
 * @param  {RestContext}       restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}            displayName         The display name for this group
 * @param  {String}            [description]       The description for this group
 * @param  {String}            [visibility]        The visibility for this group. This can be 'public', 'loggedin' or 'private'
 * @param  {String}            [joinable]          Whether or not this group is joinable. This can be 'yes', 'no', or 'request'
 * @param  {String[]}          [managers]          An array of userIds that should be made managers
 * @param  {String[]}          [members]           An array of userIds that should be made members
 * @param  {Function}          callback            Standard callback function
 * @param  {Object}            callback.err        An error that occurred, if any
 * @param  {Group}             callback.response   A Group object representing the created group
 */
const createGroup = (restCtx, displayName, description, visibility, joinable, managers, members, callback) => {
  const postData = {
    displayName,
    description,
    visibility,
    joinable,
    managers,
    members
  };
  RestUtil.performRestRequest(restCtx, '/api/group/create', HTTP_POST, postData, callback);
};

/**
 * Deletes a group through the REST API.
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         groupId         The id of the group you wish to delete
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error that occurred, if any
 */
const deleteGroup = (restCtx, groupId, callback) => {
  return RestUtil.performRestRequest(
    restCtx,
    `/api/group/${RestUtil.encodeURIComponent(groupId)}`,
    HTTP_DELETE,
    null,
    callback
  );
};

/**
 * Restores a group through the REST API.
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         groupId         The id of the group you wish to restore
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error that occurred, if any
 */
const restoreGroup = (restCtx, groupId, callback) => {
  return RestUtil.performRestRequest(
    restCtx,
    `/api/group/${RestUtil.encodeURIComponent(groupId)}/restore`,
    HTTP_POST,
    null,
    callback
  );
};

/**
 * Get a group trough the REST API.
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}       groupId             The id of the group you wish to retrieve
 * @param  {Function}     callback            Standard callback function
 * @param  {Object}       callback.err        An error that occurred, if any
 * @param  {Group}        callback.response   The group object representing the requested group
 */
const getGroup = (restCtx, groupId, callback) => {
  RestUtil.performRestRequest(restCtx, `/api/group/${RestUtil.encodeURIComponent(groupId)}`, HTTP_GET, null, callback);
};

/**
 * Updates a group through the REST API. Optional arguments will only be added if they are defined
 * and will be sent as is.
 *
 * @param  {RestContext}    restCtx                       Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         groupId                       The id of the group you wish to update
 * @param  {Object}         profileFields                 Object where the keys represent the profile fields that need to be updated and the values represent the new values for those profile fieldss
 * @param  {String}         [profileFields.displayName]   New display name for the group
 * @param  {String}         [profileFields.description]   New description for the group
 * @param  {String}         [profileFields.visibility]    New visibility setting for the group. The possible values are 'private', 'loggedin' and 'public'
 * @param  {String}         [profileFields.joinable]      New joinability setting for the group. The possible values are 'yes', 'no' and 'request'
 * @param  {Function}       callback                      Standard callback method takes argument `err`
 * @param  {Object}         callback.err                  An error that occurred, if any
 * @param  {Group}          callback.updatedGroup         Group object representing the updated group
 */
const updateGroup = (restCtx, groupId, profileFields, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `/api/group/${RestUtil.encodeURIComponent(groupId)}`,
    HTTP_POST,
    profileFields,
    callback
  );
};

/**
 * Get the members of a group through the REST API.
 *
 * @param  {RestContext}        restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}             groupId             The id of the group you wish to update
 * @param  {String}             start               The principal id to start from (this will not be included in the response)
 * @param  {Number}             limit               The number of members to retrieve.
 * @param  {Function}           callback            Standard callback function
 * @param  {Object}             callback.err        An error that occurred, if any
 * @param  {Object}             callback.response   An object with key 'results', whose value is a mixed array of User and Group objects that are members of the group
 */
const getGroupMembers = (restCtx, groupId, start, limit, callback) => {
  const parameters = {
    start,
    limit
  };
  RestUtil.performRestRequest(
    restCtx,
    `/api/group/${RestUtil.encodeURIComponent(groupId)}/members`,
    HTTP_GET,
    parameters,
    callback
  );
};

/**
 * Update the members of a group through the REST API.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         groupId             The id of the group you wish to update
 * @param  {Object}         members             A hash object where each key is the id of a user or group and the value is one of 'manager', 'member' or false. In case the value is false, the member will be deleted.
 * @param  {Function}       callback            Standard callback method takes argument `err`
 * @param  {Object}         callback.err        An error that occurred, if any
 */
const setGroupMembers = (restCtx, groupId, members, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `/api/group/${RestUtil.encodeURIComponent(groupId)}/members`,
    HTTP_POST,
    members,
    callback
  );
};

/**
 * Join the group as the current user.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object of the current HTTP session
 * @param  {String}         groupId             The id of the group you wish to join
 * @param  {Function}       callback            Invoked when the request completes
 * @param  {Object}         callback.err        An error that occurred, if any
 */
const joinGroup = (restCtx, groupId, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `/api/group/${RestUtil.encodeURIComponent(groupId)}/join`,
    HTTP_POST,
    null,
    callback
  );
};

/**
 * Leave the group as the current user.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object of the current HTTP session
 * @param  {String}         groupId             The id of the group you wish to leave
 * @param  {Function}       callback            Invoked when the request completes
 * @param  {Object}         callback.err        An error that occurred, if any
 */
const leaveGroup = (restCtx, groupId, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `/api/group/${RestUtil.encodeURIComponent(groupId)}/leave`,
    HTTP_POST,
    null,
    callback
  );
};

/**
 * Returns all of the groups that a user is a direct and indirect member of through the REST API.
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}       userId              The user id for which we want to get all of the memberships
 * @param  {String}       start               The group id to start from (this will not be included in the response)
 * @param  {Number}       limit               The number of members to retrieve
 * @param  {Function}     callback            Standard callback function
 * @param  {Object}       callback.err        An error that occurred, if any
 * @param  {Group[]}      callback.response   An array of groups representing the direct and indirect memberships of the provided user
 */
const getMembershipsLibrary = (restCtx, userId, start, limit, callback) => {
  const parameters = {
    start,
    limit
  };
  RestUtil.performRestRequest(
    restCtx,
    `/api/user/${RestUtil.encodeURIComponent(userId)}/memberships`,
    HTTP_GET,
    parameters,
    callback
  );
};

/**
 * Uploads a new profile picture for a group and optionally resize it.
 *
 * @param  {RestContext}     restCtx                 Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}          groupId                 The id of the group we're trying to upload a new image for.
 * @param  {Function}        fileGenerator           A method that returns an open stream to a file.
 * @param  {Object}          [selectedArea]          If specified, this will crop the picture to the required rectangle and generate the 2 sizes.
 * @param  {Number}          [selectedArea.x]        The top left x coordinate.
 * @param  {Number}          [selectedArea.y]        The top left y coordinate.
 * @param  {Number}          [selectedArea.width]    The width of the rectangle
 * @param  {Number}          [selectedArea.height]   The height of the rectangle
 * @param  {Function}        callback                Standard callback method takes argument `err`
 * @param  {Object}          callback.err            An error that occurred, if any
 * @param  {Object}          callback.principal      The updated principal object.
 */
const uploadPicture = (restCtx, groupId, file, selectedArea, callback) => {
  const parameters = { file };
  if (isDefined(selectedArea)) {
    RestUtil.performRestRequest(
      restCtx,
      `/api/group/${RestUtil.encodeURIComponent(groupId)}/picture`,
      HTTP_POST,
      parameters,
      (error) => {
        if (error) return callback(error);

        CropAPI.cropPicture(restCtx, groupId, selectedArea, callback);
      }
    );
  } else {
    RestUtil.performRestRequest(
      restCtx,
      `/api/group/${RestUtil.encodeURIComponent(groupId)}/picture`,
      HTTP_POST,
      parameters,
      callback
    );
  }
};

/**
 * Download a group's picture. Returns a 404 if the group has no picture. This will only return the
 * image when it's run against the nginx server, as it's nginx who sends the picture stream.
 *
 * @param  {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}          groupId             The ID of the group we're trying to download a picture from.
 * @param  {String}          size                The picture size. One of `small`, `medium` or `large`.
 * @param  {Function}        callback            Standard callback method takes argument `err`
 * @param  {Object}          callback.err        An error that occurred, if any
 * @param  {Object}          callback.picture    The raw picture for this group.
 */
const downloadPicture = (restCtx, groupId, size, callback) => {
  if (isNotDefined(size)) return callback({ code: 400, msg: 'Missing size parameter' });

  RestUtil.performRestRequest(
    restCtx,
    `/api/group/${RestUtil.encodeURIComponent(groupId)}`,
    HTTP_GET,
    null,
    (error, group) => {
      if (error) return callback(error);

      if (not(group.picture[size])) {
        return callback({
          code: 404,
          msg: 'This group has no picture.'
        });
      }

      const url = group.picture[size];
      RestUtil.performRestRequest(restCtx, url, HTTP_GET, null, callback);
    }
  );
};

/**
 * Create a request
 *
 * @param  {RestContext}    restCtx         The REST context of a user who will perform the request
 * @param  {String}         groupId         The group id that the user requested to join
 * @param  {Function}       callback        Invoked when the mapping has been verified
 */
const createRequestJoinGroup = (restCtx, groupId, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `/api/group/${RestUtil.encodeURIComponent(groupId)}/join-request`,
    HTTP_POST,
    null,
    callback
  );
};

/**
 * Get a request
 *
 * @param  {RestContext}    restCtx         The REST context of a user who will perform the request
 * @param  {String}         groupId         The group id that the user requested to join
 * @param  {Function}       callback        Invoked when the mapping has been verified
 */
const getJoinGroupRequest = (restCtx, groupId, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `/api/group/${RestUtil.encodeURIComponent(groupId)}/join-request/mine`,
    HTTP_GET,
    null,
    callback
  );
};

/**
 * Get requests
 *
 * @param  {RestContext}    restCtx         The REST context of a user who will perform the request
 * @param  {String}         groupId         The group id that the user requested to join
 * @param  {Function}       callback        Invoked when the mapping has been verified
 */
const getJoinGroupRequests = (restCtx, groupId, callback) => {
  const parameters = {
    start: null,
    limit: null
  };
  RestUtil.performRestRequest(
    restCtx,
    `/api/group/${RestUtil.encodeURIComponent(groupId)}/join-request/all`,
    HTTP_GET,
    parameters,
    callback
  );
};

/**
 * Update a request
 *
 * @param  {RestContext}    restCtx         The REST context of a user who will perform the request
 * @param  {String}         groupId         The group id that the user requested to join
 * @param  {String}         principalId     The id of the principal who wants to join this group
 * @param  {String}         role            The role ask by the user who wants to join the group
 * @param  {String}         status          The status of the request
 * @param  {Function}       callback        Invoked when the mapping has been verified
 */
const updateJoinGroupByRequest = (restCtx, joinRequest, callback) => {
  const { groupId, principalId, role, status } = joinRequest;
  const parameters = {
    principalId,
    role,
    status
  };
  RestUtil.performRestRequest(
    restCtx,
    `/api/group/${RestUtil.encodeURIComponent(groupId)}/join-request`,
    HTTP_PUT,
    parameters,
    callback
  );
};

export {
  createGroup,
  deleteGroup,
  restoreGroup,
  getGroup,
  updateGroup,
  getGroupMembers,
  setGroupMembers,
  joinGroup,
  leaveGroup,
  getMembershipsLibrary,
  uploadPicture,
  downloadPicture,
  createRequestJoinGroup,
  getJoinGroupRequest,
  getJoinGroupRequests,
  updateJoinGroupByRequest
};
