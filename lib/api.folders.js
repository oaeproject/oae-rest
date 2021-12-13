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
const HTTP_DELETE = 'DELETE';

/**
 * Get a folder by its id
 *
 * @param  {RestContext}    restCtx             The context of the current request
 * @param  {String}         folderId            The id of the folder to retrieve
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error object, if any
 * @param  {Folder}         callback.folder     The retrieved folder
 */
const getFolder = (restCtx, folderId, callback) => {
  doRequest(restCtx, `/api/folder/${encodeURIComponent(folderId)}`, HTTP_GET, null, parseResponse(callback));
};

/**
 * Create a folder
 *
 * @param  {RestContext}    restCtx             The context of the current request
 * @param  {String}         displayName         The name for the new folder
 * @param  {String}         description         The description for the new folder
 * @param  {String}         visibility          The visibliity for the new visibility
 * @param  {String[]}       managers            The ids of the users and/or groups who can manage the new folder
 * @param  {String[]}       viewers             The ids of the users and/or groups who can view the new folder
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error object, if any
 * @param  {Folder}         callback.folder     The created folder
 */
const createFolder = (restCtx, displayName, description, visibility, managers, viewers, callback) => {
  const parameters = {
    displayName,
    description,
    visibility,
    managers,
    viewers
  };
  doRequest(restCtx, `/api/folder`, HTTP_POST, parameters, parseResponse(callback));
};

/**
 * Update a folder
 *
 * @param  {RestContext}    restCtx                         The context of the current request
 * @param  {String}         folderId                        The id of the folder that should be updated
 * @param  {Object}         updates                         The updates that should be made
 * @param  {String}         [updates.displayName]           The new display name for the folder
 * @param  {String}         [updates.description]           The new description for the folder
 * @param  {String}         [updates.visibility]            The new visibility for the folder
 * @param  {String}         [updates.applyVisibilityOn]     Expresses whether the visibility should be applied on the content items in the folder. One of `folder` or `folderAndContent`
 * @param  {Function}       callback                        Standard callback function
 * @param  {Object}         callback.err                    An error object, if any
 */
const updateFolder = (restCtx, folderId, updates, callback) => {
  doRequest(restCtx, `/api/folder/${encodeURIComponent(folderId)}`, HTTP_POST, updates, parseResponse(callback));
};

/**
 * Update a folder's content items
 *
 * @param  {RestContext}    restCtx                         The context of the current request
 * @param  {String}         folderId                        The id of the folder whose content items should be updated
 * @param  {String}         visibility                      The new visibility for the content items in the folder
 * @param  {Function}       callback                        Standard callback function
 * @param  {Object}         callback.err                    An error object, if any
 */
const updateFolderContentVisibility = (restCtx, folderId, visibility, callback) => {
  const parameters = { visibility };
  const url = `/api/folder/${encodeURIComponent(folderId)}/contentvisibility`;
  doRequest(restCtx, url, HTTP_POST, parameters, parseResponse(callback));
};

/**
 * Delete a folder
 *
 * @param  {RestContext}    restCtx                         The context of the current request
 * @param  {String}         folderId                        The id of the folder that should be removed
 * @param  {Boolean}        deleteContent                   whether or not to delete the content in the folder as well
 * @param  {Function}       callback                        Standard callback function
 * @param  {Object}         callback.err                    An error object, if any
 */
const deleteFolder = (restCtx, folderId, deleteContent, callback) => {
  const parameters = {
    deleteContent
  };
  doRequest(restCtx, `/api/folder/${encodeURIComponent(folderId)}`, HTTP_DELETE, parameters, parseResponse(callback));
};

/**
 * Share a folder with one or more users and groups
 *
 * @param  {RestContext}    restCtx             The context of the current request
 * @param  {String}         folderId            The id of the folder that should be shared
 * @param  {String[]}       principalIds        The ids of the users and/or groups with whom the folder should be shared
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error object, if any
 */
const shareFolder = (restCtx, folderId, principalIds, callback) => {
  doRequest(
    restCtx,
    `/api/folder/${encodeURIComponent(folderId)}/share`,
    HTTP_POST,
    { viewers: principalIds },
    parseResponse(callback)
  );
};

/**
 * Update a folder's members
 *
 * @param  {RestContext}    restCtx             The context of the current request
 * @param  {String}         folderId            The id of the folder for which the members should be updated
 * @param  {Object}         memberUpdates       An object where the keys hold the user and/or group ids and the values hold the new role for the principal. Setting a value to `false` will remove the user/group
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error object, if any
 */
