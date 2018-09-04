const webextensionBase = require('../webextension');
const subprojects = require('../common/subprojects/bundles');
const publish = require('../common/publish');

const id = 'jagljfhhkmnjajmkkkmomddipnifkkmn';
const MODULE_BLACKLIST = [
  'overlay',
];

module.exports = Object.assign({}, webextensionBase, {
  publish: publish.toPrerelease('cliqz_tab_private_search_engine_beta_', 'webextension_pre', 'zip'),
  settings: Object.assign({}, webextensionBase.settings, {
    id,
    name: 'Cliqz Tab: private search engine (Beta)',
    description: "Cliqz Tab replaces Chrome's default new tab page and adds backgrounds, favorites, news and Cliqz's anonymous quick search.",
    channel: 'CT10', // Cliqz Tab Chrome Release
  }),
  modules: webextensionBase.modules.filter(m => MODULE_BLACKLIST.indexOf(m) === -1),
  default_prefs: Object.assign({}, webextensionBase.default_prefs, {
    showConsoleLogs: false,
    developer: false,
  }),
});