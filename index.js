// import packages
const express = require('express');
const app = express();
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS"] })
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const fileStore = require('session-file-store')(session);
app.use(express.json());
app.use(express.static('public'))
require('dotenv').config();
require('colors');

// strategy for discord
passport.use(new DiscordStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.secret,
    callbackURL: process.env.callback,
    scope: process.env.SCOPES.split(',')
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile)
    })
}))

// setup session
app.use(session({
  secret: 'fnr12345624',
  resave: false,
  saveUninitialized: false,
  store: new fileStore({ 
    logFn: () => true
    }),
  cookie: { maxAge: 3600000 * 24 * 30 }
}));

// serializeUser & deserializeUser
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// locals
app.use(async function(req, res, next) {
  let user;
  if (req.isAuthenticated()) {
    user = await client.users.fetch(req.user.id)
  }
  req.bot = client;
  res.locals.login = req.isAuthenticated();
  res.locals.client = client;
  res.locals.user = user;
  res.locals.loggedUser = req.user;
  res.locals.route = req.originalUrl;
  next();
})

// routes
app.use('/', require('./router/index'))
app.use('/invite', require('./router/invite'))
app.use('/premium', require('./router/premium'))
app.use('/login', require('./router/login'))
app.use('/logout', require('./router/logout'))
app.use('/support', require('./router/support'))

// end of routes

// start backend server
app.listen(process.env.port, () => console.log(`App is ready in port ${process.env.port}`))

client.on('ready', () => {
  console.log(`[Discord API] Logged in as ${client.user.username}`.cyan);
})

client.login(process.env.token);