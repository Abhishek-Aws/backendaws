const Order = require("../models/order");
const User = require("../models/user");

// exports.getUserById = (req, res, next, id) =>{
//     User.findById(id).exec((err, user) =>{
//         if(err || !user) {
//             return res.status(400).json({
//                 error:"No user was found in DB"
//             });
//         }
//         req.profile = user;
//         next();
//     });
// };

exports.getUserById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(400).json({
        error: "No user was found in DB",
      });
    }
    req.profile = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.phoneno = undefined;
  req.profile.address1 = undefined;
  req.profile.address2 = undefined;
  req.profile.city = undefined;
  req.profile.pincode = undefined;
  return res.json(req.profile);
};

// exports.getAllUsers = (req, res) =>{
//     User.find().exec((err, users) =>{
//         if(err || !users){
//             return res.status(400).json({
//                 error: "No users found"
//             });
//         }
//         res.json(users);
//     })
// }

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().exec();
    if (!users || users.length === 0) {
      return res.status(400).json({
        error: "No users found",
      });
    }
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

//   exports.updateUser = (req, res) => {
//         User.findByIdAndUpdate(
//             {_id: req.profile._id},
//             { $set: req.body },
//             { new: true, useFindAndModify: false},
//             (err, user) => {
//                 if(err){
//                     return res.status(400).json({
//                         error: "You are not authorize to update this user"
//                     });
//                 }
//                 user.salt = undefined;
//                user.encry_password = undefined;
//                res.json(user);
//             }
//         )
//   }

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.profile._id,
      { $set: req.body },
      { new: true, useFindAndModify: false }
    ).exec();

    if (!updatedUser) {
      return res.status(400).json({
        error: "You are not authorized to update this user",
      });
    }

    updatedUser.salt = undefined;
    updatedUser.encry_password = undefined;
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// exports.userPurchaseList = (req, res) => {
//     Order.find({user: req.profile._id})
//     .populate("user", "_id name")
//     .exec((err, order) => {
//         if(err){
//             return res.status(400).json({
//                 error: "Sorry! You don't have any order in your cart"
//             })
//         }
//         return res.json(order)
//     })
// }

exports.userPurchaseList = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.profile._id })
      .populate("user", "_id name")
      .exec();

    if (!orders || orders.length === 0) {
      return res.status(400).json({
        error: "Sorry! You don't have any order in your cart",
      });
    }

    return res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// exports.pushOrderInPurchaseList = (req, res, next) => {
//   let purchases = [];
//   req.body.order.products.forEach((product) => {
//     purchases.push({
//       _id: product._id,
//       name: product.name,
//       description: product.description,
//       category: product.category,
//       quantity: product.quantity,
//       amount: req.body.order.ammount,
//       transaction_id: req.body.order.transaction_id,
//     });
//   });

//   //store this in DB

//   User.findOneAndUpdate(
//     { _id: req.profile._id },
//     { $push: { purchases: purchases } },
//     { new: true },
//     (err, purchases) => {
//       if (err) {
//         return res.status(400).json({
//           error: "Unable to save purchases list",
//         });
//       }
//       next();
//     }
//   );
  
// };


exports.pushOrderInPurchaseList = async (req, res, next) => {
    try {
      const purchases = req.body.order.products.map((product) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        category: product.category,
        quantity: product.quantity,
        amount: req.body.order.amount, // Fixed typo in 'amount' field
        transaction_id: req.body.order.transaction_id,
      }));
  
      // Store this in the DB
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { purchases: purchases } },
        { new: true }
      ).exec();
  
      if (!updatedUser) {
        return res.status(400).json({
          error: "Unable to save purchases list",
        });
      }
  
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  };
  