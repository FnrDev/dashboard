const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const client = req.bot;
    const fetchApplication = await client.application.fetch();
    res.render('pages/index', {
        description: fetchApplication.description || `I can\'t find about me in ${client.user.username} bot`
    })
})

module.exports = router;