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
import fs from 'node:fs';
import request from 'request';
import { is, compose, defaultTo, includes, and, not } from 'ramda';

import { parseResponse, fillCookieJar, performRestRequest, encodeURIComponent } from './util.js';

const doRequest = callbackify(performRestRequest);

const HTTP_GET = 'GET';
const HTTP_POST = 'POST';
const HTTP_DELETE = 'DELETE';

const FILE = 'file';
const LINK = 'link';
const COLLABDOC = 'collabdoc';
const COLLABSHEET = 'collabsheet';

const defaultToEmptyObject = defaultTo({});
const isString = is(String);

/**
 * Get a full content profile through the REST API.
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}       contentId           Content id of the content item we're trying to retrieve
 * @param  {Function}     callback            Standard callback method
 * @param  {Object}       callback.err        Error object containing error code and error message
 * @param  {Content}      callback.content    Content object representing the retrieved content
 */
const getContent = (restCtx, contentId, callback) => {
  doRequest(restCtx, `/api/content/${encodeURIComponent(contentId)}`, HTTP_GET, null, parseResponse(callback));
};

/**
 * Create a new link through the REST API.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         displayName         Display name for the created content item
 * @param  {String}         [description]       The content item's description
 * @param  {String}         [visibility]        The content item's visibility. This can be public, loggedin or private
 * @param  {String}         link                The URL that should be stored against this content item
 * @param  {String[]}       [managers]          Array of user/group ids that should be added as managers to the content item
 * @param  {String[]}       [viewers]           Array of user/group ids that should be added as viewers to the content item
 * @param  {String[]}       [folders]           Array of folder ids where the content item should be added to
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Content}        callback.content    Content object representing the created content
 */
const createLink = (restCtx, linkDetails, callback) => {
  const { displayName, description, visibility, link, managers, viewers, folders } = linkDetails;
  const parameters = {
    resourceSubType: LINK,
    displayName,
    description,
    visibility,
    link,
    managers,
    viewers,
    folders
  };
  doRequest(restCtx, '/api/content/create', HTTP_POST, parameters, parseResponse(callback));
};

/**
 * Create a new file through the REST API.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         displayName         Display name for the created content item
 * @param  {String}         [description]       The content item's description (optional)
 * @param  {String}         [visibility]        The content item's visibility. This can be public, loggedin or private and is optional
 * @param  {Function}       fileGenerator       A function that returns a stream which points to a file body
 * @param  {String[]}       [managers]          An optional array of user/group ids that should be added as managers to the content item
 * @param  {String[]}       [viewers]           An optional array of user/group ids that should be added as viewers to the content item
 * @param  {String[]}       [folders]           An optional array of folder ids where the content item should be added to
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Content}        callback.content    Content object representing the created content
 */
const createFile = (restCtx, fileDetails, callback) => {
  const { displayName, description, visibility, file, managers, viewers, folders } = fileDetails;
  const parameters = {
    resourceSubType: FILE,
    displayName,
    description,
    visibility,
    file,
    managers,
    viewers,
    folders
  };
  doRequest(restCtx, '/api/content/create', HTTP_POST, parameters, parseResponse(callback));
};

/**
 * Create a new collaborative document through the REST API.
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}       displayName         Display name for the created content item
 * @param  {String}       [description]       The content item's description
 * @param  {String}       [visibility]        The content item's visibility. This can be public, loggedin or private
 * @param  {String[]}     [managers]          Array of user/group ids that should be added as managers to the content item
 * @param  {String[]}     [editors]           Array of user/group ids that should be added as editors to the content item
 * @param  {String[]}     [viewers]           Array of user/group ids that should be added as viewers to the content item
 * @param  {String[]}     [folders]           Array of folder ids where the content item should be added to
 * @param  {Function}     callback            Standard callback method
 * @param  {Object}       callback.err        Error object containing error code and error message
 * @param  {Content}      callback.content    Content object representing the created content
 */
const createCollabDoc = (
  restCtx,
  displayName,
  description,
  visibility,
  managers,
  editors,
  viewers,
  folders,
  callback
) => {
  const parameters = {
    resourceSubType: COLLABDOC,
    displayName,
    description,
    visibility,
    managers,
    editors,
    viewers,
    folders
  };
  doRequest(restCtx, '/api/content/create', HTTP_POST, parameters, parseResponse(callback));
};

