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

var RestUtil = require('./util');


////////////////////
//    TRANSFER    //
////////////////////

/**
 * Create a transfer.
 *
 * @param  {RestContext}    restCtx                 Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         originalEmail             The user email
 * @param  {String}         targetEmail             The new email
 * @param  {String}         originalUserId            The id of the user who create the transfer 
 * @param  {Function}       callback                Standard callback function
 * @param  {Object}         callback.err            An error that occurred, if any
 * @param  {Transfer}       callback.transfer       The transfer that was created
 */
var createTransfer = module.exports.createTransfer = function(RestContext, originalUserId, originalEmail, targetEmail, callback) {
    var params = {
        'originalUserId': originalUserId,
        'originalEmail': originalEmail,
        'targetEmail': targetEmail
    };

    RestUtil.RestRequest(RestContext, '/api/transfer/create', 'post', params, function(err, transfer) {
    	if (err) {
            return callback(err);
        }
        return callback(null, transfer);
    });
};

/**
 * Get a transfer by Id.
 *
 * @param  {RestContext}    restCtx                 Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         originalUserId            The id of the user who created the transfer    
 * @param  {Function}       callback                Standard callback function
 * @param  {Object}         callback.err            An error that occurred, if any
 * @param  {Transfer}       callback.transfer       The transfer that was created
 */
var getTransferById = module.exports.getTransferById = function(RestContext, originalUserId, callback) {
    RestUtil.RestRequest(RestContext, '/api/transfer/getTransferById/'+ RestUtil.encodeURIComponent(originalUserId), 'get', {'originalUserId' : originalUserId} , function(err, transfer) {
        if (err) {
            return callback(err);
        }
        return callback(null, transfer);
    });
};

/**
 * Make a transfer.
 *
 * @param  {RestContext}    restCtx                 Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         originalEmail             The user email
 * @param  {String}         code                    The generated code
 * @param  {String}         targetEmail             The new email
 * @param  {String}         targetUserId            The id new user
 * @param  {Function}       callback                Standard callback function
 * @param  {Object}         callback.err            An error that occurred, if any
 * @param  {Transfer}       callback.transfer       The transfer that was created
 */
var makeTransfer = module.exports.makeTransfer = function(RestContext, originalEmail, code, targetEmail, targetUserId, callback) {
    var params = {
        'originalEmail': originalEmail,
        'code': code,
        'targetEmail': targetEmail,
        'targetUserId': targetUserId
    };

    RestUtil.RestRequest(RestContext, '/api/transfer/makeTransfer', 'post', params, function(err, managers) {
        if (err) {
            return callback(err);
        }
        return callback(null, managers);
    });
};

/**  
 * Delete a transfer.
 *
 * @param  {RestContext}    restCtx                 Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         originalEmail             The user email
 * @param  {String}         code                    The generated code
 * @param  {String}         originalUserId            The id user
 * @param  {Function}       callback                Standard callback function
 * @param  {Object}         callback.err            An error that occurred, if any
 * @param  {Transfer}       callback.transfer       The transfer that was created
 */
var deleteTransfer = module.exports.deleteTransfer = function(RestContext, originalEmail, code, originalUserId, callback) {
    var params = {
        'originalEmail': originalEmail,
        'code': code,
        'originalUserId': originalUserId
    };
    
    RestUtil.RestRequest(RestContext, '/api/transfer/deleteTransfer', 'POST', params, function(err) {
        if (err) {
        }
        return callback(null);
    });
};
