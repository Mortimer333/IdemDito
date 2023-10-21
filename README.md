# IdemDito
Micro Frontend, One-Page Application example written in `Dito` together with `npm` (`Tailwind CSS` and `esbuild`) as 
example of integration with other packages if necessary.

### In more than one sentence
This is an example of usage of `Dito` library in bigger scale then single landing page.
A showcase what can be done and proof of concept that it can be used for enterprise solutions. I will only explain the 
basics in this demo, try to get it working yourself - there are no hidden dependencies, all used code is right here.
I'm assuming that you are not completely new to this if you are checking out complex solution for decentralized 
architecture.
> But make sure to run `npm install` and `npm run dev`/`npm run prod` from `components/`, to have up-to-date environment

But to the point: What we are actually seeing here are two different websites:
- Components and Services provider - `components/` folder (good place to set `CDN`)
- and Master website with actual UI - `master/` folder

This kind of setup allows us to separate our services into Micro Frontend - every one in 
different subdomain and completely separate from each other but still sharing the same code. 
Few example we could point our domain and subdomains like this:
- example.com - `master/`
- blog.example.com - `blog/`
- shop.example.com - `shop/`
- etc.

And reuse the exact same components (consistent UI across different websites) in all of them by setting 
components.example.com pointing to `components/` folder.

Just to reiterate this is not some revolutionizing idea, it was done already thousands of times - this is just proof
of concept that `Dito` can achieve the same result as other libraries and build up from there.
> For sticklers: The dependencies I used in this project are only available when developing application (`Tailwind`
> for css rules or `esbuild` for minifying). The actual code you get is only using `Dito` components. You could remove
> `npm`, use not minified files, write all CSS rules by yourself, and it wouldn't matter for the script. They are 
> added for convenience/performance and as an example that we don't have to inconvenience ourselves.

## Okay then how this works?

Every `subapp` we have (so all the folders expect `components`) contains starting file `index.html` which requires 
`components.js` and something I like to call `In Between Component`.
```html
<body>
    <master-in-between dito-show></master-in-between>
    <script type="module" src="/media/script/dist/components.min.js" charset="utf-8"></script>
</body>
```
`In Between Component (IBC)` works as an entry point for the application (`main`/`source`/`root` if you want). 
But before we go to `IBC` you might want to check what [`component.min.js` does](COMPONENTSJS.md). 

### IBC
`IBC` has simple job - define app structure (subpages) and initialize the router and log user:
> Router implements page visibility based on user roles but this demo doesn't contain user login system as they are 
> based on what authentication solution you are using. But notice that there is a space in 
> `components/src/config.example.js` for user data and roles.

[`master-in-between.html`](components/src/master/master-in-between/master-in-between.html)
```html
<shared-router @i:navigation="navigation"></shared-router>
```
[`master-in-between.js`](components/src/master/master-in-between/master-in-between.js)
```js
const { Master } = await Util.require('master/master.js');

class MasterInBetween extends Master {
  async beforeFirstRender() {
    this.$.navigation = {
      '/': {
        meta: {
          title: 'Main Page',
          description: 'Main page of this example',
          keywords: 'dito,main,example',
        },
        component: 'master-main',
      },
      '/user': {
        visibility: __id.permissions.loggedIn,
        meta: {
          title: 'User Panel',
          description: 'Example of visibility use',
          keywords: 'dito,user,visibility,example',
        },
        component: 'master-user',
      },
    };
  }
}
export { MasterInBetween as default };
```
> I recommend putting login script in `MasterInBetween::beforeFirstRender`, as it's called before anything starts 
> loading which means that user is logged in (or not) for 100% before rendering any components.

Check [`router.js`](/components/src/services/router.js) for more details how this works.
> Router can accept variables in the `URL`, so you could pass for example blog id: `blog/1/show` (`blog/{id@\\d+}/show`)
> which can be accessed in Router.variables.

And that's it. Now router will automatically detect on which page it is and show appropriate component (for home page 
(`/`) it would show `master-main` and for `/user` - `master-user`) or error (`master-404` or `master-401` based on 
`config.js`).


I've also added `shared-router-link`, so check it out if you want to see how to move between pages without reloading the
whole app.

I also implore you to checking how `root.js` manages all shared and scoped `components` and how each scope has 
additional parent (`master.js` and `shared.js`) to achieve better control over default behaviour (e.g. to change it if 
necessary).
