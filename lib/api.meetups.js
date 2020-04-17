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

import * as RestUtil from './util';

const API_ENDPOINT = '/api/meetups';

const HTTP_GET = 'GET';
const HTTP_POST = 'POST';
const HTTP_PUT = 'PUT';
const HTTP_DELETE = 'DELETE';

/**
 * Create a new meetup through the REST API.
 *
 * @param {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param {String}          groupId             ID of the group in which to start the meeting
 * @param {Function}        callback            Standard callback method
 * @param {Object}          callback.err        Error object containing error code and error message
 */
const joinMeetup = (restCtx, groupId, callback) => {
  RestUtil.performRestRequest(restCtx, `${API_ENDPOINT}/${groupId}/join`, HTTP_GET, null, callback);
};

/**
 * End a meetup through the REST API
 *
 * @param {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param {String}          groupId             ID of the group in which to end the meeting
 * @param {Function}        callback            Standard callback method
 * @param {Object}          callback.err        Error object containing error code and error message
 */
const endMeetup = (restCtx, groupId, callback) => {
  RestUtil.performRestRequest(restCtx, `${API_ENDPOINT}/${groupId}/end`, HTTP_POST, null, callback);
};

/**
 * Check whether a meeting is running
 *
 * @param {RestContext}     restCtx                     Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param {String}          groupId                     ID of the group in which to end the meeting
 * @param {Function}        callback                    Standard callback method
 * @param {Object}          callback.err                Error object containing error code and error message
 * @param {Boolean}         callback.isStillRunning     Boolean specifying whether the meetup is still running
 */
const isMeetingRunning = (restCtx, groupId, callback) => {
  RestUtil.performRestRequest(restCtx, `${API_ENDPOINT}/${groupId}/isMeetingRunning`, HTTP_GET, null, callback);
};

/**
 * Create a link to a meetup recording
 *
 * @param {RestContext}     restCtx                     Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param {String}          groupId                     ID of the group in which to end the meeting
 * @param {String}          signedParameters            Recording parameters
 * @param {Function}        callback                    Standard callback method
 * @param {Object}          callback.err                Error object containing error code and error message
 */
const createMeetupRecordingLink = (restCtx, groupId, signedParameters, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `${API_ENDPOINT}/${groupId}/recording`,
    HTTP_POST,
    {
      signedParameters
    },
    callback
  );
};

export { joinMeetup, endMeetup, isMeetingRunning, createMeetupRecordingLink };
