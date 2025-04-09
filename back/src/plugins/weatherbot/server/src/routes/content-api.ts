export default [
  {
    method: 'POST',
    path: '/create',
    handler: 'create.create',
    config: {
      auth: false,
      policies: [
        'plugin::weatherbot.token'
      ]
    },
  },
  {
    method: 'GET',
    path: '/refresh',
    handler: 'forecast.refresh',
    config:{
      auth: false,
      policies: [
        'plugin::weatherbot.token'
      ]
    },
  },
  {
    method: 'GET',
    path: '/message',
    handler: 'message.message',
    config: {
      auth: false,
      policies: [
        'plugin::weatherbot.token'
      ]
    },
  },
  {
    method: 'GET',
    path: '/upload',
    handler: 'upload.upload',
    config: {
      auth: false,
      policies: [
        'plugin::weatherbot.token'
      ]
    },
  },
  {
    method: 'GET',
    path: '/track',
    handler: 'upload.track',
    config: {
      auth: false,
      policies: [
        'plugin::weatherbot.token'
      ]
    },
  },
  {
    method: 'GET',
    path: '/:cmds',
    handler: 'cmds.run',
    config: {
      auth: false,
      policies: [
        'plugin::weatherbot.token'
      ]
    },
  }
];
