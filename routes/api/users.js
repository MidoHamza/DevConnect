const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// Load User modal
const User = require('../../models/User');

// @route    POST api/users/
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),

    check('email', 'Please incluse a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters '
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      });
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
module.exports = router;

// router.post('/register', (req, res) => {
//   User.findOne({ email: req.body.email }).then((user) => {
//     if (user) {
//       return res.status(400).json({ email: 'Email already exists' });
//     } else {
//       const avatar = gravatar.url(req.body.email, {
//         s: '200', // Size
//         r: 'pg', // Rating
//         d: 'mm', // Default
//       });
//       const newUser = new User({
//         name: req.body.name,
//         email: req.body.email,
//         avatar,
//         password: req.body.password,
//       });
//       bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(newUser.password, salt, (err, hash) => {
//           if (err) throw err;
//           newUser.password = hash;
//           newUser
//             .save()
//             .then((user) => res.json(user))
//             .catch((err) => console.log(err));
//         });
//       });
//     }
//   });
// });
