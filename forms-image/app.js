require("dotenv").config();

const express=require("express")
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get("/myget",(req,res)=>{
    res.send(req.body)
})




module.exports=app;