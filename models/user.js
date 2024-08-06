import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 20
    },
    password: {
      type: String,
      required: true,
    },
  });
  
  const User = mongoose.model("User", userSchema);
  
  export default User;