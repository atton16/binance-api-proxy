const axios = require('axios');

const CONFIG = {
  port: process.env.PORT || 3000,
};

(async () => {
  await axios
    .get(`http://127.0.0.1:${CONFIG.port}/health`)
    .catch(error => {
      if (error.response) {
        process.exit(1);
      }
    
      if (error.request) {
        process.exit(1);
      }
    
      console.log('error', error.message);
      process.exit(1);
    });
  process.exit(0);
})();
