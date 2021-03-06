/*!
 * Copyright (c) 2014-present Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/* globals ExtensionAPI */

import { hasPref, getPref } from './prefs';
import externalProtocolHandlerExists from './protocol';

global.cliqz = class extends ExtensionAPI {
  getAPI() {
    return {
      cliqz: {
        hasPref,
        getPref,
        externalProtocolHandlerExists,
      },
    };
  }
};
