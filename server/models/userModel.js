const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  phone: String,
  email: String,
  address: String,
  idRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
