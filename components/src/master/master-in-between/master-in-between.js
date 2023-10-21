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
