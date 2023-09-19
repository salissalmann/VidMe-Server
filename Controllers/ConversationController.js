const UserModel = require("../Models/UserModel")
const Conversation = require("../Models/Conversation");

const CreateConversation = async (req, res) => {
    try {
      const { MessageId, SenderId, text } = req.body;
  
      const user = await Conversation.findOne({ MessageId: req.body.MessageId });
      if (user) {
        const currentDate = new Date();
        user.content.push({ SenderId, text, currentDate });
        await user.save();
        res.status(200).json({ message: "Data saved successfully" });
      } else {
        const currentDate = new Date();
  
        const newData = new Conversation({
          MessageId,
          content: [{ SenderId, text, currentDate }],
        });
  
        await newData.save();
        res.status(200).json({ message: "New Object Created successfully" });
      }
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  
  // Write api to get Conversation based on MessageId
  const GetConversation = async (req, res) => {
    try {
      const { MessageId } = req.body;
      const user = await Conversation.find({ MessageId });
      if (user.length === 0) {
        return res.status(200).json({ message: 'User not found' });
      }
      const Id = user[0].SenderId;
      // const userInfo = await UserModel.findById(Id);
      // console.log(userInfo);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  module.exports = {
    CreateConversation,
    GetConversation
}