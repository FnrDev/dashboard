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
const checkAuth = require('./middleware/checkAuth');
app.use(express.json());
app.use(express.static('public'))
require('dotenv').config();
require('colors');

const inviteRoutes = require('./router/invite')
app.use('/invite', inviteRoutes)

passport.use(new DiscordStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.secret,
    callbackURL: process.env.callback,
    scope: ["identify", "guilds"]
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile)
    })
}))

app.use(session({
    secret: 'fnr12345624',
    resave: false,
    saveUninitialized: false,
    store: new fileStore(),
    cookie: { maxAge: 3600000 * 24 * 30 }
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

client.on('ready', () => {
    console.log(`[Discord API] Logged in as ${client.user.username}`.cyan);
})

app.get('/', async (req, res) => {
    const user = req.isAuthenticated() ? req.user : null;
    res.render('index', {
      client: client,
      user: user
    })
})

app.get('/premium', checkAuth, async(req, res) => {
  res.render('premium', {
    client: client
  })
})

app.get('/login', passport.authenticate('discord', {
  failureRedirect: '/'
}), function(req, res) {
  res.redirect(`/`)
});

app.get('/logout', async (req, res) => {
    req.session.destroy(() => {
      req.logout();
      res.redirect('/')
    })
})

client.login(process.env.token);
app.listen(process.env.port, () => console.log(`App is ready in port ${process.env.port}`))