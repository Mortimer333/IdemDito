# `components.js`
Before minifying `component.js` the file is located in the root folder of our `subapp` -
[`master/components.js`](master/components.js) and defines all settings for our app. Almost all configs will look the 
same expect content of `dito.bulk` method.

Let's break it down:

## Phase #1
```js
/* #1. Fetch base classes and configs */
import config from './config.js';

window.__id = {
  config
};

await import(config.components_url + 'util.js');
const { Dito } = await Util.require('dito.min.js');
```

### `config`
First thing we need are the settings for the application. Personally I'm not saving `config` with git because it 
contains the application setup which will differ between environments. You can check 
[`config.example.js`](master/config.example.js) or [`config.prod.example.js`](master/config.prod.example.js) to see 
what they look like. 

Then I save the config into `global` variable, so I can access it from everywhere.

### `Util`
Next step is requesting `Util` class using just retrieved config. I made `Util` to fill the gap after missing `require` 
method from `node`. 

### `Dito`
And lastly importing `Dito` class using `Util` functionality.

## Phase #2
```js
/* #2. Request CSS and setup Dito */
Util.requireStyleSheets(['/media/style/dist/master.min.css']);

const dito = new Dito({
  url: config.components_url
});
```
For our `Phase  #2` we are requesting css styles through `Util` class (it automatically adds `cache bursting` based on 
config, so it's better than manually adding style to `index.html`) and setting our first and only instance of `Dito`.

## Phase #3
```js
/* #3. Register all component and start loading */
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
```
For last step we are using `dito.bulk` to register components from two namespaces:
- `shared` - components reused in all of the `subapps`
- `master` - components meant to be used only in `master subapp` 

And start the application with `dito.load`.
