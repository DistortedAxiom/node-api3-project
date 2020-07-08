const express = require('express');

const router = express.Router();

const Users = require("./userDb.js");
const Posts = require("../posts/postDb");


router.post('/', validateUser, (req, res) => {
  const userBody = req.body
  Users.insert(userBody)
    .then((user) => {
      res.status(201).json(user)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({error: "There was an error in adding a new user"})
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const {id} = req.params
  const {text} = req.body

  console.log({text, user_id: id})

  Posts.insert({text, user_id: id})
    .then((post) => {
      res.status(200).json(post)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({message: "There was an error in submitting the post"})
    })

});

router.get('/', (req, res) => {
  Users.get()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({error: "There was an error in fetching users"})
    })
});

router.get('/:id', validateUserId, (req, res) => {
  const {id} = req.params;

  Users.getById(id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);

    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const {id} = req.params;

  Users.getUserPosts(id)
    .then((post) => {
      res.status(200).json(post)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({message: "Could not get user post"})
    })

});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  const {id} = req.params

  Users.getById(id)
    .then(user => {
      if (user != null) {
        req.user = user;
        next()
      }
      else {
        res.status(400).json({message: "invalid user id"})
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Cannot get user ID" });
    });
}

function validateUser(req, res, next) {
  const {userBody} = req.body;

  if (userBody.length == 0) {
    res.status(400).json({ message: "missing user data" });
  }
  else if ((userBody.name).length == 0) {
    res.status(400).json({ message: "missing required name field" });
  }
  else {
    next();
  }
}

function validatePost(req, res, next) {
  const postText = req.body.text;

  if (Object.keys(req.body).length === 0 ) {
    res.status(400).json({message: "missing post data"})
  }

  else if ((postText).length == 0) {
    res.status(400).json({message: "missing required text field"})
  }

  else {
    next();
  }

}

module.exports = router;
