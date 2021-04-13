**If you're coming here still, you should probably be going [here](https://github.com/lambci/docker-lambda) instead**

# lambda-emulator

Goal: Test invoking lambda functions locally in a manner that is as close to production as sanely possible.

This is an emulator and not a simulator.

`npm install cmawhorter/lambda-emulator --save-dev`

## Getting started

server.js
```js
var createServer = require('lambda-emulator');
var handler = require('./handler.js');
createServer(handler, 'lambda'); // "lambda" is the scenario to emulate
```

handler.js
```js
module.exports = function(event, context, callback) {
  console.log('event', event);
  console.log('context will be similar to production', context);
  callback(null, {
    hello: 'world'
  });
};
```

dev.js
```js
var AWS = require('aws-sdk');
var lambda = new AWS.Lambda({
  endpoint:           'http://localhost:3000', // required
  region:             'local-dev',             // required?
  accessKeyId:        'a',                     // something required
  secretAccessKey:    'b',                     // something required
  maxRetries:         0,                       // optional
});

lambda.invoke({
  // only one handler can be tested per server so this 
  // is largely for logging and making context have something
  // more production-ish
  FunctionName: 'some-function', 
  Payload: JSON.stringify({
    some: 'data',
    goes: true,
    here: {
      now: Date.now(),
    },
  }),
}, (err, data) => {
  console.log(data);
});
```

## Types of servers emulated

Lambda can be invoked in a variety of different ways: 

- Manual (API client -> RequestResponse)
- Trigger (event source e.g. SNS)
- Stream (kinesis e.g. kinesis or dynamodb stream) 
- API Gateway (which is technically a trigger, which itself is technically RequestResposne with service event, but w/e)

However, at this time, only Manual and API Gateway are supported.

See `dev/_handlers.js` for examples of each.

### Lambda RequestResponse

`createServer(handler, 'lambda')`

Any regular AWS client properly configured should be able to invoke and work as expected.

### API Gateway Proxy

`createServer(handler, 'apigateway')`

Emulates an API Gateway request and Lambda proxy invocation.  Assumes it's proxy is from server root e.g. `apigateway.example.com/prod/anything/here/gets/proxied`

Not ideal, but works.  (PR welcome.)  Additionally none of the advanced API Gateway features are implemented (like api keys, transforms, etc. and the upcoming Lambda@Edge)
