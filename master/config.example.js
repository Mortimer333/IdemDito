const rando = Math.random();

const config = {
  env: 'local',
  domain: 'master',
  components_url: "http://components.example.local/src/",
  version: rando,
  errors: {
    '404': 'master-404',
    '401': 'master-401',
  }
};

export { config as default };
