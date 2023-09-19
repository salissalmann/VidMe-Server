const UserModel = require("../Models/UserModel")

const GetUserbyId = async (req, res) => {
    try {
      const User = await UserModel.findById(req.body.Id);
      if (User) {
        res.status(200).json(User);
      }
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
  
const GetAllUsers = async (req, res) => {
    try {
      const User = await UserModel.find({Email: req.body.Email});
      if (User) {
        res.status(200).json(User);
      }
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  module.exports = {
    GetUserbyId,
    GetAllUsers
}