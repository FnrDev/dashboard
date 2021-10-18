const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth')

router.get('/', checkAuth, async(req, res) => {
    res.render('pages/premium')
})

module.exports = router;