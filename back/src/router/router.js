const home = require('../routes/home');
const user = require('../routes/user');
const plan = require('../routes/plan');

module.exports = (app) => {
    app.use('/back/home', home);
    app.use('/back/user', user);
    app.use('/back/plan', plan);
}