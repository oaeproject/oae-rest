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
const HTTP_POST = 'POST';

/**
 * Get the list of followers of a user
 *
 * @param  {RestContext}    restCtx                     The REST context with which to make the request
 * @param  {String}         userId                      The id of the user whose followers to get
 * @param  {Number}         [start]                     The id of the user from which to start returning this page of results
 * @param  {Number}         [limit]                     The maximum number of users to return
 * @param  {Function}       callback                    Standard callback method
 * @param  {Object}         callback.err                An error that occurred, if any
 * @param  {Object}         callback.response           A response containing the followers
 * @param  {User[]}         callback.response.results   The users that follow the user specified by `userId`
 * @param  {String}         callback.response.nextToken The token to use as the `start` parameter for the next page of followers
 */
const getFollowers = (restCtx, userId, start, limit, callback) => {
  doRequest(
    restCtx,
    `/api/following/${encodeURIComponent(userId)}/followers`,
    HTTP_GET,
    { start, limit },
    parseResponse(callback)
  );
};

/**
 * Get the list of users that the user specified by `userId` follows
 *
 * @param  {RestContext}    restCtx                     The REST context with which to make the request
 * @param  {String}         userId                      The id of the user whose following list to get
 * @param  {Number}         [start]                     The is of the user from which to start returning this page of results
 * @param  {Number}         [limit]                     The maximum number of activities to return
 * @param  {Function}       callback                    Standard callback method
 * @param  {Object}         callback.err                An error that occurred, if any
 * @param  {Object}         callback.response           A response containing the users that the specified user follows
 * @param  {User[]}         callback.response.results   The users that the specified user is following
 * @param  {String}         callback.response.nextToken The token to use as the `start` parameter for the next page of followed users
 */
const getFollowing = (restCtx, userId, start, limit, callback) => {
  doRequest(
    restCtx,
    `/api/following/${encodeURIComponent(userId)}/following`,
    HTTP_GET,
    { start, limit },
    parseResponse(callback)
  );
};

/**
 * Start following a user
 *
 * @param  {RestContext}    restCtx         The REST context with which to make the request
 * @param  {String}         userId          The id of the user to follow
 * @param  {Function}       callback        Invoked when the process completes
 * @param  {Object}         callback.err    An error that occurred, if any
 */
const follow = (restCtx, userId, callback) => {
  doRequest(restCtx, `/api/following/${encodeURIComponent(userId)}/follow`, HTTP_POST, null, parseResponse(callback));
};

/**
 * Stop following a user
 *
 * @param  {RestContext}    restCtx         The REST context with which to make the request
 * @param  {String}         userId          The id of the user to unfollow
 * @param  {Function}       callback        Invoked when the process completes
 * @param  {Object}         callback.err    An error that occurred, if any
 */
const unfollow = (restCtx, userId, callback) => {
  doRequest(restCtx, `/api/following/${encodeURIComponent(userId)}/unfollow`, HTTP_POST, null, parseResponse(callback));
};

export { getFollowers, getFollowing, follow, unfollow };
