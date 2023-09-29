const User = require('../models/userModels');

exports.getAllUser = async function(req, res, next){
    try {
          const getAllUser = await User.find();

          res.status(200).json({
          status: "Success",
          AllUser: getAllUser.length,
          data: {
             users: getAllUser
           }
        })
    } catch(error){
        return next(res.status(401).send(error.message));
    }
};


exports.getAUser = async function(req, res, next){
    try {
          const getAUser = await User.findById(req.params.id);
          console.log(getAUser);

          res.status(200).json({
          status: "Success",
          data: {
             getAUser
           }
        })
          
    } catch(error){
        return next(res.status(401).send(error.message));
    }
};