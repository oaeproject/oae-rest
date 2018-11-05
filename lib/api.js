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

/*!
 * Define the REST API wrappers for the different modules of the application.
 *
 * Note: Most of the REST wrappers will take a RestContext (ctx) object as the first parameter. This context
 * parameter specifies the tenant URL we're working on, as well as the user making the request and his password.
 *
 * It will be of the following form:
 *
 *     `{'host': http://oae.oaeproject.org, 'userId': 'janedoe', 'password': 'foo'}`
 *
 * For anonymous users, `userId` and `password` will be `null`.
 */

const Activity = require('./api.activity');
const Admin = require('./api.admin');
const Authentication = require('./api.authentication');
const Config = require('./api.config');
const Content = require('./api.content');
const Crop = require('./api.crop');
const Discussions = require('./api.discussions');
const Doc = require('./api.doc');
const Folders = require('./api.folders');
const Following = require('./api.following');
const Group = require('./api.group');
const Invitations = require('./api.invitations');
const LtiTool = require('./api.lti');
const MediaCore = require('./api.mediacore');
const MeetingsJitsi = require('./api.meetings-jitsi');
const OAuth = require('./api.oauth');
const Previews = require('./api.previews');
const Search = require('./api.search');
const Telemetry = require('./api.telemetry');
const Tenants = require('./api.tenants');
const UI = require('./api.ui');
const User = require('./api.user');
const Uservoice = require('./api.uservoice');
const Version = require('./api.version');

module.exports = {
  Activity,
  Admin,
  Authentication,
  Config,
  Content,
  Crop,
  Discussions,
  Doc,
  Folders,
  Following,
  Group,
  Invitations,
  LtiTool,
  MediaCore,
  MeetingsJitsi,
  OAuth,
  Previews,
  Search,
  Telemetry,
  Tenants,
  UI,
  User,
  Uservoice,
  Version
};
