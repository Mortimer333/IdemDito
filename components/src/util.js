class Util {
  static requireStyleSheets(hrefs) {
    const head = document.querySelector('head');
    hrefs.forEach(href => {
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = href + '?domain=' + document.location.host + '&version=' + __bm.config.version;
      head.appendChild(link);
    });
  }

  static requireScripts(sources) {
    const head = document.querySelector('head');
    sources.forEach(src => {
      const script = document.createElement('script');
      script.src = src.src;
      Object.keys(src.attrs || {}).forEach(name => {
        script.setAttribute(name, src.attrs[name]);
      });
      head.appendChild(script);
    });
  }

  static async require(path, queryParams = {}) {
    const url = new URL(__bm.config.components_url + path);
    url.searchParams.append('domain', document.location.host);
    url.searchParams.append('version', __bm.config.version);

    Object.keys(queryParams).forEach(param => {
      url.searchParams.append(param, queryParams[param]);
    });

    return new Promise(async resolve => {
      const imported = await import(url.href);

      // Safari check as it actually returns not resolved Promises when await is used in the top level
      // outside of this function
      const safari = Util.isSafari();
      while (safari) {
        try {
          Object.values(imported); // Here we check if we can access imported modules
          break;
        } catch (e) {
          await new Promise(resolve => setTimeout(resolve, 100)); // wait 100 for modules to load
        }
      }

      resolve(imported);
    });
  }

  static async requireBulk(scripts) {
    const require = [];
    scripts.forEach(script => {
      require.push(
        Util.require(
          ...Array.isArray(script) ? script : [script],
        ),
      );
    });

    return Promise.all(require).then(scripts => {
      return Object.assign({}, ...scripts);
    });
  }

  static isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }
}

window.Util = Util;

export default Util;
