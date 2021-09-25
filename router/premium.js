const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth')

router.get('/', checkAuth, async(req, res) => {
    res.render('premium')
})

module.exports = router;