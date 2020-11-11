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

import * as RestUtil from './util';

import { defaultTo } from 'ramda';

const HTTP_GET = 'GET';
const HTTP_POST = 'POST';
const HTTP_DELETE = 'DELETE';

// Stopping a server is async, this variable holds how long we should wait before returning on
// start/stop/delete of a tenant
const WAIT_TIME = 100;

/// //////////////////
// TENANT NETWORKS //
/// //////////////////

/**
 * Create a tenant network.
 *
 * @param  {RestContext}    restCtx                 Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         displayName             The display name of the tenant network
 * @param  {Function}       callback                Standard callback function
 * @param  {Object}         callback.err            An error that occurred, if any
 * @param  {TenantNetwork}  callback.tenantNetwork  The tenant network that was created
 */
const createTenantNetwork = (restCtx, displayName, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/tenantNetwork/create', HTTP_POST, { displayName }, callback);
};

/**
 * Fetch all tenant networks and their associated tenants.
 *
 * @param  {RestContext}    restCtx                     Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {Function}       callback                    Standard callback function
 * @param  {Object}         callback.err                An error that occurred, if any
 * @param  {Object}         callback.tenantNetworks     All tenant networks in the system, keyed by their tenant network id
 */
const getTenantNetworks = (restCtx, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/tenantNetworks', HTTP_GET, null, callback);
};

/**
 * Update a tenant network.
 *
 * @param  {RestContext}    restCtx                 Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         id                      The id of the tenant network being updated
 * @param  {String}         displayName             The updated display name of the tenant network
 * @param  {Function}       callback                Standard callback function
 * @param  {Object}         callback.err            An error that occurred, if any
 * @param  {TenantNetwork}  callback.tenantNetwork  The new tenant network, after update
 */
const updateTenantNetwork = (restCtx, id, displayName, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `/api/tenantNetwork/${RestUtil.encodeURIComponent(id)}`,
    HTTP_POST,
    { displayName },
    callback
  );
};

/**
 * Delete a tenant network.
 *
 * @param  {RestContext}    restCtx         Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         id              The id of the tenant network to delete
 * @param  {Function}       callback        Standard callback function
 * @param  {Object}         callback.err    An error that occurred, if any
 */
const deleteTenantNetwork = (restCtx, id, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `/api/tenantNetwork/${RestUtil.encodeURIComponent(id)}`,
    HTTP_DELETE,
    null,
    callback
  );
};

/**
 * Add the provided tenant aliases to the specified tenant network.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         tenantNetworkId     The id of the tenant network to which to add the provided tenant aliases
 * @param  {String[]}       tenantAlises        The tenant aliases to add to the tenant network
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error that occurred, if any
 */
const addTenantAliases = (restCtx, tenantNetworkId, tenantAliases, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `/api/tenantNetwork/${RestUtil.encodeURIComponent(tenantNetworkId)}/addTenants`,
    HTTP_POST,
    { alias: tenantAliases },
    callback
  );
};

/**
 * Remove the provided tenant aliases from the specified tenant network.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         tenantNetworkId     The id of the tenant network from which to remove the provided tenant aliases
 * @param  {String[]}       tenantAlises        The tenant aliases to remove from the tenant network
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        An error that occurred, if any
 */
const removeTenantAliases = (restCtx, tenantNetworkId, tenantAliases, callback) => {
  RestUtil.performRestRequest(
    restCtx,
    `/api/tenantNetwork/${RestUtil.encodeURIComponent(tenantNetworkId)}/removeTenants`,
    HTTP_POST,
    { alias: tenantAliases },
    callback
  );
};

/**
 * Tenants
 */

/**
 * Retrieve all available tenants through the REST API.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {Function}       callback            Standard callback method takes arguments `err` and `tenants`
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Tenant[]}       callback.tenants    Array containing a tenant object for each of the available tenants
 */
const getTenants = (restCtx, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/tenants', HTTP_GET, null, callback);
};

/**
 * Get the tenants matching one or more email addresses
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String[]}       emails              The email addresses to get the tenants for
 * @param  {Function}       callback            Standard callback function
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Object}         callback.tenants    The tenants keyed by the email addresses

 */
const getTenantsByEmailAddress = (restCtx, emails, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/tenantsByEmail', HTTP_GET, { emails }, callback);
};

/**
 * Retrieve a tenant through the REST API.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         [alias]             Optional tenant alias of the tenant to get information for. If no tenantAlias is passed in, the current tenant will be used
 * @param  {Function}       callback            Standard callback method takes arguments `err` and `tenant`
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Tenant}         callback.tenant     Tenant object representing the retrieved tenant
 */
const getTenant = (restCtx, alias, callback) => {
  let url = '/api/tenant';
  if (alias) {
    url += `/${RestUtil.encodeURIComponent(alias)}`;
  }

  RestUtil.performRestRequest(restCtx, url, HTTP_GET, null, callback);
};

