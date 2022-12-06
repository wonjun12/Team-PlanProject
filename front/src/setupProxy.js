const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        '/data',
        createProxyMiddleware({
            target: 'https://api.openweathermap.org',
            changeOrigin: true
        })
    );
    app.use(
        ['/map-direction', '/map-direction-15', '/map-geocode'],
        createProxyMiddleware({
            target: 'https://naveropenapi.apigw.ntruss.com',
            changeOrigin: true
        })
    );
    app.use('/back',
        createProxyMiddleware({
                target: 'http://localhost:4721',
                changeOrigin: true
            })
    );
};