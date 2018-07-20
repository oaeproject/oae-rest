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

var TransferConstants = require('oae-transfer/lib/constants').TransferConstants;


////////////////////
//    TRANSFER    //
////////////////////

/**
 * Initiate a transfer.
 *
 * @param  {RestContext}    RestContext             Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         originalEmail           The email of the account from which the data will be transferred
 * @param  {String}         targetEmail             The email of the account to which the data will be transferred
 * @param  {String}         originalUserId          The account identifier from which the data will be transferred
 * @param  {Function}       callback                Standard callback function
 * @param  {Object}         callback.err            An error that occurred, if any
 * @param  {Object}       callback.transfer       The transfer that was created
 */
var initiateTransfer = module.exports.initiateTransfer = function(RestContext, originalUserId, originalEmail, targetEmail, callback) {
    var params = {
        'originalUserId': originalUserId,
        'originalEmail': originalEmail,
        'targetEmail': targetEmail
    };

    RestUtil.RestRequest(RestContext, '/api/transfer', 'post', params, function(err, transfer) {
    	if (err) {
            return callback(err);
        }
        return callback(null, transfer);
    });
};

/**
 * Get a transfer by Id.
 *
 * @param  {RestContext}    RestContext             Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         originalUserId          The account identifier from which the data will be transferred
 * @param  {Function}       callback                Standard callback function
 * @param  {Object}         callback.err            An error that occurred, if any
 * @param  {Object}       callback.transfer       The transfer that was created
 */
var getTransferById = module.exports.getTransferById = function(RestContext, originalUserId, callback) {
    RestUtil.RestRequest(RestContext, '/api/transfer/' + RestUtil.encodeURIComponent(originalUserId), 'get', {'originalUserId' : originalUserId} , function(err, transfer) {
        if (err) {
            return callback(err);
        }
        return callback(null, transfer);
    });
};

/**
 * Complete a transfer.
 *
 * @param  {RestContext}    RestContext             Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         originalEmail           The email of the account from which the data will be transferred
 * @param  {String}         code                    The code used by the user to secure the transfer
 * @param  {String}         targetEmail             The email of the account to which the data will be transferred
 * @param  {String}         targetUserId            The identifier of the account to which the data will be transferred
 * @param  {Function}       callback                Standard callback function
 * @param  {Object}         callback.err            An error that occurred, if any
 * @param  {Object}       callback.transfer       The transfer that was created
 */
var completeTransfer = module.exports.completeTransfer = function(RestContext, originalEmail, code, targetEmail, targetUserId, callback) {
    var params = {
        'originalEmail': originalEmail,
        'code': code,
        'targetEmail': targetEmail,
        'status': TransferConstants.status.COMPLETED
    };

    RestUtil.RestRequest(RestContext, '/api/transfer/' + targetUserId, 'put', params, function(err, managers) {
        if (err) {
            return callback(err);
        }
        return callback(null, managers);
    });
};

/**  
 * Cancel a transfer.
 *
 * @param  {RestContext}    RestContext             Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         originalEmail           The email of the account from which the data will be transferred
 * @param  {String}         code                    The code used by the user to secure the transfer
 * @param  {String}         originalUserId          The account identifier from which the data will be transferred
 * @param  {Function}       callback                Standard callback function
 * @param  {Object}         callback.err            An error that occurred, if any
 */
var cancelTransfer = module.exports.cancelTransfer = function(RestContext, originalEmail, code, originalUserId, callback) {
    var params = {
        'originalEmail': originalEmail,
        'code': code,
        'originalUserId': originalUserId, 
        'status': TransferConstants.status.CANCELED
    };

    RestUtil.RestRequest(RestContext, '/api/transfer/' + originalUserId, 'put', params, function(err) {
        if (err) {
            return callback(err);
        }
        return callback();
    });
};
