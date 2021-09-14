const express = require('express');
const router = express.Router();

router.get('/invite', (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.clientID}&permissions=8&scope=bot%20applications.commands`)
})

module.exports = router;