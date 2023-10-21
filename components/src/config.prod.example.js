const config = {
  api: {
    url: 'http://api.example.com/',
    params: {
      'example': 'value',
    },
    headers: {
      'Access-Control-Allow-Origin': 'api.example.com',
      'Content-Type': 'application/json',
    },
  },
  env: 'prod',
  url: 'http://example.com/',
  domain: 'example.com',
  components_url: 'http://components.example.com/dist/',
  version: 1,
  user: {
    roles: [],
  },
};

export { config };
