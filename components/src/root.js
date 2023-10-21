const {
  config,
  DitoElement,
} = await Util.requireBulk([
  'config.js',
  'ditoelement.min.js',
]);

class Root extends DitoElement {
  async init() {
    __bm.root = __bm.root || { config };
    __bm.permissions = {
      loggedIn: ['ROLE_USER'],
      notLoggedIn: ['NOT_LOGGED_IN'],
    };
    this.clearRenderQueue();
    await this.afterInit();
  }

  afterInit() {} // placeholder

  checkVisibility(visibility) {
    if (!visibility) {
      return true;
    }

    return visibility.filter(value => {
      if (!Array.isArray(__bm.root.config?.user?.details?.roles)) {
        return value === __bm.permissions.notLoggedIn[0];
      }

      return __bm.root.config.user.details.roles.includes(value);
    }).length > 0;
  }
}
export { Root };
