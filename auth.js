const User = require("../models/user")
const { check, validationResult  } = require('express-validator'); 

var jwt = require('jsonwebtoken');
// const expressJwt = require('express-jwt');

var { expressjwt: expressJwt } = require("express-jwt");



// exports.signup = (req, res) =>{
//    const user = new User(req.body)
//    user.save((err, user) => {

//     if(err){
//         return res.status(400).json({
//             err: "Not able to save user in DB"
//         })
//     }
//     res.json(user);
//    })
// };

exports.signup = async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(422).json({
                error: errors.array()[0].msg
            })
        }
      const user = new User(req.body);
      const savedUser = await user.save();
      res.json({
        name: savedUser.name,
        email: savedUser.email,
        id: savedUser._id
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        error: "Not able to save user in DB",
      });
    }
  };

  exports.signin = (req, res) =>{
    const {email, password} = req.body;
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

//     User.findOne({email}, (err, user) => {
//         if(err){
//             res.status(400).json({
//                 error: "User email does not exists"
//             })
//         }
//         if(!user.authenticate(password)){
//            return  res.status(401).json({
//                 error: "Email or password do not match"
//             })
//         }
//         //create token
//         const token = jwt.sign({_id: user._id}, process.env.SECRET)

//         //put token in cookie
//         res.cookie("token", token, {expire: new Date() + 9999});

//         //send response to front end
//         const {_id, name, email, role} = user;
//         return res.json({token, user: { _id, name, email, role } })
//     });
//   };


User.findOne({ email })
  .then(user => {
    if (!user) {
      return res.status(400).json({
        error: "User email does not exist",
      });
    }
    
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email or password do not match",
      });
    }

    // Create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    // Put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // Send response to front end
    const { _id, name, email, role } = user;
    res.json({ token, user: { _id, name, email, role } });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({
      error: "Internal server error",
    });
  });
}



exports.signout = (req, res) =>{
    res.clearCookie("token")
    res.json({
        message: "User Signout successfully"
    });
};


// exports.isSignedIn = expressJwt({
//     secret: process.env.SECRET,
//     userProperty: "auth"
// })

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'], // Specify the algorithm (e.g., HS256) used to sign the JWT
    userProperty: "auth", // Property to store user data in the request object
  });

  //custom middlewares 
  exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
      return res.status(403).json({
        error: "ACCESS DENIED"
      });
    }
    next();
  };

  exports.isAdmin = (req, res, next) => {
    if( req.profile.role === 0){
      return res.status(403).json({
        error: "You are not an ADMIN, Access denied"
      });
    }
    next();
  };