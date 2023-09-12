const Authentication = require('./Authentication')
const Posts = require('./Posts')

module.exports = (app) => {
    app.use('/api/auth', Authentication);
    app.use('/api/posts', Posts);

}
