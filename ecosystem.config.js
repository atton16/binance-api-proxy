module.exports = {
  apps : [{
    name   : "binance-api-proxy",
    script : "./index.js",
    cwd: "/home/ubuntu/binance-api-proxy",
    env: {
      "PORT": "3001",
    }
  }]
}
