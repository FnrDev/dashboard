const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let client = req.bot
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
})

module.exports = router;