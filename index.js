const express = require("express")
const app = express()
const ejs = require("ejs")
let PORT = 3000;

const mongoose = require("mongoose")

app.use(express.static('public'))

app.set("view engine", "ejs")

// Mongoose 
let URI = "mongodb+srv://Deunique:movic12@cluster0.p7advyl.mongodb.net/May_db?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(URI).then(()=>{
    console.log("Database connected");
}).catch((error)=>{
    console.log("database error");
    console.log(error);
})


const userSchema = mongoose.Schema({
    firstName: { type: String, required:true},
    lastName : {type:String, required:true},
    password : {type:String, required:true},
    email : {type:String, unique:true},
})

let userModel = mongoose.model("User", userSchema)

// Register Form
app.use(express.urlencoded({extended:true}))

app.post('/registerForm', async (req, res)=>{
  try{
    console.log(req.body);
    let user = new userModel(req.body)
    await user.save()
   console.log("user saved");
   res.redirect('/sign')
   }catch(err){
    console.log(err.message);
    console.log("user not saved");
   }
})
// Login From
app.post('/signForm', async (req,res)=>{
    console.log(req.body);
    userModel.findOne({email:req.body.email})
    .then((result)=>{
        console.log(result);
        result.password == req.body.password ? res.redirect('/dashboard') : res.send('invalid password')
    })
    .catch((error)=>{
        console.log(error);
    })
    // try{
    //     const {email, password} = req.body;
    //     const user = await userModel.find({email: email, password: password})
    //     res.redirect("/dashboard")
    // }.catch(err){
    //     console.log(err);
    // }
})

app.get('/ejs',(req, res)=>{
   res.render('index', {name:'movic'})
})
app.get('/register',(req, res)=>{
    res.render('register')
})
app.get('/sign',(req, res)=>{
    res.render('sign')
})
// Dashboard
app.get('/dashboard',(req, res)=>{
    userModel.find().then((data)=>{
        res.render('dashboard',(data))
    }).catch((err)=>{
        console.log(err);
    })
})

app.get('/',(req, res)=>{ 
    res.sendFile(__dirname + "/index.html")

})

app.listen(PORT,()=>{
    console.log("izz Working");
})
