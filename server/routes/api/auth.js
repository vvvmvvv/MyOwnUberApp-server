require('dotenv').config()
const router = require('express').Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {registerValidation, loginValidation} = require('./auth-validation');
const verify = require('../middleware/verify')

router.post('/register', async (req, res) => {

    // VALIDATION
      // const {error} = registerValidation(req.body);
      // if(error) return res.status(400).send(error.details.message)

    const {username, password, role } = req.body;
    try {
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ error: [{ msg: 'user is already exits' }] });
      }
      user = new User({
        username,
        password,
        role,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: 36000
      },
        (err) => {
          if (err) throw err
          res.json({ "status": "User registered successfully" })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send('server error')
    }
});

router.post('/login', async (req, res) => {

    // //VALIDATION
    // const {error} = loginValidation(req.body);
    // //if(error) return res.status(400).send(error.details[0].message);

    const { username, password } = req.body;
    try {
      let user = await User.findOne({ username })
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' })
      }
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' })
      }
      const payload = {
        user: {
          id: user.id
        }
      }
      jwt.sign(payload, process.env.TOKEN_SECRET,
        (err, token) => {
          if (err) throw err
          res.json({ status: "User authenticated successfully", token });
        }
      )

    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }

});

module.exports = router;