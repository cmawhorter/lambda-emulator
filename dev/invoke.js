'use strict';

var assert = require('assert');
var AWS = require('aws-sdk');
var lambda = new AWS.Lambda({
  endpoint:           'http://localhost:3000',
  region:             'local-dev',
  accessKeyId:        'a',
  secretAccessKey:    'b',
  maxRetries:         0,
});

lambda.invoke({
  FunctionName: 'some-function',
  Payload: JSON.stringify({
    some: 'data',
    goes: true,
    here: {
      now: Date.now(),
    },
  }),
}, (err, data) => {
  assert.ifError(err);
  console.log(data);
});
