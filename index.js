const axios = require('axios');
const querystring = require('node:querystring');

const config = {
  debug: {
    response: process.env.DEBUG_RESPONSE === 'true',
  },
  path: {
    override: {
      enable: process.env.PATH_OVERRIDE_ENABLE === 'true',
      prefixMatch: process.env.PATH_OVERRIDE_PREFIX_MATCH || '',
      replaceWith: process.env.PATH_OVERRIDE_REPLACE_WITH || '',
    },
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
  let path = event.rawPath;
  const headers = event.headers;
  const query = querystring.parse(event.rawQueryString);
  // const query = event.queryStringParameters;
  const isBase64Encoded = event.isBase64Encoded;
  const body = event.body;
  const proxiedHeaders = {};
  if (event.pathParameters && event.pathParameters.proxy) {
    console.log('path', path);
    const newPath = `/${event.pathParameters.proxy}`;
    console.log('overriden path by pathParameters', newPath);
    path = newPath;
  } else if (config.path.override.enable) {
    if (
      config.path.override.prefixMatch &&
      path.indexOf(config.path.override.prefixMatch) === 0
    ) {
      console.log('path', path);
      const newPath = `${config.path.override.replaceWith}${path.substring(config.path.override.prefixMatch.length)}`;
      console.log('overriden path by prefixMatch', newPath);
      path = newPath;
    }
  }
  console.log('event', event);
  console.log('context', context);
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
  if (isBase64Encoded === true && body !== undefined) {
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
    console.log('response.headers', response.headers);
    console.log('response.data', response.data);
    let isJson = false;
    if (response.headers['content-type'].indexOf('application/json') === 0) {
      isJson = true;
    }
    return {
      statusCode: 200,
      headers: {'content-type': response.headers['content-type']},
      body: isJson ? JSON.stringify(response.data) : response.data,
    };
  }).catch(error => {
    if (error.response) {
      console.log(`error response ${error.response.status}`, error.response.data);
      let isJson = false;
      if (error.response.headers['content-type'].indexOf('application/json') === 0) {
        isJson = true;
      }
      return {
        statusCode: error.response.status,
        headers: {'content-type': error.response.headers['content-type']},
        body: isJson ? JSON.stringify(error.response.data) : error.response.data,
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
