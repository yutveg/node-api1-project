// implement your API here
const express = require("express");
const server = express();
const Users = require("./data/db.js");

server.use(express.json());

server.get("/", (req, res) => {
  res.send({ hello: "I have awakened." });
});

//fetches user list
server.get("/api/users", (req, res) => {
  Users.find()
    .then(users => {
      console.log("Success");
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

//fetches a user
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  Users.findById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(err);
      if (!Users.findById(id)) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res
          .status(500)
          .json({ message: "The user info could not be retrieved." });
      }
    });
});

//deletes a user
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  Users.remove(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(err);
      if (!Users.findById(id)) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(500).json({ message: "The user could not be removed." });
      }
    });
});

//adds a user
server.post("/api/users/", (req, res) => {
  const userData = req.body;
  Users.insert(userData)
    .then(user => {
      res.status(201).json(userData);
    })
    .catch(err => {
      if (!userData.bio || !userData.name) {
        res
          .status(400)
          .json({ errorMessage: "Please provide name and bio for the user." });
      } else {
        res
          .status(400)
          .json({ errorMessage: "There was an error saving the user." });
      }
    });
});

//updates a user
server.put("/api/users/:id", (req, res) => {
  const editedInfo = req.body;
  const id = req.params.id;
  Users.update(id, editedInfo)
    .then(user => {
      res.status(200).json(editedInfo);
    })
    .catch(err => {
      if (!Users.findById(id)) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else if (!editedInfo.name || !editedInfo.bio) {
        res
          .status(400)
          .json({ errorMessage: "Please provide name and bio for the user." });
      } else {
        res.status(500).json({
          errorMessage: "The user information could not be modified."
        });
      }
    });
});

const port = 7000;
server.listen(port, () => console.log(`\n ** api on port: ${port} ** \n`));
