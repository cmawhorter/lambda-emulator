'use strict';

var handlers = require('./_handlers.js');
var CreateServer = require('../server/index.js');

var type = process.argv[2];

CreateServer(handlers[type], type);
