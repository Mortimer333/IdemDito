class Router {
  static variables = {};
  static events = {
    getRoute: _ => new CustomEvent('route', {
      detail: {},
      bubbles: true,
      cancelable: true,
      composed: false,
    }),
  };
  static query = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  static goTo(location, state = {}, title = '') {
    window.history.pushState(state, title, location);
    document.dispatchEvent(Router.events.getRoute());
  }

  static fixRoute(navigation, route) {
    if (typeof navigation[route] == 'string') {
      navigation[route] = {
        component: navigation[route],
      };
    }

    if (route[route.length - 1] === '/' && route.length !== 1) {
      const newRoute = route.substring(0, route.length - 1);
      navigation[newRoute] = navigation[route];
      delete navigation[route];
      route = newRoute;
    }

    navigation[route]._regex = { route: '^' + route + '$' };

    if (route.indexOf('{') === -1) {
      return;
    }

    Router.chunkRoute(navigation, route);
  }

  static getTag(navigation, user = null) {
    let tag = null,
      path = document.location.pathname;
    const routeKeys = Object.keys(navigation);
    if (path.length > 1 && path[path.length - 1] === '/') {
      path = path.substring(0, path.length - 1);
    }
    const splitPath = path.split('/');

    for (let i = 0; i < routeKeys.length; i++) {
      const regex = navigation[routeKeys[i]]._regex.route;

      if (regex.split('/').length !== splitPath.length) {
        continue;
      }

      if (new RegExp(regex).test(path)) {
        tag = navigation[routeKeys[i]];
        break;
      }
    }

    if (!tag) {
      return { component: window.__bm.config.errors[404], error: 404 };
    }

    if (
      tag?.visibility
      && (
        !Array.isArray(user?.details?.roles)
        || tag.visibility.filter(value => user?.details?.roles?.includes(value)).length === 0
      )
    ) {
      return { component: window.__bm.config.errors[401], error: 401 };
    }
    return tag;
  }

  static getTagVariables(tag) {
    if (!tag._regex?.variables) {
      Router.variables = {};
      return;
    }

    const variables = {},
      segments = document.location.pathname.split('/');
    tag._regex.variables.forEach(variable => {
      variables[variable.key] = segments[variable.segment];
    });

    Router.variables = variables;
  }

  static chunkRoute(navigation, route) {
    const regex = {
      route: '',
      variables: [],
    };
    let inVar = false,
      varEnd = 0,
      segment = route.split('/').length - 1,
      properRoute = route;
    for (let i = route.length; i >= 0; i--) {
      const letter = route[i];

      if (!inVar && letter === '/') {
        segment--;
      }

      if (!inVar && letter === '}') {
        inVar = true;
        varEnd = i + 1;
      } else if (inVar && letter === '{') {
        const [key, regexKey] = Router.getRegexFromKey(route.substring(i + 1, i + 1 + varEnd - i - 2));
        regex.variables.push({
          segment,
          key: key,
        });
        const prefix = properRoute.substring(0, i),
          suffix = properRoute.substring(varEnd);
        properRoute = prefix + regexKey + suffix;
        varEnd = 0;
        inVar = false;
      }
    }
    regex.route = properRoute;
    navigation[route]._regex = regex;
  }

  static getRegexFromKey(key) {
    const index = key.indexOf('@');
    if (index === -1) {
      return [key, '.*'];
    }

    return key.split('@');
  }
}
export { Router };
