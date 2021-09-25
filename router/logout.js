const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    await req.logout();
    res.redirect('/')
})

module.exports = router;