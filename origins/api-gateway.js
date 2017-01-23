'use strict';

var uuid = require('uuid');

function createEvent(request) {
  return {
    "resource": "/{proxy+}",
    "path": "/" + request.params.mock,
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
      "resourcePath": "/{proxy+}",
      "httpMethod": request.method.toUpperCase(),
      "apiId": "f9pocn2kn4"
    },
    "body": JSON.stringify(request.body),
    "isBase64Encoded": false
  };
}

module.exports = function(lambdaHandler, createContext) {
  return (request, reply) => {
    let context = createContext(180 * 1000, null, (err, invocationOutcome) => {
      if (err) {
        reply(err);
      }
      else {
        let response = reply(JSON.parse(invocationOutcome.body || 'null'));
        response.type('application/json');
        response.code(invocationOutcome.statusCode);
        let headers = invocationOutcome.headers || {};
        for (let k in headers) {
          response.header(k, headers[k]);
        }
      }
    });
    let event = createEvent(request);
    lambdaHandler(event, context, context.done);
  };
};
