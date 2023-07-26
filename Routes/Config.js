const Authentication = require('./Authentication')

module.exports = (app) => {
    app.use('/api/auth', Authentication);
}
