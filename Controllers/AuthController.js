const User = require('../Models/UserModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = "ThisIsVidMeUser";

const UserLogin = async (Req, Res) => {
  try {
      console.log(Req.body)
      let UserFound = await User.findOne({ Email: Req.body.Email});
      if (!UserFound) {
          return Res.status(400).json({ Success: false, Message:"Enter Correct Email/Password" });
      }
      const ComparePassword = await bcrypt.compare(Req.body.Password , UserFound.Password);
      if (!ComparePassword)
      {
          return Res.status(400).json({ Success: false , Message: "Enter Correct Email/Password" });
      }

      const Data = { user: { id: UserFound.id } };
      const AuthToken = jwt.sign(Data, SECRET_KEY);

      UserFound = await User.findOne({ email: Req.body.email}).select("-password")
      console.log(
        UserFound
      )
      let ProfileStatus = UserFound.ProfileStatus 
      console.log(ProfileStatus)
      Res.json({ Success: true, AuthToken: AuthToken , Message: "User Logged In Successfully" , ProfileStatus });
  } catch (error) {
      return Res.status(400).json({ Error: "An Error Occured" , Message: "An Error Occured" ,});
  }
};

const { v4: uuidv4 } = require('uuid');
const CreateAccount = async (Req, Res) => {
    try 
    {
        const AlreadyExsists = await User.find({Email:Req.body.Email})
        if(AlreadyExsists.length > 0)
        {
            return Res.status(400).json({ Success: false , Message: "Email Already Exsists"});
        }


        const Salt = await bcrypt.genSalt(10);
        Req.body.Password = await bcrypt.hash(Req.body.Password, Salt);

        const emailBeforeAt = Req.body.Email.split('@')[0];
        const uniqueId = uuidv4();
        const userLink = `/${emailBeforeAt}-${uniqueId}`;
        
        const SaveUser = new User({
            FirstName : Req.body.FirstName,
            LastName : Req.body.LastName,
            Email: Req.body.Email,
            Password: Req.body.Password,
            Phone : Req.body.Phone,
            ProfileLink: userLink,
        })
        const AddedUser = await SaveUser.save();
        Res.status(200).send({ Success: true , 
            Message: "User Created Successfully" ,
        }); 
    } catch (error) {
        Res.status(404).json({ Error: error ,
            Message: "An Error Occured"});
    }
}

module.exports = { UserLogin , CreateAccount }
