const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
/**
 * We get username and password
 * Password has to be saved after decoding using bcrypt
 * bcrypt: needs password(plain text) and the saltRounds
 */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

userSchema.plugin(uniqueValidator);
userSchema.set("toJSON", {
  transform: (document, returnedObjct) => {
    returnedObjct.id = returnedObjct._id.toString();
    delete returnedObjct._id;
    delete returnedObjct.__v;
    delete returnedObjct.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
