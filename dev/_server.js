'use strict';

var handlers = require('./_handlers.js');
var CreateServer = require('../server/index.js');

var type = process.argv[2];
var handler_variant = process.argv[3] || type;

var options = { handler: handlers[handler_variant], type };
console.log('options.handler', options.handler);
CreateServer(options);
if ('lambda' === type) {
  setTimeout(() => {
    console.log('swapping lambda handler');
    options.handler = handlers.lambda2;
    console.log('options.handler', options.handler);
  }, 5000);
}