/**
 * Create a new collaborative spreadsheet through the REST API.
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}       displayName         Display name for the created content item
 * @param  {String}       [description]       The content item's description
 * @param  {String}       [visibility]        The content item's visibility. This can be public, loggedin or private
 * @param  {String[]}     [managers]          Array of user/group ids that should be added as managers to the content item
 * @param  {String[]}     [editors]           Array of user/group ids that should be added as editors to the content item
 * @param  {String[]}     [viewers]           Array of user/group ids that should be added as viewers to the content item
 * @param  {String[]}     [folders]           Array of folder ids where the content item should be added to
 * @param  {Function}     callback            Standard callback method
 * @param  {Object}       callback.err        Error object containing error code and error message
 * @param  {Content}      callback.content    Content object representing the created content
 */
const createCollabsheet = (
  restCtx,
  displayName,
  description,
  visibility,
  managers,
  editors,
  viewers,
  folders,
  callback
) => {
  const parameters = {
    resourceSubType: COLLABSHEET,
    displayName,
    description,
    visibility,
    managers,
    editors,
    viewers,
    folders
  };
  doRequest(restCtx, '/api/content/create', HTTP_POST, parameters, parseResponse(callback));
};

/**
 * Update a content item's metadata through the REST API.
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}       contentId           Content id of the content item we're trying to update
 * @param  {Object}       params              JSON object where the keys represent all of the profile field names we want to update and the values represent the new values for those fields
 * @param  {Function}     callback            Standard callback method
 * @param  {Object}       callback.err        Error object containing error code and error message
 * @param  {Content}      callback.content    The updated content object
 */
const updateContent = (restCtx, contentId, parameters, callback) => {
  doRequest(restCtx, `/api/content/${encodeURIComponent(contentId)}`, HTTP_POST, parameters, parseResponse(callback));
};

/**
 * Delete a content item through the REST API.
 *
 * @param  {RestContext}   restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}        contentId           Content id of the content item we're trying to delete
 * @param  {Function}      callback            Standard callback method
 * @param  {Object}        callback.err        Error object containing error code and error message
 */
const deleteContent = (restCtx, contentId, callback) => {
  doRequest(restCtx, `/api/content/${encodeURIComponent(contentId)}`, HTTP_DELETE, null, parseResponse(callback));
};

/**
 * Get the viewers and managers of a content item through the REST API.
 *
 * @param  {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}          contentId           Content id of the content item we're trying to retrieve the members for
 * @param  {String}          start               The principal id to start from (this will not be included in the response)
 * @param  {Number}          limit               The number of members to retrieve.
 * @param  {Function}        callback            Standard callback method
 * @param  {Object}          callback.err        Error object containing error code and error message
 * @param  {User[]|Group[]}  callback.members    Array that contains an object for each member. Each object has a role property that contains the role of the member and a profile property that contains the principal profile of the member
 */
const getMembers = (restCtx, contentId, start, limit, callback) => {
  const parameters = {
    start,
    limit
  };
  doRequest(
    restCtx,
    `/api/content/${encodeURIComponent(contentId)}/members`,
    HTTP_GET,
    parameters,
    parseResponse(callback)
  );
};

/**
 * Change the members and managers of a content item through the REST API.
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}       contentId           Content id of the content item we're trying to update the members for
 * @param  {Object}       updatedMembers      JSON Object where the keys are the user/group ids we want to update membership for, and the values are the roles these members should get (manager or viewer). If false is passed in as a role, the principal will be removed as a member
 * @param  {Function}     callback            Standard callback method
 * @param  {Object}       callback.err        Error object containing error code and error message
 */
const updateMembers = (restCtx, contentId, updatedMembers, callback) => {
  doRequest(
    restCtx,
    `/api/content/${encodeURIComponent(contentId)}/members`,
    HTTP_POST,
    updatedMembers,
    parseResponse(callback)
  );
};

/**
 * Share a content item through the REST API.
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}       contentId           Content id of the content item we're trying to share
 * @param  {String[]}     principals          Array of principal ids with who the content should be shared
 * @param  {Function}     callback            Standard callback method
 * @param  {Object}       callback.err        Error object containing error code and error message
 */
const shareContent = (restCtx, contentId, principals, callback) => {
  doRequest(
    restCtx,
    `/api/content/${encodeURIComponent(contentId)}/share`,
    HTTP_POST,
    { viewers: principals },
    parseResponse(callback)
  );
};

