'use strict';

const uuid = require('uuid');
const lambdaApi = require('../lambda/api-incoming.js');
const arn = require('../lib/arn.js');

module.exports = function(lambdaHandler, createContext, options) {
  return (request, reply) => {
    if (request.method !== 'post') {
      return reply(new Error('Only http POST is allowed: ' + request.method));
    }
    // POST /2015-03-31/functions/FunctionName/invocations?Qualifier=Qualifier HTTP/1.1
    let functionName = lambdaApi.parseFunctionNameFromPath(request.params.mock);
    let InvocationType = request.headers['x-amz-invocation-type'];
    if (InvocationType && InvocationType !== 'RequestResponse') {
      return reply(new Error('RequestResponse is the only supported InvocationType'));
    }
    let invokedFunctionArn;
    if (0 === functionName.indexOf('arn:')) {
      invokedFunctionArn = functionName;
      functionName = arn.parse(invokedFunctionArn).resource.split(':')[1];
    }
    else {
      invokedFunctionArn = `arn:aws:lambda:local-dev:1234567890:function:${functionName}`;
    }
    let clientContext = JSON.parse(request.headers['x-amz-client-context'] || '{}');
    let payload = request.body;
    let context = createContext(180 * 1000, {
      invokedFunctionArn,
      functionName,
      clientContext,
    }, (err, invocationOutcome) => {
      var result;
      let statusCode;
      if (err) {
        console.log('invocation error:', err.stack || err);
        statusCode = 500;
        result = { FunctionError: 'Handled' };
      }
      else {
        statusCode = 200;
        result = JSON.stringify(invocationOutcome);
      }
      let response = reply(result);
      response.type('application/json');
      response.code(statusCode);
    });
    let event = payload;
    lambdaHandler(event, context, context.done);
  };
};
