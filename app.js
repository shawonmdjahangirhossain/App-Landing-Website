// if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config();
// }
const express = require('express');
const bodyParser = require("body-parser");
const passport = require("passport");
const bcrypt =require("bcryptjs");
const flash = require("express-flash");
const session = require("express-session");
const override = require("method-override");
const app = express();
app.use(express.static("public"));

const passportInitialize = require("./passport-config");
passportInitialize(passport,
     email => user_details.find(user => email === user.email),
      id => user_details.find(user => id === user.id));

app.use(flash());
app.use(session({
    secret: process.env.SECRETE_SESSION,
    save: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const user_details = [];

app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine","ejs");
app.use(override("_method"));

app.get("/",(req,res)=>{
    res.render("index");
});
app.get("/about",(req,res)=>{
    res.render("about");
});
app.get("/pricing",(req,res)=>{
    res.render("pricing");
});
app.get("/team",(req,res)=>{
    res.render("team");
});
app.get("/blog",(req,res)=>{
    res.render("blog");
});
app.get("/blog-home",(req,res)=>{
    res.render("blog-home");
});
app.get("/admin",(req,res)=>{
    res.render("admin");
});
app.get("/contact",(req,res)=>{
    res.render("contact");
});
app.get("/adminblog",(req,res)=>{
    res.render("adminblog");
});


app.get("/admin",checkNotAuth, (req,res)=>{
    res.render("admin");
});

app.get("/registration",checkNotAuth,(req,res)=>{
    res.render("registration");
});

app.get("/user",checkAuth,(req, res)=>{
    res.render("user", {user_details: user_details});
});

app.post("/admin",checkNotAuth, passport.authenticate("local",{
    successRedirect: "/user",
    failureRedirect: "/admin",
    failureFlash: true
}));

app.delete("/logout",(req, res)=>{
    req.logout();
    res.redirect('/admin');
});

app.post("/registration",checkNotAuth, async (req,res)=>{
    try {
        const hashPass = await bcrypt.hash(req.body.password, 10);
        user_details.push({
            id: Date.now().toString(),
            name: req.body.name,
            title: req.body.title,
            email: req.body.email,
            password:hashPass
        });
        res.redirect("/user");
    } catch (error) {
        res.redirect("/registration");
    }
    console.log(user_details);
    
});

function checkAuth(req, res, next) {  
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/admin');
}

function checkNotAuth(req, res, next) {  
    if(req.isAuthenticated()){
        return res.redirect('/user');
    }
    next();
}



// app.set('port',(process.env.PORT || 7000));
// app.use(bodyParser.json());
// const path = require('path');

// const db = require("./db");
// const collection = "blog";

// app.get('/',(req,res) => {
//     res.sendFile(path.join(__dirname,'bl.html'));
// });

// app.get('/getblog',(req,res) => {
//     db.getDB().collection(collection).find({}).toArray((err,documents) => {
//         if(err)
//           console.log(err);
//         else{
//             console.log(documents);
//             res.json(documents);
//         }  
//     });
// });

// app.put('/:id',(req,res) => {

//     const blogID = req.params.id;
//     const userInput = req.body;

//     db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(blogID)},{$set :{blog : userInput.blog}},{returnOrginal : false},(err,result) =>{
//         if(err)
//             console.log(err);
//         else
//             res.json(result);    
//     });

// });

// app.post('/',(req,res)=>{
//     const userInput = req.body;
//     db.getDB().collection(collection).insertOne(userInput,(err,result) =>{
//         if(err)
//            console.log(err);
//         else
//            res.json({result : result, document : result.ops[0]});   
//     });
// });

// app.delete('/:id',(req,res)=>{

//     const blogID = req.params.id;
//     db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(blogID)},(err,result) => {
//         if(err)
//            console.log(err);
//         else
//            res.json(result);   
//     });

// });



// db.connect((err) => {
//     if(err){
//         console.log('unable to connect to database');
//         process.exit(1);
//     }
//     else{
//         app.listen(7000,() => {
//             console.log('connected to database, app listening on port 7000');
//         });
        
//     }
// })


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);