/**
 * Creates a comment on a content item or a reply to another comment if the `replyTo` parameter is specified
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}       contentId           Content id of the content item we're trying to comment on
 * @param  {String}       body                The comment to be placed on the content item
 * @param  {String}       [replyTo]           Id of the comment to reply to
 * @param  {Function}     callback            Standard callback method
 * @param  {Object}       callback.err        Error object containing error code and error message
 * @param  {Comment}      callback.comment    The created comment
 */
const createComment = (restCtx, contentId, body, replyTo, callback) => {
  doRequest(
    restCtx,
    `/api/content/${encodeURIComponent(contentId)}/messages`,
    HTTP_POST,
    { body, replyTo },
    parseResponse(callback)
  );
};

/**
 * Deletes a comment from a content item
 *
 * @param  {RestContext}  restCtx                  Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}       contentId                Content id of the content item we're trying to delete a comment from
 * @param  {String}       created                  The timestamp (in millis since the epoch) that the comment to delete was created
 * @param  {Function}     callback                 Standard callback method
 * @param  {Object}       callback.err             Error object containing error code and error message
 * @param  {Comment}      [callback.softDeleted]   If the comment is not deleted, but instead flagged as deleted because it has replies, this will return a stripped down comment object representing the deleted comment will be returned, with the `deleted` parameter set to `false`.. If the comment has been properly deleted, no comment will be returned.
 */
const deleteComment = (restCtx, contentId, created, callback) => {
  doRequest(
    restCtx,
    `/api/content/${encodeURIComponent(contentId)}/messages/${encodeURIComponent(created)}`,
    HTTP_DELETE,
    null,
    parseResponse(callback)
  );
};

/**
 * Gets the comments on a content item
 *
 * @param  {RestContext}  restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}       contentId           Content id of the content item we're trying to get comments for
 * @param  {String}       start               Determines the point at which content items are returned for paging purposed.
 * @param  {Number}       limit               Number of items to return.
 * @param  {Function}     callback            Standard callback method
 * @param  {Object}       callback.err        Error object containing error code and error message
 * @param  {Comment[]}    callback.comments   Array of comments on the content item
 */
const getComments = (restCtx, contentId, start, limit, callback) => {
  const parameters = {
    start,
    limit
  };
  doRequest(
    restCtx,
    `/api/content/${encodeURIComponent(contentId)}/messages`,
    HTTP_GET,
    parameters,
    parseResponse(callback)
  );
};

/**
 * Get a principal library through the REST API.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         principalId         User or group id for who we want to retrieve the library
 * @param  {String}         start               The content id to start from (this will not be included in the response)
 * @param  {Number}         limit               The number of content items to retrieve.
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Content[]}      callback.items      Array of content items representing the content items present in the library
 */
const getLibrary = (restCtx, principalId, start, limit, callback) => {
  const parameters = {
    start,
    limit
  };
  doRequest(
    restCtx,
    `/api/content/library/${encodeURIComponent(principalId)}`,
    HTTP_GET,
    parameters,
    parseResponse(callback)
  );
};

/**
 * Removes a piece of content from a principal library.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         principalId         User or group id for who we wish to remove a piece of content from the library
 * @param  {String}         contentId           Content id of the content item we're trying to remove from the library
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        Error object containing error code and error message
 */
const removeContentFromLibrary = (restCtx, principalId, contentId, callback) => {
  const url = `/api/content/library/${encodeURIComponent(principalId)}/${encodeURIComponent(contentId)}`;
  doRequest(restCtx, url, HTTP_DELETE, null, parseResponse(callback));
};

/**
 * Get the revisions for a piece of content.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         contentId           Content id of the content item we're trying to retrieve the revisions for
 * @param  {String}         [start]             The created timestampto start from (this will not be included in the response).
 * @param  {Number}         [limit]             The number of revisions to retrieve.
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Revision[]}     callback.items      Array of revisions
 */
const getRevisions = (restCtx, contentId, start, limit, callback) => {
  const parameters = {
    start,
    limit
  };
  doRequest(
    restCtx,
    `/api/content/${encodeURIComponent(contentId)}/revisions`,
    HTTP_GET,
    parameters,
    parseResponse(callback)
  );
};

/**
 * Get a specific revision for a piece of content.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         contentId           Content id of the content item we're trying to retrieve the revision for
 * @param  {String}         revisionId          The id of the revision to retrieve.
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Revision}       callback.revision   Revision object representing the retrieved revision.
 */
const getRevision = (restCtx, contentId, revisionId, callback) => {
  const url = `/api/content/${encodeURIComponent(contentId)}/revisions/${encodeURIComponent(revisionId)}`;
  doRequest(restCtx, url, HTTP_GET, null, parseResponse(callback));
};

