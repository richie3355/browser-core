/*!
 * Copyright (c) 2014-present Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const publish = require('./common/publish');
const urls = require('./common/urls-cliqz');

module.exports = {
  platform: 'react-native',
  format: 'common',
  baseURL: '/',
  testsBasePath: './build/modules',
  testem_launchers: ['unit-node'],
  testem_launchers_ci: ['unit-node'],
  versionPrefix: '3',
  pack: [
    "(jq '.name=\\\"browser-core-user-agent-ios\\\"' package.json > package-new.json)",
    'mv package.json package-old.json',
    'mv package-new.json package.json',
    'npm pack',
    'mv package-old.json package.json',
  ].join(' && '),
  publish: publish.toEdge('browser-core-user-agent-ios', 'user-agent-ios'),
  isMobile: true,
  settings: Object.assign({}, urls, {
    ALLOWED_COUNTRY_CODES: ['de', 'at', 'ch', 'es', 'us', 'fr', 'nl', 'gb', 'it', 'se'],
    RESULTS_PROVIDER_ORDER: ['calculator', 'history', 'cliqz', 'querySuggestions', 'instant'],
    CLEAR_RESULTS_AT_SESSION_START: false,

    // (leave empty if you do not want to send messages)
    HUMAN_WEB_LITE_COLLECTOR: 'https://collector-stub.test.cliqz.com',
    HW_CHANNEL: 'ios',

    telemetry: {
      demographics: {
        brand: 'cliqz',
        name: 'browser',
        platform: 'ios',
      },
    },
  }),
  default_prefs: {
  },
  modules: [
    'core',
    'human-web-lite',
    'search',
    'mobile-cards',
    'anolysis',
    'geolocation',
    'news',
    'insights',
    'autoconsent',
  ],
  bundles: [
  ],
  resources: {
    bundling: 'assets',
    include: [
      'core/logo-database.json',
      'autoconsent/cosmetics.json',
    ]
  }
};
