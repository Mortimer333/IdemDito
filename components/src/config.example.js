const config = {
  api: {
    url: 'http://api.example.local/',
    params: {
      'example': 'value',
    },
    headers: {
      'Access-Control-Allow-Origin': 'api.example.local',
      'Content-Type': 'application/json',
    },
  },
  env: 'local',
  url: 'http://example.local/',
  domain: 'example.local',
  components_url: 'http://components.example.local/src/',
  version: Math.random(),
  user: {
    roles: [],
  },
};

export { config };
