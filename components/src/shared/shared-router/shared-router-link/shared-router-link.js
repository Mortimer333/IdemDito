const { Shared } = await Util.require('shared/shared.js'),
  { Router } = await Util.require('services/router.js');

class SharedRouterLink extends Shared {
  afterShared() {
    this.$.classes = this.$.classes || '';
    this.$.href = this.$.href || '#';
  }

  afterFirstRender() {
    this.$self.get.link?.addEventListener('click', e => {
      if (this.$.href.startsWith('http') && !this.$.href.startsWith(location.origin)) {
        return;
      }

      e.preventDefault();
      Router.goTo(this.$.href);
    });
    this.$self.get.link.setAttribute('href', this.$.href);
  }

  getUse() {
    if (this.$self.scope.use) {
      return this.$self.scope.use;
    }

    return {};
  }
}
export { SharedRouterLink as default };
