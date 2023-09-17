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
const Conversation = require('./Models/Conversation');
const Message = require("./Models/Message");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const GetToken = require('./Middleware/GetToken')

const io = require("socket.io")(5050, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];
io.on("connection", (socket) => {
  socket.on('addUser', userId => {
    const Exists = users.some(user => user.userId === userId);
    if (!Exists) {
      users.push({ id: socket.id, userId: userId });
      io.emit('getUsers', users);
    }
  });

  //send and get message
  socket.on('sendMessage', ({ MessageId, SenderId, text, Reciever }) => {
    const user = users.find(user => user.userId === Reciever);
    if (user) {
      io.to(user.id).emit('getMessage', {
        MessageId,
        SenderId,
        text,
        Reciever
      });
    }
  });

  //disconnect
  socket.on('disconnect', () => {
    users = users.filter(user => user.id !== socket.id);
    io.emit('getUsers', users);
  });
});

app.post('/api/seeker/profile', GetToken, jsonParser, async (req, res) => {
  try {
    const User = await UserModel.findOne({ _id: req.user.id });
    
    if (!User) {
      return res.status(400).json({ Success: false, Error: "User Not Found" });
    }

    User.ProfileStatus = "33%";
    await User.save();

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
    console.log(req.body)
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

app.post('/api/seeker/profile/personal' , GetToken , jsonParser, async (req,res) => {
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
    CurrentUserInfo.Certifications = req.body.Certifications;
    const AddedUserInformation = await CurrentUserInfo.save();
    res.status(200).send({ Success: true , AddedUserInformation });
  }
  catch (error) {
    res.status(404).json({ Error: error });
  }
})

app.use(bodyParser.json({ limit: '1000mb' })); // Adjust the limit to your needs
app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb' })); 



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

    
const nlp = require('compromise');
nlp.extend(require('compromise-numbers'));

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
    
//----------------------------------------------------------------------------------//
app.post('/api/initiate', async (req, res) => {
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
});

app.post('/api/FindConnection', async (req, res) => {
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
});

app.post('/api/Conversation', async (req, res) => {
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
});

// Write api to get Conversation based on MessageId
app.post('/api/FindConversation', async (req, res) => {
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
});

app.post('/api/FindUser', async (req, res) => {
  try {
    const User = await UserModel.findById(req.body.Id);
    if (User) {
      res.status(200).json(User);
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

app.post('/api/FindUserInfo', async (req, res) => {
  try {
    const User = await UserModel.find({Email: req.body.Email});
    if (User) {
      res.status(200).json(User);
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
});





app.listen( PORT , ()=> {console.log(`LISTENING AT PORT: ${PORT}`)} )