const updateFolderMembers = (restCtx, folderId, memberUpdates, callback) => {
  doRequest(
    restCtx,
    `/api/folder/${encodeURIComponent(folderId)}/members`,
    HTTP_POST,
    memberUpdates,
    parseResponse(callback)
  );
};

/**
 * Get the members for a folder
 *
 * @param  {RestContext}    restCtx                         The context of the current request
 * @param  {String}         folderId                        The id of the folder for which the members should be updated
 * @param  {String}         [start]                         The id of the principal from which to begin the page of results (exclusively). By default, begins from the first in the list.
 * @param  {Number}         [limit]                         The maximum number of results to return. Default: 10
 * @param  {Function}       callback                        Standard callback function
 * @param  {Object}         callback.err                    An error object, if any
 * @param  {Object[]}       callback.members                Array that contains an object for each member
 * @param  {String}         callback.members[i].role        The role of the member at index `i`
 * @param  {User|Group}     callback.members[i].profile     The principal profile of the member at index `i`
 */
const getFolderMembers = (restCtx, folderId, start, limit, callback) => {
  const parameters = {
    start,
    limit
  };
  doRequest(
    restCtx,
    `/api/folder/${encodeURIComponent(folderId)}/members`,
    HTTP_GET,
    parameters,
    parseResponse(callback)
  );
};

/**
 * Get the folders that a principal is a member or manager for
 *
 * @param  {RestContext}    restCtx                         The context of the current request
 * @param  {String}         principalId                     The id of the principal for whom to retrieve the folders
 * @param  {String}         [start]                         The id of the folder from which to begin the page of results (exclusively). By default, begins from the first in the list.
 * @param  {Number}         [limit]                         The maximum number of results to return. Default: 10
 * @param  {Function}       callback                        Standard callback function
 * @param  {Object}         callback.err                    An error object, if an
 * @param  {Object}         callback.result                 Holds the result set
 * @param  {Folder[]}       callback.result.results         Holds the returned folder
 * @param  {String}         callback.result.nextToken       Holds the folder id that should be used if the next page of folders needs to be retrieved
 */
const getFoldersLibrary = (restCtx, principalId, start, limit, callback) => {
  const parameters = {
    start,
    limit
  };
  doRequest(
    restCtx,
    `/api/folder/library/${encodeURIComponent(principalId)}`,
    HTTP_GET,
    parameters,
    parseResponse(callback)
  );
};

/**
 * Get the folders the current user manages
 *
 * @param  {RestContext}    restCtx             The context of the current request
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error object, if any
 * @param  {Folder[]}       callback.folders    The folders the current user manages
 */
const getManagedFolders = (restCtx, callback) => {
  doRequest(restCtx, '/api/folder/managed', HTTP_GET, null, parseResponse(callback));
};

/**
 * Remove a folder from a principal library
 *
 * @param  {RestContext}    restCtx         The context of the current request
 * @param  {String}         principalId     The id of the principal from which to remove the folder
 * @param  {String}         folderId        The id of the folder that needs to be removed
 * @param  {String[]}       contentIds      One or more ids of content items that should be added to the folder
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error object, if any
 */
const removeFolderFromLibrary = (restCtx, principalId, folderId, callback) => {
  let url = '/api/folder/library';
  url += `/${encodeURIComponent(principalId)}`;
  url += `/${encodeURIComponent(folderId)}`;
  doRequest(restCtx, url, HTTP_DELETE, null, parseResponse(callback));
};

/**
 * Add one or more content items to a folder
 *
 * @param  {RestContext}    restCtx         The context of the current request
 * @param  {String}         folderId        The id of the folder that the content items need to be added to
 * @param  {String[]}       contentIds      One or more ids of content items that should be added to the folder
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error object, if any
 */
const addContentItemsToFolder = (restCtx, folderId, contentIds, callback) => {
  doRequest(
    restCtx,
    `/api/folder/${encodeURIComponent(folderId)}/library`,
    HTTP_POST,
    { contentIds },
    parseResponse(callback)
  );
};

/**
 * Remove one or more content items from a folder
 *
 * @param  {RestContext}    restCtx         The context of the current request
 * @param  {String}         folderId        The id of the folder that the content items need to be removed from
 * @param  {String[]}       contentIds      One or more ids of content items that should be removed from the folder
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error object, if any
 */
const removeContentItemsFromFolder = (restCtx, folderId, contentIds, callback) => {
  doRequest(
    restCtx,
    `/api/folder/${encodeURIComponent(folderId)}/library`,
    HTTP_DELETE,
    { contentIds },
    parseResponse(callback)
  );
};

