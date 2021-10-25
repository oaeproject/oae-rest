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
 * Note: Most of the REST wrappers will take a RestContext (ctx) object as the first parameter
 * This context parameter specifies the tenant URL we're working on
 * as well as the user making the request and his password.
 *
 * It will be of the following form:
 *
 *     `{'host': http://oae.oaeproject.org, 'userId': 'janedoe', 'password': 'foo'}`
 *
 * For anonymous users, `userId` and `password` will be `null`.
 */

import * as Activity from './api.activity.js';
import * as Admin from './api.admin.js';
import * as Authentication from './api.authentication.js';
import * as Config from './api.config.js';
import * as Content from './api.content.js';
import * as Crop from './api.crop.js';
import * as Discussions from './api.discussions.js';
import * as Doc from './api.doc.js';
import * as Folders from './api.folders.js';
import * as Following from './api.following.js';
import * as Group from './api.group.js';
import * as Invitations from './api.invitations.js';
import * as LtiTool from './api.lti.js';
import * as MeetingsJitsi from './api.meetings-jitsi.js';
import * as OAuth from './api.oauth.js';
import * as Previews from './api.previews.js';
import * as Search from './api.search.js';
import * as Telemetry from './api.telemetry.js';
import * as Tenants from './api.tenants.js';
import * as UI from './api.ui.js';
import * as User from './api.user.js';
import * as Version from './api.version.js';

export {
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
  MeetingsJitsi,
  OAuth,
  Previews,
  Search,
  Telemetry,
  Tenants,
  UI,
  User,
  Version
};
