const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default:
      "https://ik.imagekit.io/fau0arp6i/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.webp?updatedAt=1771157172981",
  },
});
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
