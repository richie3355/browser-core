/*!
 * Copyright (c) 2014-present Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import config from '../core/config';

const CLIQZ_BACKGROUNDS = {
  'bg-matterhorn': {
    name: 'bg-matterhorn',
    alias: 'matterhorn',
    isDefault: true,
  },
  'bg-alps': {
    name: 'bg-alps',
    alias: 'alps',
    isDefault: false,
  },
  'bg-light': {
    name: 'bg-light',
    alias: 'light',
    isDefault: false,
  },
  'bg-dark': {
    name: 'bg-dark',
    alias: 'dark',
    isDefault: false,
  },
  'bg-winter': {
    name: 'bg-winter',
    alias: 'winter',
    isDefault: false,
  },
  'bg-spring': {
    name: 'bg-spring',
    alias: 'spring',
    isDefault: false,
  },
  'bg-worldcup': {
    name: 'bg-worldcup',
    alias: 'worldcup',
    isDefault: false,
  },
  'bg-summer': {
    name: 'bg-summer',
    alias: 'summer',
    isDefault: false,
  },
  'bg-autumn': {
    name: 'bg-autumn',
    alias: 'autumn',
    isDefault: false,
  },
};

const GHOSTERY_BACKGROUNDS = {
  // NOTE: We currently propose only one background/theme with Ghostery Tab. In
  // the future we will have more. The default theme is using the dark theme.
  // 'bg-ghostery': {
  //   name: 'bg-ghostery',
  //   alias: 'ghostery',
  //   isDefault: true,
  // },
  'bg-ghostery-dark': {
    name: 'bg-ghostery-dark',
    alias: 'ghostery-dark',
    isDefault: true,
  },
  'bg-ghostery-forest': {
    name: 'bg-ghostery-forest',
    alias: 'ghostery-forest',
    isDefault: false,
  },
  'bg-ghostery-city': {
    name: 'bg-ghostery-city',
    alias: 'ghostery-city',
    isDefault: false,
  },
  'bg-ghostery-net': {
    name: 'bg-ghostery-net',
    alias: 'ghostery-net',
    isDefault: false,
  },
  'bg-ghostery-ghosties': {
    name: 'bg-ghostery-ghosties',
    alias: 'ghostery-ghosties',
    isDefault: false,
  },
  'bg-ghostery-ghosty': {
    name: 'bg-ghostery-ghosty',
    alias: 'ghostery-ghosty',
    isDefault: false,
  },
};

export default {
  features: {
    // TODO: platform-specific features to enable
    privacyStats: { enabled: false },
    history: { enabled: config.settings.channel !== '04' /* AMO */ },
  },
  settings: {
    HISTORY_URL: config.settings.HISTORY_URL,
    SUGGESTIONS_URL: config.settings.SUGGESTIONS_URL,
    FRESHTAB_REDIRECT: config.settings.FRESHTAB_REDIRECT,
    frameScriptWhitelist: config.settings.frameScriptWhitelist,
    onBoardingPref: config.settings.onBoardingPref,
    onboardingVersion: config.settings.onboardingVersion,
    NEW_TAB_URL: config.settings.NEW_TAB_URL,
  },
  constants: {
    TOOLTIP_WORLDCUP_GROUP: 'worldcup-group',
    TOOLTIP_WORLDCUP_KNOCKOUT: 'worldcup-knockout',
    PREF_SEARCH_MODE: 'freshtab.search.mode',
    NO_BG: 'bg-default',
    CUSTOM_BG: 'bg-custom',
    MAX_SPOTS: 6,
    MAX_PAGES: 3,
  },
  backgrounds: {
    CLIQZ: CLIQZ_BACKGROUNDS,
    GHOSTERY: GHOSTERY_BACKGROUNDS,
  },
  components: {
    background: 'background',
    cliqzTheme: 'cliqz_theme',
    customDials: 'favorites',
    historyDials: 'topsites',
    news: 'news',
    search: 'search_bar',
    stats: 'stats',
  },
};
