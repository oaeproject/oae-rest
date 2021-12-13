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

import { callbackify } from 'node:util';
import { parseResponse, performRestRequest, encodeURIComponent } from './util.js';

const doRequest = callbackify(performRestRequest);

const HTTP_GET = 'GET';
const HTTP_POST = 'POST';

/**
 * Get the invitations for the specified resource
 *
 * @param  {RestContext}        restCtx             Context of the current request
 * @param  {String}             resourceType        The resource type of the resource (i.e., the path part such as "content" for `/api/content`)
 * @param  {String}             resourceId          The id of the resource
 * @param  {Function}           callback            Standard callback function
 * @param  {Object}             callback.err        An error that occurred, if any
 * @param  {InvitationResult}   callback.result     The result of the request, containing the invitations
 */
const getInvitations = (restCtx, resourceType, resourceId, callback) => {
  resourceType = encodeURIComponent(resourceType);
  resourceId = encodeURIComponent(resourceId);
  doRequest(restCtx, `/api/${resourceType}/${resourceId}/invitations`, HTTP_GET, null, parseResponse(callback));
};

/**
 * Resend an invitation for the specified resource and email
 *
 * @param  {RestContext}        restCtx             Context of the current request
 * @param  {String}             resourceType        The resource type of the resource (i.e., the path part such as "content" for `/api/content`)
 * @param  {String}             resourceId          The id of the resource
 * @param  {String}             email               The email associated to the invitation
 * @param  {Function}           callback            Standard callback function
 * @param  {Object}             callback.err        An error that occurred, if any
 */
const resendInvitation = (restCtx, resourceType, resourceId, email, callback) => {
  resourceType = encodeURIComponent(resourceType);
  resourceId = encodeURIComponent(resourceId);
  email = encodeURIComponent(email);
  doRequest(
    restCtx,
    `/api/${resourceType}/${resourceId}/invitations/${email}/resend`,
    HTTP_POST,
    null,
    parseResponse(callback)
  );
};

/**
 * Accept an invitation with the specified token
 *
 * @param  {RestContext}                restCtx             Context of the current request
 * @param  {String}                     token               The token that was sent in the invitation email
 * @param  {Function}                   callback            Standard callback function
 * @param  {Object}                     callback.err        An error that occurred, if any
 * @param  {InvitationAcceptResult}     callback.result     The result of accepting the invitation, containing all resources to which the user became a member
 */
const acceptInvitation = (restCtx, token, callback) => {
  doRequest(restCtx, '/api/invitation/accept', HTTP_POST, { token }, parseResponse(callback));
};

export { getInvitations, resendInvitation, acceptInvitation };
