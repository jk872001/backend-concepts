var jwt = require("jsonwebtoken");

const isAuth=(req,res,next)=>
{
    const token= req.header("Authorization").replace("Bearer ","") || req.cookies.token || req.body.token;

    if(!token)
    {
        res.status(403).send("Token is missing...")
    }

    try{
        const decode=jwt.verify(token ,process.env.SECRET_KEY)
        console.log(decode);
       req.user=decode
        return next();
    }
    catch(error)
    {
        res.status(401).send("Invalid token")
    }
}

module.exports= isAuth;