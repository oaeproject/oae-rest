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

var util = require('util');

var RestUtil = require('./util');


/**
 * Get the annotations for a given revision and page number
 *
 * @param  {RestContext}        restCtx                 The context of the current request
 * @param  {String}             contentId               The id of the content item
 * @param  {String}             revisionId              The id of the revision
 * @param  {Number}             pageNumber              The number of the page for which to retrieve the annotations
 * @param  {Function}           callback                Standard callback function
 * @param  {Object}             callback.err            An error object, if any
 * @param  {Annotation[]}       callback.annotations    The annotations for this page
 */
var getAnnotations = module.exports.getAnnotations = function(restCtx, contentId, revisionId, pageNumber, callback) {
    var url = util.format('/api/content/%s/annotations/%s',
        RestUtil.encodeURIComponent(contentId),
        RestUtil.encodeURIComponent(revisionId)
    );

    var params = {'pageNumber': pageNumber};
    RestUtil.RestRequest(restCtx, url, 'GET', params, callback);
};

/**
 * Create a new annotation
 *
 * @param  {RestContext}        restCtx                 The context of the current request
 * @param  {String}             contentId               The id of the content item
 * @param  {String}             revisionId              The id of the revision
 * @param  {Number}             pageNumber              The number of the page where the annotation was made
 * @param  {String}             text                    The new text of the annotation
 * @param  {String}             quote                   The selected text on which the annotation was made
 * @param  {Range[]}            ranges                  The ranges on which the annotation applies, usualy just one
 * @param  {Function}           callback                Standard callback function
 * @param  {Object}             callback.err            An error object, if any
 * @param  {Annotation}         callback.annotation     The created annotation object
 */
var createAnnotation = module.exports.createAnnotation = function(restCtx, contentId, revisionId, pageNumber, text, quote, ranges, callback) {
    var url = util.format('/api/content/%s/annotations/%s',
        RestUtil.encodeURIComponent(contentId),
        RestUtil.encodeURIComponent(revisionId)
    );

    var params = {
        'pageNumber': pageNumber,
        'text': text,
        'quote': quote,
        'ranges': ranges
    };
    RestUtil.RestRequest(restCtx, url, 'POST', params, callback);
};

/**
 * Update an annotation
 *
 * @param  {RestContext}        restCtx             The context of the current request
 * @param  {String}             contentId           The id of the content item
 * @param  {String}             revisionId          The id of the revision
 * @param  {String}             annotationId        The id of the annotation to update
 * @param  {String}             text                The new text for the annotation
 * @param  {Function}           callback            Standard callback function
 * @param  {Object}             callback.err        An error object, if any
 */
var updateAnnotation = module.exports.updateAnnotation = function(restCtx, contentId, revisionId, annotationId, text, callback) {
    var url = util.format('/api/content/%s/annotations/%s/%s',
        RestUtil.encodeURIComponent(contentId),
        RestUtil.encodeURIComponent(revisionId),
        RestUtil.encodeURIComponent(annotationId)
    );

    var params = {'text': text};
    RestUtil.RestRequest(restCtx, url, 'PUT', params, callback);
};

/**
 * Delete an annotation
 *
 * @param  {RestContext}        restCtx             The context of the current request
 * @param  {String}             contentId           The id of the content item
 * @param  {String}             revisionId          The id of the revision
 * @param  {String}             annotationId        The id of the annotation to delete
 * @param  {Function}           callback            Standard callback function
 * @param  {Object}             callback.err        An error object, if any
 */
var deleteAnnotation = module.exports.deleteAnnotation = function(restCtx, contentId, revisionId, annotationId, callback) {
    var url = util.format('/api/content/%s/annotations/%s/%s',
        RestUtil.encodeURIComponent(contentId),
        RestUtil.encodeURIComponent(revisionId),
        RestUtil.encodeURIComponent(annotationId)
    );

    RestUtil.RestRequest(restCtx, url, 'DELETE', null, callback);
};
