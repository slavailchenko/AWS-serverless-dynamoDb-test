const { createUser, getUsers, getOneUser, updateUser, deleteUser } = require('./users');
const { createLocalDb } = require('./createLocalDb');

module.exports = {
  createLocalDb,
  createUser,
  getUsers,
  getOneUser,
  updateUser,
  deleteUser,
};