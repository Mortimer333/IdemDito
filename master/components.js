import config from './config.example.js';
import Util from '../components/src/util.js';
import { Dito } from '../components/src/dito.js';

window.__bm = {
  config
};

Util.requireStyleSheets(['/media/style/dist/master.min.css']);

const version = config.version;
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
    '404',
    '401',
  ]
}, version);

dito.load();
