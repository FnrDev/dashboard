const express = require('express');
const router = express.Router();
const passport = require('passport')

router.get('/', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/')
})

module.exports = router;