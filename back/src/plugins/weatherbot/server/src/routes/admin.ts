export default [
  {
    method: 'GET',
    path: '/status',
    handler: 'auth.status',
    config: {
      policies: []
    },
  },
  {
    method: 'GET',
    path: '/auth',
    handler: 'auth.auth',
    config: {
      policies: []
    },
  },
  {
    method: 'GET',
    path: '/callback',
    handler: 'auth.callback',
    config: {
      auth: false,
      policies: []
    },
  },
];