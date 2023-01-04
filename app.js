
let express=require("express");

const app=express();
const port=process.env.PORT || 3000;
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });

let bodyParser=require("body-parser");
var _ = require('lodash');
const mongoose=require('mongoose');
const session = require('express-session');
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
var fs = require('fs');
var path = require('path');
require('dotenv').config()

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public/'));

app.use(session({
  secret:"There is no secret",
  resave:false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb+srv://oyeghumnechal:theyashhanda@cluster0.jmmihit.mongodb.net/OyeGhumneChal');

const userschema= new mongoose.Schema ({
  firstname: String,
  lastname:String,
  address: String,
  email:String,
  number:String,
  password: String,
  avatar: String,
  confirmpassword: String,
  question: String
});

userschema.plugin(passportLocalMongoose);

const User=new mongoose.model("User",userschema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var multer = require('multer');

var storage = multer.diskStorage({
    destination:"./public/uploads/",
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  var upload = multer({ storage: storage }).array('file',5);

var booktours = new mongoose.Schema({
    tripname: String,
    triptype: String,
    checkname: String,
    price: String,
    cutprice:String,
    location: String,
    temperature: String,
    height: String,
    distance: String,
    days: String,
    trippoint: String,
    overview: String,
    itinerary1: String,
    itinerary2: String,
    itinerary3: String,
    itinerary4: String,
    itinerary5: String,
    itinerary6: String,
    detailitineraryhead1: String,
    detailitinerarydesc1: String,
    detailitineraryhead2: String,
    detailitinerarydesc2: String,
    detailitineraryhead3: String,
    detailitinerarydesc3: String,
    detailitineraryhead4: String,
    detailitinerarydesc4: String,
    inclusion1: String,
    inclusion2: String,
    inclusion3: String,
    inclusion4: String,
    inclusion5: String,
    inclusion6: String,
    inclusion7: String,
    exclusion1: String,
    exclusion2: String,
    exclusion3: String,
    exclusion4: String,
    exclusion5: String,
    toc1: String,
    toc2: String,
    toc3: String,
    toc4: String,
    toc5: String,
    toc6: String,
    toc7: String,
    image1: String,
    image2: String,
    image3: String,
    image4: String,
    image5: String,
    check: String,
    locate: String,
    whatsapp: String,
    upcomment: String,
    downcomment: String
});



const Trip=mongoose.model('Trip',booktours);

var messages = new mongoose.Schema({
  name: String,
  email: String,
  phonenumber: String,
  message:String
});

const Message=mongoose.model('Message',messages);

var bookings = new mongoose.Schema({
  name: String,
  email: String,
  tour: String,
  comment:String,
  booking:String
});

const Booking=mongoose.model('Booking',bookings);

var reviews = new mongoose.Schema({
  name: String,
  review: String,
  image: String
});

const Review=mongoose.model('Review',reviews);


app.get('/signup',function(req,res){
  if(req.isAuthenticated()){
    res.render("signup", { status:"Hi,"+req.user.firstname,status2:"My Bookings",status3:"Sign Out",message:"" });

  }
  else{
   res.render("signup", { status:"Log In",status2:"",status3:"Sign In",message:"" });
  }
});
app.get('/My%20Bookings',function(req,res){
  if(req.isAuthenticated()){
    Booking.find({email:req.user.username}, (err, items3) => {
      res.render("bookings", { status:"Hi,"+req.user.firstname,status2:"My Bookings",status3:"Sign Out",items:items3,name:req.user.firstname,email:req.user.username });
      });
  }
  else{
   res.redirect("Sign%20In");
  }

});

app.get('/changepassword',function(req,res){

    res.redirect("Sign%20In");

});
app.post('/changepassword',upload, (req, res) => {
  if(req.body.newpassword!=req.body.confirmpassword){
   res.render("changepassword", { status:"Log In",status2:"",status3:"Sign In",message:"passwords are not matching, go back and try again",email:"" });
  }
  else{

    User.find({ username: req.body.username}, function (err, items) {
      items.forEach((docs) => {
    if (err){
        console.log(err);
    }
    else{
      const firstname=docs.firstname;
      const lastname=docs.lastname;
      const address=docs.address;
      const email=docs.username;
      const password=docs.password;
      const number=docs.number;
      const avatar=docs.avatar;
      const confirmpassword=docs.confirmpassword;
      const question=docs.question;
      User.deleteOne({ username:docs.username }, function (err) {
  if (err) return handleError(err);
  // deleted at most one tank document
res.render("confirmpassword", { status:"Log In",status2:"",status3:"Sign In",message:"",firstname:firstname,lastname:lastname,address:address,username:email,number:number,password:req.body.newpassword,confirmpassword:req.body.confirmpassword,question:question });
});

    }

    });
    });



    }

});


app.get('/confirmpassword',function(req,res){

    res.render("confirmpassword", { status:"Log In",status2:"",status3:"Sign In",message:"",fullname:"",address:"",username:"",number:"",password:"",confirmpassword:"",question:"" });

});
app.post('/confirmpassword',upload, (req, res) => {

  User.register({username:req.body.username,firstname:req.body.firstname,lastname:req.body.lastname,number:req.body.number,address:req.body.address,avatar:req.body.gender,password:req.body.password,confirmpassword:req.body.confirmpassword,question:req.body.question}, req.body.password,function(err, user){


    if(err){
      console.log(err);
      res.render("signup", { status:"Log In",status2:"",status3:"Sign In",message:"Email address already exist" });
    }
    else{
      passport.authenticate("local")(req,res, function(){
      res.redirect("/");
      });
    }
  });

});

app.get('/forgotpassword',function(req,res){

    res.render("forgot", { status:"Log In",status2:"",status3:"Sign In",message:"" });

});
app.post('/forgotpassword',upload, (req, res) => {


  User.find({username:req.body.username}, (err, items2) => {
    if(items2.length){
      items2.forEach((item) => {

              if (item.username===req.body.username){
           if(item.question!=req.body.security){

             res.render("forgot", { status:"Log In",status2:"",status3:"Sign In",message:"Wrong answer for security question" });

           }
           else{
              res.render("changepassword", { status:"Log In",status2:"",status3:"Sign In",message:"",email:req.body.username });
           }
            }
          });
    }
else{
   res.render("forgot", { status:"Log In",status2:"",status3:"Sign In",message:"Wrong Email address" });
}


    });



});

app.post('/reviews',upload, (req, res) => {

  if(req.isAuthenticated()){
    var obj =new Review ({
      name: req.user.firstname+" "+req.user.lastname,
      review: req.body.review,
      image: req.user.avatar
     });
   obj.save();
   res.redirect("/");
  }
  else{
  res.redirect("/Sign%20In");
  }

});
app.post('/signup', (req, res) => {

  User.find({username:req.body.username}, (err, items2) => {

      if (!items2.username) {

         if (req.body.password!=req.body.confirmpassword) {
           res.render("signup", { status:"Log In",status2:"",status3:"Sign In",message:"passwords are not matching" });

         }
        else{



        User.register({username:req.body.username,number:req.body.number,firstname:req.body.firstname,lastname:req.body.lastname,address:req.body.address,avatar:req.body.gender,password:req.body.password,confirmpassword:req.body.confirmpassword,question:req.body.question}, req.body.password,function(err, user){


          if(err){
            console.log(err);
            res.render("signup", { status:"Log In",status2:"",status3:"Sign In",message:"Email address already exist" });
          }
          else{
            passport.authenticate("local")(req,res, function(){
            res.redirect("/");
            });
          }
        });



      }



      }
      else{
        res.render("signup", { status:"Log In",status2:"",status3:"Sign In",message:"Email address already exist" });
      }

    });


});
app.post('/SignIn', (req, res) => {

User.find({username:req.body.username}, (err, items2) => {
  if(items2.length){
    items2.forEach((item) => {

          if (item.username===req.body.username){
       if(item.password!=req.body.password){

         res.render("login", { status:"Log In",status2:"",status3:"Sign In",message:"Wrong Password" });

       }
       else{
         const user= new User({
           username: req.body.username,
           passwword: req.body.password
         });
         req.login(user,function(err){
           if(err){
             res.render("login", { status:"Log In",status2:"",status3:"Sign In",message:"Wrong Email or Password" });
           }
           else{

             passport.authenticate("local")(req,res, function(){
             res.redirect("/");
             });
           }
         });
       }
        }
      });
}
else{
  res.render("login", { status:"Log In",status2:"",status3:"Sign In",message:"Wrong Email address" });
}

  });


});

app.get('/Sign%20In',function(req,res){
  if(req.isAuthenticated()){
    res.render("login", { status:"Hi," + req.user.firstname,status2:"My Bookings",status3:"Sign Out",message:"" });

  }
  else{
   res.render("login", { status:"Log In",status2:"",status3:"Sign In",message:"" });
  }
});

app.get('/Sign%20Out', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


app.post('/sellatcards1',upload, (req, res) => {

     var obj =new Trip ({
       tripname: req.body.tripname,
       triptype: "trek",
       checkname:_.kebabCase([string=req.body.tripname]),
       price: req.body.price,
       cutprice: req.body.cutprice,
       location: req.body.location,
       temperature: req.body.temperature,
       height: req.body.height,
       distance: req.body.distance,
       days: req.body.days,
       trippoint: req.body.trippoint,
       overview: req.body.overview,
       itinerary1: req.body.day1,
       itinerary2: req.body.day2,
       itinerary3: req.body.day3,
       itinerary4: req.body.day4,
       itinerary5: req.body.day5,
       itinerary6: req.body.day6,
       detailitineraryhead1: req.body.d1,
       detailitinerarydesc1: req.body.des1,
       detailitineraryhead2: req.body.d2,
       detailitinerarydesc2: req.body.des2,
       detailitineraryhead3: req.body.d3,
       detailitinerarydesc3: req.body.des3,
       detailitineraryhead4: req.body.d4,
       detailitinerarydesc4: req.body.des4,
       inclusion1: req.body.inclusion1,
       inclusion2: req.body.inclusion2,
       inclusion3: req.body.inclusion3,
       inclusion4: req.body.inclusion4,
       inclusion5: req.body.inclusion5,
       inclusion6: req.body.inclusion6,
       inclusion7: req.body.inclusion7,
       exclusion1: req.body.exclusion1,
       exclusion2: req.body.exclusion2,
       exclusion3: req.body.exclusion3,
       exclusion4: req.body.exclusion4,
       exclusion5: req.body.exclusion5,
       toc1: req.body.toc1,
       toc2: req.body.toc2,
       toc3: req.body.toc3,
       toc4: req.body.toc4,
       toc5: req.body.toc5,
       toc6: req.body.toc6,
       toc7: req.body.toc7,
       image1: req.body.imagename1,
       image2: req.body.imagename2,
       image3: req.body.imagename3,
       image4: req.body.imagename4,
       image5: req.body.imagename5,
       check: "",
       locate: req.body.locate,
       whatsapp: req.body.whatsapp,
       upcomment: "",
       downcomment: ""

      });
    obj.save();
    res.redirect("/");
});
app.post('/uploadimage',upload, (req, res) => {

    res.redirect("/admin/uploadimages-theyashhanda");
});

app.post('/sellatcards2',upload, (req, res) => {

    var obj =new Trip ({
        tripname: req.body.tripname,
        triptype: "tour",
        checkname: _.kebabCase([string=req.body.tripname]),
        price: req.body.price,
        cutprice: req.body.cutprice,
        location: req.body.location,
        temperature: req.body.temperature,
        height: req.body.height,
        distance: req.body.distance,
        days: req.body.days,
        trippoint: req.body.trippoint,
        overview: req.body.overview,
        itinerary1: req.body.day1,
        itinerary2: req.body.day2,
        itinerary3: req.body.day3,
        itinerary4: req.body.day4,
        itinerary5: req.body.day5,
        itinerary6: req.body.day6,
        detailitineraryhead1: req.body.d1,
        detailitinerarydesc1: req.body.des1,
        detailitineraryhead2: req.body.d2,
        detailitinerarydesc2: req.body.des2,
        detailitineraryhead3: req.body.d3,
        detailitinerarydesc3: req.body.des3,
        detailitineraryhead4: req.body.d4,
        detailitinerarydesc4: req.body.des4,
        inclusion1: req.body.inclusion1,
        inclusion2: req.body.inclusion2,
        inclusion3: req.body.inclusion3,
        inclusion4: req.body.inclusion4,
        inclusion5: req.body.inclusion5,
        inclusion6: req.body.inclusion6,
        inclusion7: req.body.inclusion7,
        exclusion1: req.body.exclusion1,
        exclusion2: req.body.exclusion2,
        exclusion3: req.body.exclusion3,
        exclusion4: req.body.exclusion4,
        exclusion5: req.body.exclusion5,
        toc1: req.body.toc1,
        toc2: req.body.toc2,
        toc3: req.body.toc3,
        toc4: req.body.toc4,
        toc5: req.body.toc5,
        toc6: req.body.toc6,
        toc7: req.body.toc7,
        image1: req.body.imagename1,
        image2: req.body.imagename2,
        image3: req.body.imagename3,
        image4: req.body.imagename4,
        image5: req.body.imagename5,
        check: "",
        locate: req.body.locate,
        whatsapp: req.body.whatsapp
      });
    obj.save();
    res.redirect("/");
});
app.get('/',function(req,res){
  if(req.isAuthenticated()){
    Trip.find({triptype:"trek"}, (err, items) => {

      Trip.find({triptype:"tour"}, (err, items2) => {
        Review.find({}, (err, items3) => {
          res.render('index', { listItems: items,listItems2: items2,status:"Hi," + req.user.firstname,status2:"My Bookings",status3:"Sign Out",reviews:items3   });
          });
        });


      });
  }
  else{
    Trip.find({triptype:"trek"}, (err, items) => {

      Trip.find({triptype:"tour"}, (err, items2) => {
        Review.find({}, (err, items3) => {
          res.render('index', { listItems: items,listItems2: items2,status:"Log In",status2:"",status3:"Sign In",reviews:items3   });
          });
        });


      });
  }



});
app.get('/trips',function(req,res){
      if(req.isAuthenticated()){
        Trip.find( {}, (err, items) => {
          res.render('locate', { listItems: items,status:"Hi," + req.user.firstname,status2:"My Bookings",status3:"Sign Out"   });
          });
      }
      else{
        Trip.find( {}, (err, items) => {
          res.render('locate', { listItems: items,status:"Log In",status2:"",status3:"Sign In"   });
          });
      }

});


  app.get('/admin/fill-theyashhanda',function(req,res){
    if(req.isAuthenticated()){
      if(req.user.username==="mr.ashman444@gmail.com" && req.user.password==="ashman351"){
      res.render('fill', {status:"Hi," + req.user.firstname,status2:"My Bookings",status3:"Sign Out" });
    }
    else{
      res.redirect('/');
    }
}
else{
  res.redirect("/Sign%20In");
}

    });



app.get('/admin/addtrek-theyashhanda',function(req,res){
  if(req.isAuthenticated()){
    if(req.user.username==="mr.ashman444@gmail.com" && req.user.password==="ashman351"){
    res.render("sellatcards1", {status:"Hi," + req.user.firstname,status2:"My Bookings",status3:"Sign Out"});
    }
    else{
    res.redirect('/');
}
}
else{

    res.redirect("/Sign%20In");
}
});
app.get('/hotels',function(req,res){

  if(req.isAuthenticated()){
    res.render("comingsoon", {status:"Hi," + req.user.firstname,status2:"My Bookings",status3:"Sign Out"});
  }
  else{
    res.render("comingsoon", {status:"Log In",status2:"",status3:"Sign In"});
  }
});
app.get('/admin/uploadimages-theyashhanda',function(req,res){
  if(req.isAuthenticated()){
    if(req.user.username==="mr.ashman444@gmail.com" && req.user.password==="ashman351"){
    res.render("uploadimage", {status:"Hi," + req.user.firstname,status2:"My Bookings",status3:"Sign Out"});
    }
    else{
    res.redirect('/');
}
}
else{

    res.redirect("/Sign%20In");
}
});
app.get('/admin/addtour-theyashhanda',function(req,res){
  if(req.isAuthenticated()){

      if(req.user.username==="mr.ashman444@gmail.com" && req.user.password==="ashman351"){
      res.render("sellatcards2", { status:"Hi," + req.user.firstname,status2:"My Bookings",status3:"Sign Out"});
      }
      else{
      res.redirect('/');
  }

}
else{


    res.redirect("/Sign%20In");
}
});

app.get('/trekks/:head',function(req,res){

  let requestedTitle=req.params.head;

    if(req.isAuthenticated()){
      Trip.find({ triptype:"trek",locate:requestedTitle }, (err, items) => {
        res.render('locate', { listItems: items,status:"Hi," + req.user.firstname,status2:"My Bookings",status3:"Sign Out"   });
        });
    }
    else{
      Trip.find({ triptype:"trek",locate:requestedTitle }, (err, items) => {
        res.render('locate', { listItems: items,status:"Log In",status2:"",status3:"Sign In"  });
        });
    }
});

app.get('/tours/:head',function(req,res){
  let requestedTitle=req.params.head;

    if(req.isAuthenticated()){
      Trip.find({ triptype:"tour",locate:requestedTitle }, (err, items) => {
        res.render('locate', { listItems: items,status:"Hi," + req.user.firstname,status2:"My Bookings",status3:"Sign Out"  });
        });
    }
    else{
      Trip.find({ triptype:"tour",locate:requestedTitle }, (err, items) => {
        res.render('locate', { listItems: items,status:"Log In",status2:"",status3:"Sign In"   });
        });
    }
});

app.get('/trip/:head',function(req,res){
  let requestedTitle=req.params.head;
  if(req.isAuthenticated()){
    Trip.find({},function(error,data){
      data.forEach((item) => {

        if(item.checkname===requestedTitle){
        res.render("tourinfo",{
          tripname: item.tripname,
          price: item.price,
          cutprice: item.cutprice,
          checkname:_.kebabCase([string=item.tripname]),
          location: item.location,
          temperature: item.temperature,
          height: item.height,
          distance: item.distance,
          days: item.days,
          trippoint: item.trippoint,
          overview: item.overview,
          itinerary1: item.itinerary1,
          itinerary2: item.itinerary2,
          itinerary3: item.itinerary3,
          itinerary4: item.itinerary4,
          itinerary5: item.itinerary5,
          itinerary6: item.itinerary6,
          detailitineraryhead1: item.detailitineraryhead1,
          detailitinerarydesc1: item.detailitinerarydesc1,
          detailitineraryhead2: item.detailitineraryhead2,
          detailitinerarydesc2: item.detailitinerarydesc2,
          detailitineraryhead3: item.detailitineraryhead3,
          detailitinerarydesc3: item.detailitinerarydesc3,
          detailitineraryhead4: item.detailitineraryhead4,
          detailitinerarydesc4: item.detailitinerarydesc4,
          inclusion1: item.inclusion1,
          inclusion2: item.inclusion2,
          inclusion3: item.inclusion3,
          inclusion4: item.inclusion4,
          inclusion5: item.inclusion5,
          inclusion6: item.inclusion6,
          inclusion7: item.inclusion7,
          exclusion1: item.exclusion1,
          exclusion2: item.exclusion2,
          exclusion3: item.exclusion3,
          exclusion4: item.exclusion4,
          exclusion5: item.exclusion5,
          toc1: item.toc1,
          toc2: item.toc2,
          toc3: item.toc3,
          toc4: item.toc4,
          toc5: item.toc5,
          toc6: item.toc6,
          toc7: item.toc7,
          images1: item.image1,
          images2: item.image2,
          images3: item.image3,
          images4: item.image4,
          images5: item.image5,
          check: "",
          status:"Hi," + req.user.firstname,status2:"My Bookings",status3:"Sign Out",
          whatsapp: item.whatsapp
        });
  }

    });
  });
  }
  else{
    Trip.find({},function(error,data){
      data.forEach((item) => {

        if(item.checkname===requestedTitle){
        res.render("tourinfo",{
          tripname: item.tripname,
          price: item.price,
          cutprice: item.cutprice,
          checkname:_.kebabCase([string=item.tripname]),
          location: item.location,
          temperature: item.temperature,
          height: item.height,
          distance: item.distance,
          days: item.days,
          trippoint: item.trippoint,
          overview: item.overview,
          itinerary1: item.itinerary1,
          itinerary2: item.itinerary2,
          itinerary3: item.itinerary3,
          itinerary4: item.itinerary4,
          itinerary5: item.itinerary5,
          itinerary6: item.itinerary6,
          detailitineraryhead1: item.detailitineraryhead1,
          detailitinerarydesc1: item.detailitinerarydesc1,
          detailitineraryhead2: item.detailitineraryhead2,
          detailitinerarydesc2: item.detailitinerarydesc2,
          detailitineraryhead3: item.detailitineraryhead3,
          detailitinerarydesc3: item.detailitinerarydesc3,
          detailitineraryhead4: item.detailitineraryhead4,
          detailitinerarydesc4: item.detailitinerarydesc4,
          inclusion1: item.inclusion1,
          inclusion2: item.inclusion2,
          inclusion3: item.inclusion3,
          inclusion4: item.inclusion4,
          inclusion5: item.inclusion5,
          inclusion6: item.inclusion6,
          inclusion7: item.inclusion7,
          exclusion1: item.exclusion1,
          exclusion2: item.exclusion2,
          exclusion3: item.exclusion3,
          exclusion4: item.exclusion4,
          exclusion5: item.exclusion5,
          toc1: item.toc1,
          toc2: item.toc2,
          toc3: item.toc3,
          toc4: item.toc4,
          toc5: item.toc5,
          toc6: item.toc6,
          toc7: item.toc7,
          images1: item.image1,
          images2: item.image2,
          images3: item.image3,
          images4: item.image4,
          images5: item.image5,
          check: "",
          status:"Log In",status2:"",status3:"Sign In",
          whatsapp: item.whatsapp
        });
  }

    });
  });
  }

});
app.post('/booknow',upload,function(req,res){
  if(req.isAuthenticated()){
    res.redirect("/#contact2");
  }
  else{
    res.redirect("/Sign%20In");
  }
});


app.post('/search',function(req,res){
  Trip.find( {checkname:{ $regex: _.kebabCase([string=req.body.search]) }} , function(err, docs) {
    if(req.isAuthenticated()){
      res.render('locate', { listItems: docs,status:"Hi," + req.user.firstname,status2:"My Bookings",status3:"Sign Out"   });
    }
    else{
      res.render('locate', { listItems: docs,status:"Log In",status2:"",status3:"Sign In"  });
    }

});

});
app.post('/messages',upload,function(req,res){
  var obj = new Message ({
      name: req.body.name,
      email: req.body.email,
      phonenumber: req.body.number,
      message: req.body.message

    });
  obj.save();
  res.redirect("/");
});

app.listen(port,function(){
  console.log("hosted:3000");
});
