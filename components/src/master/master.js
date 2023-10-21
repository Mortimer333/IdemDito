const { Root } = await Util.require('root.js');

class Master extends Root {
  async afterInit() {
    await this.afterMaster();
  }

  afterMaster() {} // Placeholder
}
export { Master };
