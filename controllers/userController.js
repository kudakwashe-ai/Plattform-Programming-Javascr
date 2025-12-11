const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
    const users = await userService.getAllUsers();
    res.render('index', { users: users });
}

const formUser = async (req, res) => {
    res.render('form');
}

const submitUser = async (req, res) => {
    const user = await userService.createUser(req.body);
    res.redirect('/');
}

module.exports = {
    getAllUsers,
    formUser,
    submitUser
}