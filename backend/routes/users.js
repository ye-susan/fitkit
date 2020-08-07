//need express route bc we're using router
//also need the user.model we created
const router = require('express').Router();
let User = require('../models/user.model');

//first enpoint that handles users get requests
router.route('/').get((req, res) => {
    //find() is a mongoose method, that returns a promise so results are returned in json format
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json(`Error : ${err}`));
})

//this endpoint handles user post requests
router.route('/add').post((req, res) => {
    const username = req.body.username;
    const newUser = new User({username}); //new instance of User (from the schema)

    //newUser is saved to the DB via the save() method
    newUser.save()
        .then(() => res.json('User added!')) //will return this msg if added successfully 
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;