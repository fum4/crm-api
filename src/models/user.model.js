import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  versionKey: false
});

userSchema.index({
  username: 1
});

const User = model('User', userSchema);

export default User;
