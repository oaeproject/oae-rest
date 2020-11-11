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

import { defaultTo, not, compose, equals, mergeAll } from 'ramda';

import * as CropAPI from './api.crop';
import * as RestUtil from './util';

const HTTP_GET = 'GET';
const HTTP_POST = 'POST';
const HTTP_DELETE = 'DELETE';

// Auxiliary functions
const isDefined = Boolean;
const isNotDefined = compose(not, isDefined);
const isTrue = equals(true);

/**
 * Create a global administrator user with mapped local authentication credentials in the system
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that should be authenticated to the global admin tenant as a global administrator
 * @param  {String}         username        The username the user should use to log into the global administrator tenant
 * @param  {String}         password        The password the user should use to log into the global administrator tenant
 * @param  {String}         displayName     The display name of the administrator user
 * @param  {String}         email           The email address of the administrator user
 * @param  {Object}         [opts]          Additional optional profile parameters for the user
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error that occurred, if any
 * @param  {User}           callback.user   The user object that was created
 */
const createGlobalAdminUser = (restCtx, username, password, displayName, email, options, callback) => {
  options = mergeAll([
    {},
    options,
    {
      username,
      password,
      displayName,
      email
    }
  ]);

  RestUtil.performRestRequest(restCtx, '/api/user/createGlobalAdminUser', HTTP_POST, options, callback);
};

/**
 * Create a private tenant administrator user with mapped local authentication credentials on the provided tenant
 *
 * @param  {RestContext}    restCtx         Standard REST Context object
 * @param  {String}         [tenantAlias]   The alias of the tenant in which the tenant administrator should be created. If unspecified, defaults to the current tenant
 * @param  {String}         username        The username the user should use to login
 * @param  {String}         password        The password the user should use to login
 * @param  {String}         displayName     The display name of the administrator user
 * @param  {String}         email           The email address of the administrator user
 * @param  {Object}         [opts]          Additional optional profile parameters for the user
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error that occurred, if any
 * @param  {User}           callback.user   The user object that was created
 * @api private
 */
const _createTenantAdminUser = (restCtx, tenantAlias, ...args) => {
  let [username, password, displayName, email, options, callback] = args;
  options = defaultTo({}, options);
  const parameters = mergeAll([
    {},
    options,
    {
      username,
      password,
      displayName,
      email
    }
  ]);

  let url = '/api/user/createTenantAdminUser';
  if (tenantAlias) {
    url = `/api/user/${RestUtil.encodeURIComponent(tenantAlias)}/createTenantAdminUser`;
  }

  RestUtil.performRestRequest(restCtx, url, HTTP_POST, parameters, callback);
};

/**
 * Create a private tenant administrator user with mapped local authentication credentials on the tenant in context
 *
 * @param  {RestContext}    restCtx         Standard REST Context object of the tenant administrator who is creating the new tenant administrator
 * @param  {String}         username        The username the user should use to login
 * @param  {String}         password        The password the user should use to login
 * @param  {String}         displayName     The display name of the administrator user
 * @param  {String}         email           The email address of the administrator user
 * @param  {Object}         [opts]          Additional optional profile parameters for the user
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error that occurred, if any
 * @param  {User}           callback.user   The user object that was created
 */
const createTenantAdminUser = (restCtx, ...args) => {
  _createTenantAdminUser(restCtx, null, ...args);
};

/**
 * Create a private tenant administrator user with mapped local authentication credentials on the specified tenant
 *
 * @param  {RestContext}    restCtx         Standard REST Context object of the global administrator creating the tenant administrator user
 * @param  {String}         tenantAlias     The tenant on which to create the tenant administrator
 * @param  {String}         username        The username the user should use to login
 * @param  {String}         password        The password the user should use to login
 * @param  {String}         displayName     The display name of the administrator user
 * @param  {String}         email           The email address of the administrator user
 * @param  {Object}         [opts]          Additional optional profile parameters for the user
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error that occurred, if any
 * @param  {User}           callback.user   The user object that was created
 */
const createTenantAdminUserOnTenant = (restCtx, tenantAlias, ...args) => {
  _createTenantAdminUser(restCtx, tenantAlias, ...args);
};

