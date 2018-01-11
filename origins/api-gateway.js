'use strict';

var uuid = require('uuid');

function createEvent(request, prefix) {
  prefix = prefix || '';
  // prefix should always start with a forward slash, if it exists
  if (prefix.length > 0 && prefix[0] !== '/') {
    prefix = '/' + prefix;
  }
  return {
    "resource": "/{proxy+}",
    "path": prefix + "/" + request.params.mock,
    "httpMethod": request.method.toUpperCase(),
    "headers": request.headers,
    "queryStringParameters": request.query,
    "pathParameters": {
      "proxy": request.params.mock
    },
    "stageVariables": null,
    "requestContext": {
      "accountId": "754649399213",
      "resourceId": "aaihdz",
      "stage": "test-invoke-stage",
      "requestId": uuid.v4(),
      "identity": {
        "cognitoIdentityPoolId": null,
        "accountId": "754649399213",
        "cognitoIdentityId": null,
        "caller": "754649399213",
        "apiKey": "test-invoke-api-key",
        "sourceIp": "test-invoke-source-ip",
        "accessKey": "ASIAIMPHTMEZBZ6BZ5OA",
        "cognitoAuthenticationType": null,
        "cognitoAuthenticationProvider": null,
        "userArn": "arn:aws:iam::754649399213:root",
        "userAgent": "Apache-HttpClient/4.5.x (Java/1.8.0_102)",
        "user": "754649399213"
      },
      "resourcePath": prefix + "/{proxy+}",
      "httpMethod": request.method.toUpperCase(),
      "apiId": "f9pocn2kn4"
    },
    "body": JSON.stringify(request.body),
    "isBase64Encoded": false
  };
}

function getContentType(headers) {
  headers = headers || {};
  let keys = Object.keys(headers);
  for (let i=0; i < keys.length; i++) {
    let headerName = keys[i];
    if (headerName.toLowerCase() === 'content-type') {
      return headers[headerName];
    }
  }
  return;
}

function setResponseHeaders(response, headers, exclude) {
  headers = headers || {};
  exclude = exclude || [];
  Object.keys(headers).forEach(headerName => {
    if (exclude.indexOf(headerName.toLowerCase()) < 0) {
      response.header(headerName, headers[headerName]);
    }
  });
}

module.exports = function(lambdaHandler, createContext, options) {
  return (request, reply) => {
    let context = createContext(180 * 1000, null, (err, invocationOutcome) => {
      if (err) return reply(err);
      let body;
      if (invocationOutcome.isBase64Encoded) {
        body = new Buffer(invocationOutcome.body, 'base64');
      }
      else {
        body = invocationOutcome.body || 'null';
      }
      let response = reply(body);
      let contentType = getContentType(invocationOutcome.headers) || 'application/json';
      response.type(contentType);
      response.code(invocationOutcome.statusCode);
      setResponseHeaders(response, invocationOutcome.headers, [ 'content-type' ]);
    });
    let event = createEvent(request, options.prefix || null);
    lambdaHandler(event, context, context.done);
  };
};
