const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const routes = require("./Routes/Config");


const app = express();
const PORT = process.env.PORT || 3001
const DATABASE_STRING = process.env.DATABASE_CONNECTION

app.use(express.json())
app.use(cors(
    {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],        
    }
));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
routes(app);  

mongoose.set('strictQuery', true);
const Database_Connection = async () => {
  try {
    await mongoose.connect(DATABASE_STRING);
    console.log("CONNECTED TO DATABASE SUCCESSFULLY 🚀🚀");
  } catch (error) {
    console.error("FAILED TO CONNECT TO DATABASE:", error.message);
  }
};
Database_Connection()

const UserInformation = require('./Models/UserInformation')
const UserModel = require('./Models/UserModel')
const PostModel = require('./Models/PostModel')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const GetToken = require('./Middleware/GetToken')

app.post('/information-step1' , GetToken , jsonParser, async (req,res) => {
  try
  {
    const User = await UserModel.findOne({ _id: req.user.id });
    if(!User)
    {
      return res.status(400).json({ Success: false , Error: "User Not Found"});
    }
    User.ProfileStatus = "33%";
    const AddedUser = await User.save();
    const SaveUserInformation = new UserInformation({
      Email: User.Email,
      WantedJob: req.body.WantedJob,
      Gender : req.body.Gender,
      DOB : req.body.DOB,
      Nationality: req.body.Nationality,
      City: req.body.City,
      Country: req.body.Country,
      ProfessionalSummary: req.body.ProfessionalSummary,
    })
    const AddedUserInformation = await SaveUserInformation.save();
    res.status(200).send({ Success: true , AddedUserInformation });
  } catch (error) {
    res.status(404).json({ Error: error });
  }
})

app.post('/information-step2' , GetToken , jsonParser, async (req,res) => {
  try
  {
    const User = await UserModel.findOne({ _id: req.user.id });
    if(!User)
    {
      return res.status(400).json({ Success: false , Error: "User Not Found"});
    }
    User.ProfileStatus = "66%";
    const AddedUser = await User.save();
    const CurrentUserInfo = await UserInformation.findOne({ Email: User.Email });
    if(!CurrentUserInfo)
    {
      return res.status(400).json({ Success: false , Error: "User Information Not Found"});
    }
    CurrentUserInfo.EmploymentHistory = req.body.EmploymentHistory;
    CurrentUserInfo.Skills = req.body.Skills;
    CurrentUserInfo.Interests = req.body.Interests;
    const AddedUserInformation = await CurrentUserInfo.save();
    res.status(200).send({ Success: true , AddedUserInformation });
  } catch (error) {
    res.status(404).json({ Error: error });
  }
})

app.post('/information-step3' , GetToken , jsonParser, async (req,res) => {
  try
  {
    const User = await UserModel.findOne({ _id: req.user.id });
    if(!User)
    {
      return res.status(400).json({ Success: false , Error: "User Not Found"});
    }
    User.ProfileStatus = "99%";
    const AddedUser = await User.save();
    const CurrentUserInfo = await UserInformation.findOne({ Email: User.Email });
    if(!CurrentUserInfo)
    {
      return res.status(400).json({ Success: false , Error: "User Information Not Found"});
    }
    CurrentUserInfo.Education = req.body.Education;
    CurrentUserInfo.Projects = req.body.Projects;
    CurrentUserInfo.Languages = req.body.Languages;
    CurrentUserInfo.SocialLinks = req.body.SocialLinks;
    const AddedUserInformation = await CurrentUserInfo.save();
    res.status(200).send({ Success: true , AddedUserInformation });
  }
  catch (error) {
    res.status(404).json({ Error: error });
  }
})



app.post('/add-video', GetToken , jsonParser, async (req,res) => {
  try
  {
    const User = await UserModel.findOne({ _id: req.user.id });
    if(!User)
    {
      return res.status(400).json({ Success: false , Error: "User Not Found"});
    }
    User.ProfileStatus = "100%";
    const AddedUser = await User.save();
    User.Video.push(req.body.Video);
    const AddedUserInformation = await User.save();
    res.status(200).send({ Success: true , AddedUserInformation });
  }
  catch (error) 
  {
    res.status(404).json({ Error: error });
  }
})


app.post('/create-post' , GetToken , jsonParser, async (req,res) => {
  try
  {
    const User = await UserModel.findOne({ _id: req.user.id });
    if(!User)
    {
      return res.status(400).json({ Success: false , Error: "User Not Found"});
    }
    const ExtractKeywords = req.body.PostText.split(" ");
    const Keywords = [];
    for (let i = 0; i < ExtractKeywords.length; i++) {
      const element = ExtractKeywords[i];
      if(element.length>4)
      {
        Keywords.push(element);
      }
    }
    const SavePost = new PostModel({
      Email: User.Email,
      UserLink: User.ProfileLink,
      PostText: req.body.PostText,
      PostImage: req.body.PostImage,
      PostVideo: req.body.PostVideo,
      Keywords: Keywords,      
  })
  const AddedPost = await SavePost.save();
  res.status(200).send({ Success: true , AddedPost });
  }
  catch (error)
  {
    res.status(404).json({ Error: error });
  }
})







app.listen( PORT , ()=> {console.log(`LISTENING AT PORT: ${PORT}`)} )
