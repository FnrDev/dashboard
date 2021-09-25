const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let client = req.bot
    res.redirect(`https://discord.gg/${process.env.SUPPORT}`)
})

module.exports = router;