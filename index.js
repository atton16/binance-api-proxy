const axios = require('axios');

const config = {
  debug: {
    response: process.env.DEBUG_RESPONSE === 'true',
  }
};

exports.handler = async (event, context) => {
  const debugKeys = Object.keys(process.env).filter(k => k.indexOf('DEBUG_') === 0);
  const debugEnv = {};
  for (let i = 0; i < debugKeys.length; i++) {
    debugEnv[debugKeys[i]] = process.env[debugKeys[i]];
  }
  console.log('process.env.DEBUG_*', debugEnv);
  const method = event.requestContext.http.method;
  const path = event.rawPath;
  const headers = event.headers;
  const query = event.queryStringParameters;
  const isBase64Encoded = event.isBase64Encoded;
  const body = event.body;
  const proxiedHeaders = {};
  if (headers['content-type'] !== undefined) {
    proxiedHeaders['Content-Type'] = headers['content-type'];
  }
  if (headers['x-mbx-apikey'] !== undefined) {
    proxiedHeaders['X-MBX-APIKEY'] = headers['x-mbx-apikey'];
  }
  const request = {
    method,
    url: `https://api.binance.com${path}`,
    headers: proxiedHeaders,
    params: query,
  };
  if (isBase64Encoded !== undefined && body !== undefined) {
    request.data = Buffer.from(body, 'base64').toString();
  } else if (body !== undefined) {
    request.data = body;
  }
  console.log(new Date());
  console.log('request', request);
  return axios.request(request).then(response => {
    if (config.debug.response) {
      console.debug('reponse', response);
    }
    console.log('response.data', response.data);
    return {
      statusCode: 200,
      headers: JSON.parse(JSON.stringify(response.headers)),
      body: response.data,
    };
  }).catch(error => {
    if (error.response) {
      console.log(`error response ${error.response.status}`, error.response.data);
      return {
        statusCode: error.response.status,
        headers: JSON.parse(JSON.stringify(error.response.headers)),
        body: error.response.data,
      };
    } else if (error.request) {
      console.log('error response 504');
      return {
        statusCode: 504,
        headers: {'content-type': 'text/plain; charset=utf-8'},
        body: '',
      };
    } else {
      console.log('error response 502', error.message);
      return {
        statusCode: 502,
        headers: {'content-type': 'text/plain; charset=utf-8'},
        body: error.message,
      };
    }
  });
};
