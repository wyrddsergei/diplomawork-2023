const router = require('express').Router();
const Post = require('../models/Post');

// Create
router.post('/', async (req, res) => {
    const newPost = new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update
router.put('/:id', async (req, res) => { 
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body,
                    },{ new: true }
                );
                res.status(200).json(updatedPost);
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json('You cannot update posts you are not author of');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {
                await post.delete();
                res.status(200).json('Post has been deleted...');
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json('You cannot delete posts you are not author of');
        }
    } catch (err) {
        res.status(500).json(err);
    }
}); 

// Get
router.get('/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        // Post not found, send a 404 response
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Post found, send the post data
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
});  

// Get All
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const username = req.query.user;
    const catName = req.query.cat;
  
    try {
      let posts;
      let totalPosts;
  
      const query = {};
  
      if (username) {
        query.username = username;
      } else if (catName) {
        query.categories = { $in: { name: catName } };
      }
  
      // Count total number of matching posts
      totalPosts = await Post.countDocuments(query);
  
      // Calculate the starting index of the current page
      const startIndex = (page - 1) * limit;
  
      // Fetch posts based on pagination parameters and sort by createdAt in descending order
      posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
        .exec();
  
      const totalPages = Math.ceil(totalPosts / limit);
  
      res.status(200).json({
        posts,
        page,
        totalPages,
        totalPosts,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;