/**
 * Get the content items in a folder
 *
 * @param  {RestContext}    restCtx                         The context of the current request
 * @param  {String}         folderId                        The id of the folder that should be listed
 * @param  {String}         [start]                         The id of the content item from which to begin the page of results (exclusively). By default, begins from the first in the list.
 * @param  {Number}         [limit]                         The maximum number of results to return. Default: 10
 * @param  {Function}       callback                        Standard callback function
 * @param  {Object}         callback.err                    An error object, if any
 * @param  {Object}         callback.result                 Holds the result set
 * @param  {Content[]}      callback.result.results         Holds the returned content items
 * @param  {String}         callback.result.nextToken       Holds the content id that should be used if the next page of content items needs to be retrieved
 */
const getFolderContentLibrary = (restCtx, folderId, start, limit, callback) => {
  const parameters = {
    start,
    limit
  };
  doRequest(
    restCtx,
    `/api/folder/${encodeURIComponent(folderId)}/library`,
    HTTP_GET,
    parameters,
    parseResponse(callback)
  );
};

/**
 * Create a new message in the folder. If `replyTo` is specified, the message will be a reply to the message
 * in the folder identified by that timestamp.
 *
 * @param  {RestContext}    restCtx                     The context of the current request
 * @param  {String}         folderId                    The id of the folder to which to post the message
 * @param  {String}         body                        The body of the message to post
 * @param  {String|Number}  [replyTo]                   The created time of the message to which this is a reply, if applicable
 * @param  {Function}       callback                    Invoked when the process completes
 * @param  {Object}         callback.err                An error that occurred, if any
 * @param  {Message}        callback.message            The message object that was created
 */
const createMessage = (restCtx, folderId, body, replyTo, callback) => {
  const parameters = {
    body,
    replyTo
  };
  doRequest(
    restCtx,
    `/api/folder/${encodeURIComponent(folderId)}/messages`,
    HTTP_POST,
    parameters,
    parseResponse(callback)
  );
};

/**
 * Get a list of messages from the specified folder.
 *
 * @param  {RestContext}    restCtx                     The context of the current request
 * @param  {String}         folderId                    The id of the folder whose messages to fetch
 * @param  {String}         [start]                     The `threadKey` of the message from which to start retrieving messages (exclusively). By default, will start fetching from the most recent message
 * @param  {Number}         [limit]                     The maximum number of results to return. Default: 10
 * @param  {Function}       callback                    Invoked when the process completes
 * @param  {Object}         callback.err                An error that occurred, if any
 * @param  {Object}         callback.messages           An object containing the messages returned
 * @param  {Message[]}      callback.messages.results   The list of messages retrieved
 */
const getMessages = (restCtx, folderId, start, limit, callback) => {
  const parameters = {
    start,
    limit
  };
  doRequest(
    restCtx,
    `/api/folder/${encodeURIComponent(folderId)}/messages`,
    HTTP_GET,
    parameters,
    parseResponse(callback)
  );
};

/**
 * Deletes a message from a folder. Managers of the folder can delete all messages while people that have access
 * to the folder can only delete their own messages. Therefore, anonymous users will never be able to delete messages.
 *
 * @param  {RestContext}    restCtx                 The context of the current request
 * @param  {String}         folderId                The ID of the folder from which to delete the message
 * @param  {String}         messageCreated          The timestamp (in millis since the epoch) that the message we wish to delete was created
 * @param  {Function}       callback                Invoked when the process completes
 * @param  {Object}         callback.err            An error that occurred, if any
 * @param  {Comment}        [callback.softDeleted]  When the message has been soft deleted (because it has replies), a stripped down message object representing the deleted message will be returned, with the `deleted` parameter set to `false`. If the message has been deleted from the index, no message object will be returned.
 */
const deleteMessage = (restCtx, folderId, messageCreated, callback) => {
  doRequest(
    restCtx,
    `/api/folder/${encodeURIComponent(folderId)}/messages/${encodeURIComponent(messageCreated)}`,
    HTTP_DELETE,
    null,
    parseResponse(callback)
  );
};

export {
  getFolder,
  createFolder,
  updateFolder,
  updateFolderContentVisibility,
  deleteFolder,
  shareFolder,
  updateFolderMembers,
  getFolderMembers,
  getFoldersLibrary,
  getManagedFolders,
  removeFolderFromLibrary,
  addContentItemsToFolder,
  getFolderContentLibrary,
  removeContentItemsFromFolder,
  createMessage,
  getMessages,
  deleteMessage
};