/**
 * Creates a user through the REST API
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials. For this function to work, the passed in restCtx should either be for a global/tenant admin or for an anonymous user with reCaptcha disabled
 * @param  {String}         [tenantAlias]       The tenant on which to create the user. If unspecified, will default to current tenant of the `restCtx`
 * @param  {String}         username            The username this user can login with
 * @param  {String}         password            The password for this user
 * @param  {String}         displayName         The display name for the user
 * @param  {String}         email               The email address for the user
 * @param  {Object}         [opts]              Additional optional parameters that need to be passed
 * @param  {String}         [opts.visibility]   The user's visibility setting. This can be public, loggedin or private
 * @param  {String}         [opts.locale]       The user's locale
 * @param  {String}         [opts.timezone]     The user's timezone
 * @param  {String}         [opts.publicAlias]  The publically-available alias for users to see when the user's display name is protected
 * @param  {Boolean}        [opts.acceptedTC]   Whether or not the user accepts the Terms and Conditions
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error that occurred, if any
 * @param  {User}           callback.response   A User object representing the created user
 * @api private
 */
const _createUser = (restCtx, tenantAlias, ...args) => {
  let [username, password, displayName, email, options, callback] = args;
  options = defaultTo({}, options);
  const parameters = mergeAll([
    {},
    options,
    {
      username,
      password,
      displayName,
      email
    }
  ]);

  let url = '/api/user/create';
  if (tenantAlias) {
    url = `/api/user/${RestUtil.encodeURIComponent(tenantAlias)}/create`;
  }

  RestUtil.performRestRequest(restCtx, url, HTTP_POST, parameters, callback);
};

/**
 * Creates a user on the current tenant through the REST API
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials. For this function to work, the passed in restCtx should either be for a global/tenant admin or for an anonymous user with reCaptcha disabled
 * @param  {String}         username            The username this user can login with
 * @param  {String}         password            The password for this user
 * @param  {String}         displayName         The display name for the user
 * @param  {String}         email               The email address for the user
 * @param  {Object}         [opts]              Additional optional parameters that need to be passed
 * @param  {String}         [opts.visibility]   The user's visibility setting. This can be public, loggedin or private
 * @param  {String}         [opts.locale]       The user's locale
 * @param  {String}         [opts.timezone]     The user's timezone
 * @param  {String}         [opts.publicAlias]  The publically-available alias for users to see when the user's display name is protected
 * @param  {Boolean}        [opts.acceptedTC]   Whether or not the user accepts the Terms and Conditions
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error that occurred, if any
 * @param  {User}           callback.response   A User object representing the created user
 */
const createUser = (restCtx, ...args) => {
  _createUser(restCtx, null, ...args);
};

/**
 * Delete a user
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         userId          The id of the user to delete
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error that occurred, if any
 */
const deleteUser = (restCtx, userId, callback) => {
  RestUtil.performRestRequest(restCtx, `/api/user/${RestUtil.encodeURIComponent(userId)}`, HTTP_DELETE, null, callback);
};

/**
 * Restore a user
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         userId          The id of the user to restore
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error that occurred, if any
 */
const restoreUser = (restCtx, userId, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `/api/user/${RestUtil.encodeURIComponent(userId)}/restore`,
    HTTP_POST,
    null,
    callback
  );
};

/**
 * Creates a user on a particular tenant through the REST API
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials. For this function to work, the passed in restCtx should either be for a global/tenant admin or for an anonymous user with reCaptcha disabled
 * @param  {String}         tenantAlias         The tenant on which to create the user
 * @param  {String}         username            The username this user can login with
 * @param  {String}         password            The password for this user
 * @param  {String}         displayName         The display name for the user
 * @param  {String}         email               The email address for the user
 * @param  {Object}         [opts]              Additional optional parameters that need to be passed
 * @param  {String}         [opts.visibility]   The user's visibility setting. This can be public, loggedin or private
 * @param  {String}         [opts.locale]       The user's locale
 * @param  {String}         [opts.timezone]     The user's timezone
 * @param  {String}         [opts.publicAlias]  The publically-available alias for users to see when the user's display name is protected
 * @param  {Boolean}        [opts.acceptedTC]   Whether or not the user accepts the Terms and Conditions
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error that occurred, if any
 * @param  {User}           callback.response   A User object representing the created user
 */
const createUserOnTenant = (restCtx, tenantAlias, ...args) => {
  _createUser(restCtx, tenantAlias, ...args);
};

/**
 * Gets a user's me feed through the REST API.
 *
 * @param  {RestContext}            restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Function}               callback            Standard callback function
 * @param  {Object}                 callback.err        Standard error object, if any
 * @param  {Object}                 callback.response   The user's me feed
 */
const getMe = (restCtx, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/me', HTTP_GET, null, callback);
};

/**
 * Get a user basic profile through the REST API.
 *
 * @param  {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}          userId              User id of the profile you wish to retrieve
 * @param  {Function}        callback            Standard callback function
 * @param  {Object}          callback.err        Standard error object, if any
 * @param  {User}            callback.response   The user's basic profile
 */
