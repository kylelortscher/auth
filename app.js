var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require("./models/user");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");


mongoose.connect("mongodb://localhost/auth_demo_app");


var app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: "I am amazing",
    resave: false,
    saveUninitialized: false
}));


app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


///////////////////////////////////
//Routes
//////////////////////////////////

app.get("/", function(req, res){
   res.render("home"); 
});


//==============================
//LOGIN PROTECTED WEBSITE
//==============================
app.get("/secret",isLoggedIn, function(req, res){
   res.render("secret"); 
});

//======================================
//MIDDLEWARE TO LOGIN PROTECT WEBSITES
//======================================
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next;
    }
    res.redirect("/login");
}

//=============================
//AUTH REGISTER
//=============================
//Display Register Form
app.get("/register", function(req, res) {
   res.render("register")
});

//Register Logic When There Is A Post Request Hit To /Register The Code Inside The Function Is Ran
app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render('register');
       } 
       passport.authenticate("local")(req, res, function(){
          res.redirect("/secret"); 
       });
    });
});

//===============================
//AUTH LOGIN
//===============================
app.get("/login", function(req, res){
   res.render("login"); 
});

app.post("/login",passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
});


//=================================
//AUTH LOGOUT
//=================================
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});


//=================================
//FOR CLOUD9 PREVIEW
//=================================
app.listen(process.env.PORT, function(){
    console.log("App has started!!!");
});