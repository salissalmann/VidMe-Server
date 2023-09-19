const UserModel = require("../Models/UserModel")
const Message = require("../Models/Message");

const CreateMessage = async (req, res) => {
    try {
      const {
        SenderId,
        RecieverId
      } = req.body;
  
      const newData = new Message({
        SenderId,
        RecieverId,
      });
  
      await newData.save();
      res.status(200).json({ message: "Data saved successfully" });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  
  const FindMessage = async (req, res) => {
    try {
      const { Id } = req.body;
      const aggregationPipeline = [
        {
          $match: {
            $or: [
              { SenderId: Id },
              { RecieverId: Id },
            ],
          },
        },
        {
          $group: {
            _id: null,
            documents: { $push: '$$ROOT' },
          },
        },
      ];
      const user = await Message.aggregate(aggregationPipeline);
      if (user.length === 0) {
        return res.status(200).json({ message: 'User not found' });
      }
      else {
        const ret = [];
  
        const promises = user[0].documents.map(async (temp) => {
          if (temp.SenderId === Id) {
            const user = await UserModel.findById(temp.RecieverId, 'FirstName LastName img');
            return { _id: temp._id, user };
          } else if (temp.RecieverId === Id) {
            const user = await UserModel.findById(temp.SenderId, 'FirstName LastName img');
            return { _id: temp._id, user };
          }
        });
  
        Promise.all(promises)
          .then((results) => {
            ret.push(...results);
            res.status(200).json(ret);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    } catch (error) {
      res.status(400).json({ message: error });
    }
  };

  module.exports = {
    CreateMessage,
    FindMessage
}