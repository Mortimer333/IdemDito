const { Root } = await Util.require('root.js');

class Shared extends Root {
  async afterInit() {
    await this.afterShared();
  }

  afterShared() {} // Placeholder
}
export { Shared };
