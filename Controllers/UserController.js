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
    const User = await UserModel.find({ Email: req.body.Email });
    if (User) {
      res.status(200).json(User);
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
}

const SetVerified = async (req, res) => {
  try {
    var user = await UserModel.findOneAndUpdate({ "Email": req.body.Email }, { $set: { EmailVerified: "true" } }
      , { new: true });
    res.status(200).json(user);
  } 
  catch (err) { 
    console.log('Error in setting Verified', err);
  }

}

module.exports = {
  GetUserbyId,
  GetAllUsers,
  SetVerified
}