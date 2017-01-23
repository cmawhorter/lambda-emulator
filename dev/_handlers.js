module.exports = {
  lambda: function(event, context, callback) {
    console.log('Event', JSON.stringify(event, null, 2));
    console.log('Context', JSON.stringify(context, null, 2));
    setTimeout(() => callback(null, {
      hello:  'world',
      date:   new Date().toISOString(),
    }), 0);
  },

  apigateway: function(event, context, callback) {
    console.log('Event', JSON.stringify(event, null, 2));
    console.log('Context', JSON.stringify(context, null, 2));
    setTimeout(() => callback(null, {
      statusCode:   200,
      headers:      null,
      body: {
        hello:      'world',
        date:       new Date().toISOString(),
      },
    }), 0);
  }
};
