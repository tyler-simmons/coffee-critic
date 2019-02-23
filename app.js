/*******************
Install Dependencies
*******************/
var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),			/*DEPENDENCY*/	//pull data from form in req object
	mongoose 		= require("mongoose"),				/*DEPENDENCY*/	//interact with mongo
	flash 			= require("connect-flash"),			/*DEPENDENCY*/	//flash messages for auth notification with passport
	passport 		= require("passport"),				/*DEPENDENCY*/	//user authentication (with sessions)
	LocalStrategy 	= require("passport-local"),		/*DEPENDENCY*/	//Non-db passport strategy (not in use)
	methodOverride 	= require("method-override"),		/*DEPENDENCY*/	//Allow post override to PUT | DELETE
	seedDB 			= require("./seeds");


/*************************
Import Data Models (Mongo)
*************************/
var Shop 			= require("./models/shop"),
	Comment 		= require("./models/comment"),
	User 			= require("./models/user");


/**********
Link Router
**********/
var commentRoutes 	= require("./routes/comments"),
	shopRoutes 		= require("./routes/shops"),
	indexRoutes 	= require("./routes/index");



// CONNECT MONGOOSE API TO MLAB DB SERVER
mongoose.connect("mongodb://tyler:coffeepass1@ds221115.mlab.com:21115/coffeecritic", {useNewUrlParser: true});



// SERVER CONFIG A
app.use(bodyParser.urlencoded({extended:true}));
app.set("view-engine", "ejs");
app.use(express.static(__dirname + "/public"));		//pubblic asset link - 
app.use(methodOverride("_method"));
app.use(flash());



// USER AUTHENTICATION CONFIG W/ PASSPORTJS
app.use(require("express-session")({
	secret: "Secret key used for the db passwords",
	resave: false,
	saveUninitialized: false
}));



// SERVER CONFIG DEPENDENT ON A || PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
//seedDB();


// CONNECT ROUTES
app.use("/", indexRoutes);
app.use("/shops", shopRoutes);
app.use("/shops/:id/comments", commentRoutes);



// BUILD FOR DEPLOYMENT ON HEROKU TEST SERVER -- USE PROCESS ENVIRONMENT VARIABLES TO LISTEN
// app.listen(process.env.PORT, process.env.IP, function(){
// 	console.log("Server started successfully");
// });



//Listen for requests on local machine
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Server running on local machine");
});

//local debug

/********************************************
 *											*
 *			Section Heading					*
 *											*
 ******************************************	*/






