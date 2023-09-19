const Authentication = require('./Authentication')
const Posts = require('./Posts')
const Messages = require('./Message');
const Conversation = require('./Conversation');
const User = require('./User');

module.exports = (app) => {
    app.use('/api/auth', Authentication);
    app.use('/api/posts', Posts);
    app.use('/api/message', Messages);
    app.use('/api/conversation',Conversation);
    app.use('/api/user', User);
}
