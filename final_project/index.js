const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// settings

app.set('PORT', process.env.PORT || 5000);

app.use(cors());
app.use(express.json());
dotenv.config();
app.use(morgan("dev"));
app.use("/customer",session({secret: process.env.JWT_SECRET,resave: true, saveUninitialized: true}))

// middlewares

app.use("/customer/auth/*", function auth(req,res,next){
  const authHeader = req.headers.authorization;

  if(!authHeader) return res.status(401).json({message: "Unauthorized"});

  const token = authHeader.split(' ')[1];

  if(!token) return res.status(401).json({message: "token is required"});


  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if(err) return res.status(401).json({message: 'invalid token'});
    
    req.user = payload;
    next();
  });

});
 
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(app.get('PORT'),() => console.log("Server is running on port ", app.get('PORT')));
