import { Schema, model } from 'mongoose';
import { sign, verify } from 'jsonwebtoken';
import { genSalt, hash as _hash, compare } from 'bcrypt';


const SALT = 10;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.index({
  username: 1
});

userSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    //checking if password field is available and modified
    genSalt(SALT, function (err, salt) {
      if (err) {
        return next(err);
      }

      _hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//for comparing the users entered password with database during login
userSchema.methods.comparePassword = function (candidatePassword, callBack) {
  compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callBack(err);
    }

    callBack(null, isMatch);
  });
};
//for generating token when loggedin
userSchema.methods.generateToken = function (callBack) {
  this.token = sign(this._id.toHexString(), process.env.SECRETE);

  this.save(function (err, user) {
    if (err) {
      return callBack(err);
    }

    callBack(null, user);
  });
};

//validating token for auth routes middleware
userSchema.statics.findByToken = function (token, callBack) {
  const user = this;

  verify(token, process.env.SECRETE, function (err, decode) {
    //this decode must give user_id if token is valid .ie decode=user_id
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) {
        return callBack(err);
      }

      callBack(null, user);
    });
  });
};

const User = model('User', userSchema);

export default { User };
