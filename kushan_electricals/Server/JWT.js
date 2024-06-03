const e = require('express');
const {sign, verify} = require('jsonwebtoken');

const createToken = (userID) => {
    const accessToken = sign({userID},"JWT_SECRET_KEY", {expiresIn: "5h"});
    return accessToken;	
};

const validateToken = (req, res, next) => {
    const accessToken = req.headers["x-access-token"]
    if (!accessToken) {
        console.log("User not authenticated");
        return res.status(402).json({status:402,message: "User not authenticated"});
    }
    try {
        const validToken = verify(accessToken,"JWT_SECRET_KEY")
        if (validToken) {
            req.authenticated = true;
            req.customerID = validToken.userID.customerID;
            return next();
        }else{
            console.log("User not authenticated");
            return res.status(402).json({status:402,message: "User not authenticated"});
        }
    }catch(err) {
        console.log(err);
        return res.status(402).json({status:402,message: "JWT ERROR",err});
    }   

  };

module.exports = {createToken, validateToken};