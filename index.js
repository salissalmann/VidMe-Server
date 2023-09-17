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
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true, limit: '1000mb' }));
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

app.post('/api/seeker/profile', GetToken, jsonParser, async (req, res) => {
  try {
    const User = await UserModel.findOne({ _id: req.user.id });
    
    if (!User) {
      return res.status(400).json({ Success: false, Error: "User Not Found" });
    }
    const filter = { Email: User.Email };
    const update = {  
      Email: User.Email,
      WantedJob: req.body.WantedJob,
      Gender: req.body.Gender,
      DOB: req.body.DOB,
      Nationality: req.body.Nationality,
      City: req.body.City,
      Country: req.body.Country,
      ProfessionalSummary: req.body.ProfessionalSummary,
    };

    const options = {
      upsert: true,
      new: true, 
    };

    const updatedUserInformation = await UserInformation.findOneAndUpdate(filter, update, options);
    User.ProfileStatus = "33%";
    console.log( req.body.ProfilePicture)
    User.ProfilePicture = req.body.ProfilePicture,

    await User.save();

    if (updatedUserInformation) {
      console.log(updatedUserInformation);
      return res.status(200).json({ Success: true, Message: "User Information Updated Successfully" });
    }

    const SaveUserInformation = new UserInformation(update);
    const addedUserInformation = await SaveUserInformation.save();
    
    res.status(200).json({ Success: true, AddedUserInformation: addedUserInformation });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ Error: 'An error occurred' });
  }
});


app.post('/api/seeker/profile/professional' , GetToken , jsonParser, async (req,res) => {
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

const nlp = require('compromise');
nlp.extend(require('compromise-numbers'));

app.post('/api/seeker/profile/personal', GetToken, jsonParser, async (req, res) => {
  try {
    const User = await UserModel.findOne({ _id: req.user.id });

    if (!User) {
      return res.status(400).json({ Success: false, Error: "User Not Found" });
    }

       
    const CurrentUserInfo = await UserInformation.findOne({ Email: User.Email });
    if (!CurrentUserInfo) {
      return res.status(400).json({ Success: false, Error: "User Information Not Found" });
    }
    CurrentUserInfo.Projects = req.body.Projects;
    CurrentUserInfo.Education = req.body.Education;
    CurrentUserInfo.Certifications = req.body.Certifications;
    CurrentUserInfo.Languages = req.body.Languages;

    const AddedUserInformation = await CurrentUserInfo.save();    

    const fieldKeywords = [
      CurrentUserInfo.WantedJob,
      CurrentUserInfo.ProfessionalSummary,
    ];


    for (const employment of CurrentUserInfo.EmploymentHistory) {
      fieldKeywords.push(employment.jobTitle, employment.employer, employment.description);
    }

    for (const education of CurrentUserInfo.Education) {
      fieldKeywords.push(education.institution, education.description);
    }

    for (const project of CurrentUserInfo.Projects) {
      fieldKeywords.push(project.ProjectTitle, project.description);
    }

    for ( const skill of CurrentUserInfo.Skills)
    {
      fieldKeywords.push(skill)
    }

    for ( const interest of CurrentUserInfo.Interests)
    {
      fieldKeywords.push(interest)
    }

    for ( const lang of CurrentUserInfo.Languages)
    {
      fieldKeywords.push(lang)
    }

    for ( const cert of CurrentUserInfo.Certifications)
    {
      fieldKeywords.push(cert.Certification)
    }

    fieldKeywords.push(
      CurrentUserInfo.Nationality
    );

  const keywords = fieldKeywords
    .flatMap((field) => {
      const doc = nlp(field);
      const nouns = doc.nouns().out('array');
      const adjectives = doc.adjectives().out('array').filter((adj) => adj.toLowerCase() !== 'working');
      return [...nouns, ...adjectives];
    })
    .map((word) => word.toLowerCase())
    .filter((keyword) => keyword.length >= 3);

    let Keywords = []
    Keywords.push(
      ...keywords
     ) 

        console.log(
      "Keywords:",
      Keywords
    )


    User.Keywords = keywords;

    User.ProfileStatus = "99%";
    await User.save();

    res.status(200).send({ Success: true, AddedUserInformation });
  } catch (error) {
    res.status(404).json({ Error: error });
  }
});




app.post('/api/seeker/profile/video', GetToken , jsonParser, async (req,res) => {
  try
  {
    const User = await UserModel.findOne({ _id: req.user.id });
    if(!User)
    {
      return res.status(400).json({ Success: false , Error: "User Not Found"});
    }
    User.ProfileStatus = "100%";
    User.Video = "https://premedpk-cdn.sgp1.cdn.digitaloceanspaces.com/Videos/00e7060f-ed0e-41b8-8f5f-c0d94eaedc6c.mp4"    
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

    const PostText = req.body.PostText;
    const doc = nlp(PostText);
        
    const keywords = doc
        .nouns()
        .concat(doc.adjectives().filter(adj => adj.text() !== 'working'))
        .out('array')
        .map(word => word.toLowerCase()); 

    let Keywords = []
    Keywords.push(
      ...keywords
    ) 
    Keywords = Keywords.filter(keyword => keyword.length >= 3);
    

    const Link = "https://premedpk-cdn.sgp1.digitaloceanspaces.com/Notes/58b112b9-23dd-49f9-a41c-8d6bc4ea3f91.png"

    let Attachments = []
    Attachments.push(
        Link
    )
    if(req.body.Attachments)
    {
      Attachments = req.body.Attachments;
    }

    const SavePost = new PostModel({
      Email: User.Email,
      UserLink: User.ProfileLink,
      PostText: req.body.PostText,
      Attachments: Attachments,
      Keywords: Keywords,
  })
  const AddedPost = await SavePost.save();
  res.status(200).send({ Success: true, Message:"Post Created Successfully" });
  }
  catch (error)
  {
    res.status(404).json({ Error: error , Success: false, Message: "Post Creation Failed"});
  }
})

app.post('/PayViahectofinancial' , async (req,res)=>{
  try
  {
    const [CardNumber , ExpireDate , CVC] = req.body()
    const Response = await fetch("https://tbezauth.settlebank.co.kr/js/SettlePay.js/card/main.do",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CardNumber: CardNumber,
        ExpireDate: ExpireDate,
        CVC: CVC,
      }),
    })
    const ResponseJson = await Response.json()
    res.status(200).send({ Success: true , ResponseJson })
  }
  catch (error)
  {
    res.status(404).json({ Error: error , Success: false, Message: "Payment Failed"});
  }
})
    






app.listen( PORT , ()=> {console.log(`LISTENING AT PORT: ${PORT}`)} )