/**
 * Create a new tenant through the REST API.
 *
 * @param  {RestContext}    restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}         alias               The tenant's unique identifier
 * @param  {String}         displayName         The new tenant's displayName
 * @param  {String}         host                The hostname for the newly created tenant (e.g. cambridge.oae.com)
 * @param  {Object}         [opts]              Optional fields
 * @param  {String[]}       [opts.emailDomains] The email domain expressions that this tenant hosts
 * @param  {String}         [opts.countryCode]  The ISO-3166-1 country code of the  country that represents the tenant
 * @param  {Function}       callback            Standard callback method takes arguments `err` and `tenant`
 * @param  {Object}         callback.err        Error object containing error code and error message
 * @param  {Tenant}         callback.tenant     Tenant object representing the newly created tenant
 */
const createTenant = (restCtx, alias, displayName, host, options, callback) => {
  options = defaultTo({}, options);
  const parameters = {
    alias,
    displayName,
    host,
    emailDomains: options.emailDomains,
    countryCode: options.countryCode
  };
  RestUtil.performRestRequest(restCtx, '/api/tenant/create', HTTP_POST, parameters, (err, tenant) => {
    if (err) return callback(err);

    // Give the tenant some time to start
    return setTimeout(callback, WAIT_TIME, err, tenant);
  });
};

/**
 * Update a tenant's metadata through the REST API.
 *
 * @param  {RestContext}    restCtx                         Standard REST Context object that contains the current tenant URL and the current user credentials
 * @param  {String}         [alias]                         Optional tenant alias of the tenant that needs to be updated, in case the request is made from the global admin tenant. If no tenantAlias is passed in, the current tenant will be used
 * @param  {Object}         tenantUpdates                   Object where the keys represents the metadata identifiers and the values represent the new metadata values
 * @param  {String}         [tenantUpdates.displayName]     Updated tenant display name
 * @param  {String}         [tenantUpdates.host]            Updated tenant hostname
 * @param  {String[]}       [tenantUpdates.emailDomains]    Updated tenant email domain expressions
 * @param  {String}         [tenantUpdates.countryCode]     Updated tenant ISO-3166-1 country code
 * @param  {Function}       callback                        Standard callback function
 * @param  {Object}         callback.err                    Error object containing error code and error message
 */
const updateTenant = (restCtx, alias, tenantUpdates, callback) => {
  tenantUpdates = defaultTo({}, tenantUpdates);

  let url = '/api/tenant';
  if (alias) {
    url += `/${RestUtil.encodeURIComponent(alias)}`;
  }

  const parameters = {
    displayName: tenantUpdates.displayName,
    host: tenantUpdates.host,
    emailDomains: tenantUpdates.emailDomains,
    countryCode: tenantUpdates.countryCode
  };
  RestUtil.performRestRequest(restCtx, url, HTTP_POST, parameters, err => {
    if (err) {
      callback(err);
    } else {
      // Give it some time to update
      setTimeout(callback, WAIT_TIME, err);
    }
  });
};

/**
 * Stop a running tenant through the REST API.
 *
 * @param  {RestContext}      restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}           alias               The alias of the tenant that needs to be stopped
 * @param  {Function}         callback            Standard callback function
 * @param  {Object}           callback.err        Error object containing error code and error message
 */
const stopTenant = (restCtx, alias, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/tenant/stop', HTTP_POST, { aliases: [alias] }, err => {
    if (err) {
      callback(err);
    } else {
      // Give it some time to stop
      setTimeout(callback, WAIT_TIME, err);
    }
  });
};

/**
 * Start a stopped tenant through the REST API.
 *
 * @param  {RestContext}      restCtx             Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {String}           tenantAlias         The alias of the tenant that needs to be started
 * @param  {Function}         callback            Standard callback function
 * @param  {Object}           callback.err        Error object containing error code and error message
 */
const startTenant = (restCtx, tenantAlias, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/tenant/start', HTTP_POST, { aliases: [tenantAlias] }, err => {
    if (err) {
      callback(err);
    } else {
      // Give it some time to start
      setTimeout(callback, WAIT_TIME, err);
    }
  });
};

/**
 * Get a tenant's landing page information
 *
 * @param  {RestContext}      restCtx                   Standard REST Context object that contains the current tenant URL and the current user credentials. In order for this to work, a global admin rest context will need to passed in.
 * @param  {Function}         callback                  Standard callback function
 * @param  {Object}           callback.err              Error object containing error code and error message
 * @param  {Object[]}         callback.landingPage      The landing page information
 */
const getLandingPage = (restCtx, callback) => {
  RestUtil.performRestRequest(restCtx, '/api/tenant/landingPage', HTTP_GET, null, callback);
};

export {
  createTenantNetwork,
  getTenantNetworks,
  updateTenantNetwork,
  deleteTenantNetwork,
  addTenantAliases,
  removeTenantAliases,
  getTenants,
  getTenantsByEmailAddress,
  getTenant,
  createTenant,
  updateTenant,
  stopTenant,
  startTenant,
  getLandingPage
};
