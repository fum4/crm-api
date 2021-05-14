import config from '../config/auth.config';
import db from '../models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const User = db.models.User;

const register = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  await user.save((err) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
  });
};

const login = (req, res) => {
  return User.findOne({
    username: req.body.username
  })
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      const isPasswordValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!'
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, ); // { expiresIn: 18000 // 5 hours }

      return res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token
      });
    });
};

const AuthController = {
  login,
  register
};

export default AuthController;