/**
 * Restore a specific revision for a piece of content.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         contentId           Content id of the content item we're trying to restore the revision for
 * @param  {String}         revisionId          The id of the revision to restore.
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        Error object containing error code and error message
 */
const restoreRevision = (restCtx, contentId, revisionId, callback) => {
  const url = `/api/content/${encodeURIComponent(contentId)}/revisions/${encodeURIComponent(revisionId)}/restore`;
  doRequest(restCtx, url, HTTP_POST, null, parseResponse(callback));
};

/**
 * Upload a new version of a file.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         contentId           Content id of the content item we're trying to update
 * @param  {Function}       file                A function that returns a stream which points to a file body
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Content}        callback.content    The full content profile of the content item updated
 */
const updateFileBody = (restCtx, contentId, file, callback) => {
  const parameters = {
    file
  };
  doRequest(
    restCtx,
    `/api/content/${encodeURIComponent(contentId)}/newversion`,
    HTTP_POST,
    parameters,
    parseResponse(callback)
  );
};

/**
 * Download a file body to a path.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         contentId           Content id of the content item we're trying to download
 * @param  {String}         revisionId          Revision id of the content you wish to download, leave null to download the latest version.
 * @param  {String}         path                The path where the file can be stored. It's up to the caller to remove the file (if any) on errors.
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Response}       callback.response   The requestjs response object.
 */
const download = (restCtx, contentId, revisionId, path, callback) => {
  /*!
   * Performs the correct HTTP request to download a file.
   * This function assumes a proper cookiejar can be found on the RestContext objext.
   */
  const downloadFile = () => {
    let url = `${restCtx.host}/api/content/${encodeURIComponent(contentId)}/download`;
    if (revisionId) {
      url += `/${revisionId}`;
    }

    const requestParameters = {
      url,
      method: HTTP_GET,
      jar: restCtx.cookieJar,
      strictSSL: restCtx.strictSSL
    };
    if (restCtx.hostHeader) {
      requestParameters.headers = {
        host: restCtx.hostHeader
      };
    }

    let called = false;
    let response = null;
    const writeStream = fs.createWriteStream(path);
    writeStream.once('close', () => {
      // We got the file successfully. Destroy the stream and notify the caller.
      writeStream.removeAllListeners();
      writeStream.destroy();
      if (not(called)) {
        called = true;
        callback(null, response);
      }
    });

    writeStream.once('error', (error) => {
      /**
       * Something went wrong with trying to store the file on disk.
       * Destroy the stream and notify the caller.
       */
      writeStream.removeAllListeners();
      writeStream.destroy();

      if (not(called)) {
        called = true;
        callback(error, response);
      }
    });

    // Make the request
    const request_ = request(requestParameters);

    // Pipe the response to the stream.
    request_.pipe(writeStream);

    /**
     * Requestjs emits a 'response' event with the response object.
     * In combination with the writeStream and requestjs `end` event we can call
     * the callback with the appropriate error and response parameters.
     */
    request_.on('response', (_response) => {
      response = _response;
    });

    request_.on('end', () => {
      // If we get anything besides a 200 or 204, it's an error.
      const aint200or204 = (code) => compose(not, includes)(code, [200, 204]);
      if (and(aint200or204(response.statusCode), not(called))) {
        called = true;
        callback({
          code: response.statusCode,
          msg: 'Unable to download the file.'
        });
      }
    });
  };

  /**
   * We can't use the RestUtil.performRestRequest utility to wrap our requests as
   * we're dealing with streams.
   * This leads to annoying problems with cookiejars who might or might not be filled up.
   *  Check if we have a jar and perform the request if we have one.
   *  If we don't have one, try to fill it up.
   */
  if (restCtx.cookieJar) {
    downloadFile();
  } else {
    // No jar was present, create one.
    restCtx.cookieJar = request.jar();

    // If the restContext is not anonymous, we need to fill it up.
    fillCookieJar(restCtx, (error) => {
      if (error) return callback(error);

      downloadFile();
    });
  }
};

/**
 * Join a collaborative document or spreadsheet.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         contentId           Content id of the content item we're trying to join.
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        Error object containing error code and error message.
 * @param  {String}         callback.url        The URL where the etherpad or ethercalc instance for the collaborative document or spreadsheet is available.
 */
const joinCollabDoc = (restCtx, contentId, callback) => {
  doRequest(restCtx, `/api/content/${encodeURIComponent(contentId)}/join`, HTTP_POST, null, parseResponse(callback));
};

