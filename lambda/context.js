'use strict';

const uuid = require('uuid');
const deepAssign = require('deep-assign');

module.exports = function(duration, options, callback) {
  options = options || {};
  var end = Date.now() + duration;
  var context = deepAssign({
    functionName: 'function-name',
    functionVersion: '$LATEST',
    invokedFunctionArn: `arn:aws:lambda:local-dev:1234567890:function:${options.functionName || 'function-name'}`,
    memoryLimitInMB: 256,
    awsRequestId: uuid.v4(),
    callbackWaitsForEmptyEventLoop: true,
    identity: {
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
    },
    clientContext: {},
    getRemainingTimeInMillis: function() {
      return Math.max(0, end - Date.now());
    },
    succeed: function(obj) {
      callback(null, obj);
    },
    fail: function(err) {
      callback(err);
    },
    done: function(err, obj) {
      if (err) {
        context.fail(err);
      }
      else {
        context.succeed(obj);
      }
    },
  }, options);
  return context;
};