const getUser = (restCtx, userId, callback) => {
  RestUtil.performRestRequest(restCtx, `/api/user/${RestUtil.encodeURIComponent(userId)}`, HTTP_GET, null, callback);
};

/**
 * Update a user's basic profile through the REST API.
 *
 * @param  {RestContext}     restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}          userId          The user id of the user we're trying to update
 * @param  {Object}          params          Object representing the profile fields that need to be updated. The keys are the profile fields, the values are the profile field values
 * @param  {Function}        callback        Standard callback function
 * @param  {Object}          callback.err    Standard error object, if any
 */
const updateUser = (restCtx, userId, parameters, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `/api/user/${RestUtil.encodeURIComponent(userId)}`,
    HTTP_POST,
    parameters,
    callback
  );
};

/**
 * Uploads a new profile picture for a user and optionally resize it.
 *
 * @param  {RestContext}     restCtx                 Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}          userId                  The user id of the user we're trying to upload a new image for
 * @param  {Function}        fileGenerator           A method that returns an open stream to a file
 * @param  {Object}          [selectedArea]          If specified, this will crop the picture to the required rectangle and generate the 2 sizes.
 * @param  {Number}          [selectedArea.x]        The top left x coordinate
 * @param  {Number}          [selectedArea.y]        The top left y coordinate
 * @param  {Number}          [selectedArea.width]    The width of the rectangle
 * @param  {Number}          [selectedArea.height]   The height of the rectangle
 * @param  {Function}        callback                Standard callback function
 * @param  {Object}          callback.err            Standard error object, if any
 * @param  {Object}          callback.principal      The updated principal object
 */
const uploadPicture = (restCtx, userId, file, selectedArea, callback) => {
  const parameters = {
    file
  };
  if (isDefined(selectedArea)) {
    RestUtil.performRestRequest(
      restCtx,
      `/api/user/${RestUtil.encodeURIComponent(userId)}/picture`,
      HTTP_POST,
      parameters,
      err => {
        if (err) return callback(err);

        CropAPI.cropPicture(restCtx, userId, selectedArea, callback);
      }
    );
  } else {
    RestUtil.performRestRequest(
      restCtx,
      `/api/user/${RestUtil.encodeURIComponent(userId)}/picture`,
      HTTP_POST,
      parameters,
      callback
    );
  }
};

/**
 * Download a user's picture. Returns a 404 if the user has no picture.
 * This will only return the image when it's run against the nginx server, as it's nginx who sends the picture stream.
 *
 * @param  {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}          userId              The ID of the user we're trying to download a picture from
 * @param  {String}          size                The picture size. One of `small`, `medium` or `large`
 * @param  {Function}        callback            Standard callback function
 * @param  {Object}          callback.err        Standard error object, if any
 * @param  {Object}          callback.picture    The raw picture for this group
 */
const downloadPicture = (restCtx, userId, size, callback) => {
  if (isNotDefined(size)) {
    return callback({ code: 400, msg: 'Missing size parameter' });
  }

  getUser(restCtx, userId, (err, user) => {
    if (err) return callback(err);

    if (isNotDefined(user.picture[size])) {
      return callback({ code: 404, msg: 'This user has no picture.' });
    }

    const url = user.picture[size];
    RestUtil.performRestRequest(restCtx, url, HTTP_GET, null, callback);
  });
};

/**
 * Set or unset a user as a tenant admin.
 *
 * @param  {RestContext}   restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}        userId          The user id of the user we're going to update
 * @param  {Boolean}       value           Whether or not the user should be tenant admin. `true` if they should, any other value if they should be unset
 * @param  {Function}      callback        Standard callback function
 * @param  {Object}        callback.err    Standard error object, if any
 */
const setTenantAdmin = (restCtx, userId, value, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `/api/user/${RestUtil.encodeURIComponent(userId)}/admin`,
    HTTP_POST,
    { admin: isTrue(value) },
    callback
  );
};

/**
 * Get available timezones and offsets from UTC
 *
 * @param  {RestContext}   restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {Function}      callback        Standard callback function
 * @param  {Object}        callback.err    Standard error object, if any
 */
const getTimezones = (restCtx, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/timezones', HTTP_GET, null, callback);
};

/**
 * Gets the Terms and Conditions for a tenant.
 * If the Terms and Conditions for a given locale cannot be found, the default Terms and Conditions will be returned.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         locale              The locale in which the Terms and Conditions should be retrieved. It the Terms and Conditions are not available in that locale, the default Terms and Conditions will be returned
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        Standard error object, if any
 */
