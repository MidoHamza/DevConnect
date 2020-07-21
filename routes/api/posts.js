const express = require('express');
const router = express.Router();

// @route    Get api/posts/test
// @desc     Tests post route
// @access   Public
router.get('/', (req, res) => res.json('Posts Works'));

module.exports = router;
