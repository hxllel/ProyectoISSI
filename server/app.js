if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require("express");
const cors = require("cors");
var session = require("express-session");
var passport = require("passport");
const rutaMain = require("./routes/rutaMain.js");
require("./config/passport.js")(passport);
var cookieParser = require("cookie-parser");
var flash =require("connect-flash");
const rutaAdministrador = require("./routes/rutasAdministrador/route.js");

const app = express();
app.set("port", 4000);
app.use(express.json());
app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}));
console.log("Servidor corriendo en puerto", app.get("port"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use("/", rutaMain(passport));
app.use("/", rutaAdministrador(passport));

app.listen(app.get("port"));
