/**
|--------------------------------------------------
| Install Dependencies
|--------------------------------------------------
*/
var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),			/*DEPENDENCY*/	//pull data from form in req object
	mongoose 		= require("mongoose"),				/*DEPENDENCY*/	//interact with mongo
	flash 			= require("connect-flash"),			/*DEPENDENCY*/	//flash messages for auth notification with passport
	passport 		= require("passport"),				/*DEPENDENCY*/	//user authentication (with sessions)
	LocalStrategy 	= require("passport-local"),		/*DEPENDENCY*/	//Non-db passport strategy (not in use)
	methodOverride 	= require("method-override"),		/*DEPENDENCY*/	//Allow post override to PUT | DELETE
	dotenv			= require('dotenv');
	port			= process.env.PORT || 3000;


dotenv.config();


/**
|--------------------------------------------------
| Import mongo data models
|--------------------------------------------------
*/
var Shop 			= require("./models/shop"),
	Comment 		= require("./models/comment"),
	User 			= require("./models/user");


/**
|--------------------------------------------------
| Link router middlewares
|--------------------------------------------------
*/
var commentRoutes 	= require("./routes/comments"),
	shopRoutes 		= require("./routes/shops"),
	indexRoutes 	= require("./routes/index"),
	APIRoutes		= require("./routes/api.js"),
	userRoutes		= require("./routes/user.js");



// CONNECT MONGOOSE API TO MLAB DB SERVER
mongoose.connect(process.env.MONGOOSE_URI, {useNewUrlParser: true}, function(err) {
	if (!err) {
		console.log('mongoose connected');
	}
});



/**
|--------------------------------------------------
| Server utility config + static file config
|--------------------------------------------------
*/
app.use(bodyParser.urlencoded({extended:true}));
app.set("view-engine", "ejs");
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method"));
app.use(flash());



/**
|--------------------------------------------------
| Setup for passport authentication middleware
|--------------------------------------------------
*/
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		url: process.env.MONGO_STORE_URI,
	})
}))

// app.use(require("express-session")({
// 	secret: "Secret key used for the db passwords",
// 	resave: false,
// 	saveUninitialized: false
// }));



/**
|--------------------------------------------------
| Authentication with passport setup & initialization
|--------------------------------------------------
*/
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Setup 'user' to be passed through to template engine
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});



/**
|--------------------------------------------------
| Connect express routers 
|--------------------------------------------------
*/
app.use("/", indexRoutes);
app.use("/shops", shopRoutes);
app.use("/shops/:id/comments", commentRoutes);
app.use("/api", APIRoutes);
app.use("/user", userRoutes);


//Listen for requests on local machine
app.listen(port, process.env.IP, function(){
	console.log("Server running on local machine");
});








