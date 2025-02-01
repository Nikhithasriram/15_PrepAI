import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken"
const validate = asyncHandler(async(req,res,next)=>{
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decoded)=>{
            if(err){
                res.status(401);
                throw new Error("User is not Authorized");
            }
            console.log("this is here" , decoded.user);
            req.user = decoded.user;
            next();
        })
    }
    if(!token){
        res.status(401);
        throw new Error("user not authorized or no token provided");
    }
})

export default validate