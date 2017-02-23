'use strict';

var handlers = require('./_handlers.js');
var CreateServer = require('../server/index.js');

var type = process.argv[2];

var options = { handler: handlers[type], type };
console.log('options.handler', options.handler);
CreateServer(options);
if ('lambda' === type) {
  setTimeout(() => {
    console.log('swapping lambda handler');
    options.handler = handlers.lambda2;
    console.log('options.handler', options.handler);
  }, 5000);
}
