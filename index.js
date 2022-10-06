const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.raw());
app.use((req, res) => {
  const method = req.method;
  const path = req.path;
  const headers = req.headers;
  const query = req.query;
  const body = req.body;
  proxiedHeaders = {};
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
  if (body instanceof Buffer) {
    request.data = body.toString();
  }
  console.log(new Date());
  console.log('request', request);
  axios.request(request).then(response => {
    console.log('reponse', response.data);
    res.send(response.data);
  }).catch(error => {
    if (error.response) {
      console.log(`error response ${error.response.status}`, error.response.data);
      res.status(error.response.status);
      res.send(error.response.data);
    } else if (error.request) {
      console.log('error response 504');
      res.sendStatus(504);
    } else {
      console.log('error response 502', error.message);
      res.status(502);
      res.send(error.message);
    }
  });
});
app.listen(3000, '0.0.0.0', () => console.log('Listening on 0.0.0.0:3000'));
