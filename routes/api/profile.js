const express = require('express');
const router = express.Router();

// @route    Get api/profile/
// @desc     Tests Profile route
// @access   Public
router.get('/', (req, res) => res.json('Profile Works'));

module.exports = router;