const getTermsAndConditions = (restCtx, locale, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/user/termsAndConditions', HTTP_GET, { locale }, callback);
};

/**
 * Accepts the Terms and Conditions for a user
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         userId              The id of the user that accepts the Terms and Conditions
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        Standard error object, if any
 * @param  {User}           callback.user       The updated user object
 */
const acceptTermsAndConditions = (restCtx, userId, callback) => {
  const url = `/api/user/${RestUtil.encodeURIComponent(userId)}/termsAndConditions`;
  RestUtil.performRestRequest(restCtx, url, HTTP_POST, {}, callback);
};

/**
 * Verify an email token
 *
 * @param  {RestContext}    restCtx         Standard REST Context object
 * @param  {String}         userId          The id of the user to verify the email address for
 * @param  {String}         token           The token with which to verify the email address
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error that occurred, if any
 */
const verifyEmail = (restCtx, userId, token, callback) => {
  const url = `/api/user/${RestUtil.encodeURIComponent(userId)}/email/verify`;
  RestUtil.performRestRequest(restCtx, url, HTTP_POST, { token }, callback);
};

/**
 * Resend an email token for a user
 *
 * @param  {RestContext}    restCtx         Standard REST Context object
 * @param  {String}         userId          The id of the user to resend the email token for
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error that occurred, if any
 */
const resendEmailToken = (restCtx, userId, callback) => {
  const url = `/api/user/${RestUtil.encodeURIComponent(userId)}/email/resend`;
  RestUtil.performRestRequest(restCtx, url, HTTP_POST, {}, callback);
};

/**
 * Check whether a user has a pending email token
 *
 * @param  {RestContext}    restCtx             Standard REST Context object
 * @param  {String}         userId              The id of the user to for which to check whether they have a pending email token
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error that occurred, if any
 * @param  {String}         callback.email      The email address for which there is a token
 */
const getEmailToken = (restCtx, userId, callback) => {
  const url = `/api/user/${RestUtil.encodeURIComponent(userId)}/email/token`;
  RestUtil.performRestRequest(restCtx, url, HTTP_GET, {}, callback);
};

/**
 * Delete a pending email token for a user
 *
 * @param  {RestContext}    restCtx             Standard REST Context object
 * @param  {String}         userId              The id of the user to for which to delete the pending email token
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error that occurred, if any
 */
const deleteEmailToken = (restCtx, userId, callback) => {
  const url = `/api/user/${RestUtil.encodeURIComponent(userId)}/email/token`;
  RestUtil.performRestRequest(restCtx, url, HTTP_DELETE, {}, callback);
};

/**
 * Get a user's most recent groups through the REST API.
 *
 * @param  {RestContext}     restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}          userId              User id whose recent groups you wish to receive
 * @param  {Function}        callback            Standard callback function
 * @param  {Object}          callback.err        Standard error object, if any
 * @param  {Group[]}         callback.response   The user's most recently visited groups
 */
const getRecentlyVisitedGroups = (restCtx, userId, callback) => {
  const url = `/api/user/${RestUtil.encodeURIComponent(userId)}/groups/recent`;
  RestUtil.performRestRequest(restCtx, url, HTTP_GET, {}, callback);
};

/**
 * Creates a user through the REST API
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials. For this function to work, the passed in restCtx should either be for a global/tenant admin or for an anonymous user with reCaptcha disabled
 * @param  {string}         userId              The id of the principal for which to get his datas
 * @param  {string}         exportType          Export type can be 'personal-data', 'content' or 'shared'
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error that occurred, if any
 * @param  {Zip}            callback.zip        Zip file containing all personal data of a user
 * @api private
 */
const exportPersonalData = (restCtx, userId, exportType, callback) => {
  const url = `/api/user/${RestUtil.encodeURIComponent(userId)}/export/${RestUtil.encodeURIComponent(exportType)}`;
  RestUtil.performRestRequest(restCtx, url, HTTP_GET, {}, callback);
};

export {
  createGlobalAdminUser,
  createTenantAdminUser,
  createTenantAdminUserOnTenant,
  createUser,
  deleteUser,
  restoreUser,
  createUserOnTenant,
  getMe,
  getUser,
  updateUser,
  uploadPicture,
  downloadPicture,
  setTenantAdmin,
  getTimezones,
  getTermsAndConditions,
  acceptTermsAndConditions,
  verifyEmail,
  resendEmailToken,
  getEmailToken,
  deleteEmailToken,
  getRecentlyVisitedGroups,
  exportPersonalData
};
