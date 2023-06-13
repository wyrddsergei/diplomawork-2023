const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');

// Update
router.put('/:id', async (req, res) => {
    try {
      if (req.body.userId === req.params.id) {
        // Rest of the code remains the same
      } else {
        res.status(401).json('You can update only your account!');
      }
    } catch (err) {
      res.status(404).json('User not found');
    }
  });
  
  // Delete
  router.delete('/:id', async (req, res) => {
    try {
      if (req.body.userId === req.params.id) {
        // Rest of the code remains the same
      } else {
        res.status(401).json('You can delete only your account!');
      }
    } catch (err) {
      res.status(404).json('User not found');
    }
  });
  
  // Get user
  router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) {
        res.status(404).json('User not found');
        return;
      }
  
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(404).json('User not found');
    }
  });
  

module.exports = router;