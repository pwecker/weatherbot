export default [
  {
    method: 'GET',
    path: '/auth',
    handler: 'auth.auth',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/callback',
    handler: 'auth.callback',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/status',
    handler: 'auth.status',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/create',
    handler: 'create.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/refresh',
    handler: 'forecast.refresh',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/message',
    handler: 'message.message',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/upload',
    handler: 'upload.upload',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/track',
    handler: 'upload.track',
    config: {
      policies: [],
    },
  }
];
