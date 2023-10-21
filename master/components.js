import config from './config.js';

window.__bm = {
  config
};

await import(config.components_url + 'util.js');
const { Dito } = await Util.require('dito.min.js');

Util.requireStyleSheets(['/media/style/dist/master.min.css']);

const dito = new Dito({
  url: config.components_url
});
dito.bulk({
  'shared/shared-': [
    'router',
    {
      'router/shared-router-': [
        'link'
      ]
    },
  ],
  'master/master-': [
    'in-between',
    'main',
    '404',
    '401',
  ]
}, config.version);

dito.load();
