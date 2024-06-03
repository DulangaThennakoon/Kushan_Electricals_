const e = require('express');
const {sign, verify} = require('jsonwebtoken');

const createOwnerToken = (ownerID,role='owner') => {
    const accessToken = sign({ownerID,role},"SUPER_SECRET_JWT_KEY_FOR_OWNER", {expiresIn: "10h"});
    return accessToken;	
};

const validateOwnerToken = (req, res, next) => {
    const accessToken = req.headers["x-access-token"]
    console.log(accessToken);
    if (!accessToken) {
        console.log("User not authenticated");
        return res.status(402).json({status:402,message: "User not authenticated"});
    }
    try {
        const validToken = verify(accessToken,"SUPER_SECRET_JWT_KEY_FOR_OWNER")
        if (validToken && validToken.role === "owner") {
            req.authenticated = true;
            req.ownerID = validToken.ownerID;
            req.role = validToken.role;
            console.log("User authenticated");
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

module.exports = {createOwnerToken, validateOwnerToken};