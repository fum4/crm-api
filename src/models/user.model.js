import { Schema, model, Types } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [
    {
      type: Types.ObjectId,
      ref: 'Role'
    }
  ]
});

userSchema.index({
  username: 1
});

const User = model('User', userSchema);

export default User;
