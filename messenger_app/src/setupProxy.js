const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://whatsapp-backend-11.onrender.com',
      changeOrigin: true,
      secure: false
    })
  );
};