/**
 * Set one or multiple preview items.
 * Note: This method is only useful to a global administrator and should be performed against the global server.
 * The previous previews will be removed.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         contentId           Content id of the content item we're trying to retrieve the list of preview items from.
 * @param  {String}         revisionId          Revision id of the content item we're trying to retrieve the list of preview items from.
 * @param  {String}         status              The status of the preview generation. One of 'error', 'done' or 'pending'.
 * @param  {Object}         files               A hash where the key is the filename and the value is a function that returns a stream for a preview item.
 * @param  {Object}         sizes               A hash where the key is the filename and the value is a string that represents the preview size of the item. It should be one of 'small', 'medium', 'large', 'activity' or 'thumbnail'.
 * @param  {Object}         [contentMetadata]   Extra optional content metadata.
 * @param  {Object}         [previewMetadata]   Extra optional preview metadata.
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        Error object containing error code and error message
 */
const setPreviewItems = (
  restCtx,
  contentId,
  revisionId,
  status,
  files,
  sizes,
  contentMetadata,
  previewMetadata,
  callback
) => {
  previewMetadata = defaultToEmptyObject(previewMetadata);
  contentMetadata = defaultToEmptyObject(contentMetadata);

  const parameters = {
    status,
    sizes: {},
    links: {},
    previewMetadata: JSON.stringify(previewMetadata),
    contentMetadata: JSON.stringify(contentMetadata)
  };

  // Add the files and their sizes to the parameters.
  for (const filename of Object.keys(files)) {
    if (isString(files[filename])) {
      parameters.links[filename] = files[filename];
    } else {
      parameters[filename] = files[filename];
    }

    parameters.sizes[filename] = sizes[filename];
  }

  parameters.links = JSON.stringify(parameters.links);
  parameters.sizes = JSON.stringify(parameters.sizes);
  const url =
    '/api/content/' + encodeURIComponent(contentId) + '/revisions/' + encodeURIComponent(revisionId) + '/previews';
  doRequest(restCtx, url, HTTP_POST, parameters, parseResponse(callback));
};

/**
 * Get a list of preview items and a signature to download each one of them.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         contentId           Content id of the content item we're trying to retrieve the preview items.
 * @param  {String}         revisionId          Revision id of the preview items.
 * @param  {Function}       callback            Standard callback method
 * @param  {Object}         callback.err        Error object containing error code and error message
 */
const getPreviewItems = (restCtx, contentId, revisionId, callback) => {
  const url =
    '/api/content/' + encodeURIComponent(contentId) + '/revisions/' + encodeURIComponent(revisionId) + '/previews';
  doRequest(restCtx, url, HTTP_GET, {}, parseResponse(callback));
};

/**
 * Download a preview item
 *
 * @param  {RestContext}    restCtx                 Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         contentId               Content id of the content item we're trying to download a preview item from.
 * @param  {String}         revisionId              Revision id for the preview item.
 * @param  {String}         previewItem             The preview item.
 * @param  {Object}         signature               A signature that validates this call.
 * @param  {String}         signature.signature     A signature that validates this call.
 * @param  {Number}         signature.expires       When the signature expires (in millis since epoch.)
 * @param  {Number}         signature.lastModified  When the signature expires (in millis since epoch.)
 * @param  {Function}       callback                Standard callback method
 * @param  {Object}         callback.err            Error object containing error code and error message
 * @param  {Object}         callback.body           The body of the response.
 */
const downloadPreviewItem = (restCtx, contentId, revisionId, previewItem, signature, callback) => {
  let url =
    '/api/content/' + encodeURIComponent(contentId) + '/revisions/' + encodeURIComponent(revisionId) + '/previews/';
  url += encodeURIComponent(previewItem);
  const parameters = {
    signature: signature.signature,
    expires: signature.expires,
    lastmodified: signature.lastModified
  };
  doRequest(restCtx, url, HTTP_GET, parameters, parseResponse(callback));
};

export {
  getContent,
  createLink,
  createFile,
  createCollabDoc,
  createCollabsheet,
  updateContent,
  deleteContent,
  getMembers,
  updateMembers,
  shareContent,
  createComment,
  deleteComment,
  getComments,
  getLibrary,
  removeContentFromLibrary,
  getRevisions,
  getRevision,
  restoreRevision,
  updateFileBody,
  download,
  joinCollabDoc,
  setPreviewItems,
  getPreviewItems,
  downloadPreviewItem
};
