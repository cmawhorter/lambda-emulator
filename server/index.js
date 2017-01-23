'use strict';

const Hapi = require('hapi');

const createContext = require('../lambda/context.js');

const apigatewayRequestHandler = require('../origins/api-gateway.js');
const lambdaRequestHandler = require('../origins/lambda.js');

module.exports = function(lambdaHandler, type) {
  let server = new Hapi.Server();

  server.connection({
    port: process.env.PORT || 3000,
  });

  let requestHandler;
  switch (type) {
    case 'lambda':
      requestHandler  = lambdaRequestHandler;
    break;
    case 'apigateway':
      requestHandler  = apigatewayRequestHandler;
    break;
    default:
      throw new Error(`invalid emulation type: ${type}`);
  }
  let handler = requestHandler(lambdaHandler, createContext);
  server.route({
    method: [ 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE' ],
    path: '/{mock*}',
    handler: (req, reply) => {
      let rawReq = req.raw.req;
      console.log('Request', JSON.stringify({
        method:       rawReq.method,
        url:          rawReq.url,
        headers:      rawReq.headers,
      }, null, 2));
      handler(req, reply);
    },
  });

  server.on('response', function(request) {
    let res = request.response;
    console.log('Response', {
      statusCode:     res.statusCode,
      headers:        res.headers,
      body:           res.body,
    });
  });

  server.on('request-error', function(res, err) {
    console.log('Server Error', err.stack || err);
  });

  server.start(err => {
    if (err) throw err;
    console.log('Server running at: ', server.info.uri);
  });

  return server;
};
