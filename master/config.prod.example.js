const config = {
  env: 'prod',
  domain: 'master',
  components_url: "http://components.example.local/dist/",
  version: 1,
  errors: {
    '404': 'master-404',
    '401': 'master-401',
  }
};

export { config as default };
