import config from '../config/auth.config';
import db from '../models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const User = db.models.User;
const Role = db.models.Role;

const register = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            return res.status(500).send({ message: err });
          }

          user.roles = roles.map(role => role._id);

          user.save(err => {
            if (err) {
              return res.status(500).send({ message: err });
            }

            return res.send({ message: 'User was registered successfully!' });
          });
        }
      );
    } else {
      Role.findOne({ name: 'User' }, (err, role) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            return res.status(500).send({ message: err });
          }

          return res.send({ message: 'User was registered successfully!' });
        });
      });
    }
  });
};

const login = (req, res) => {
  return User.findOne({
    username: req.body.username
  })
    .populate('roles', '-__v')
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

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 6000 // 24 hours
      });

      const authorities = [];

      user.roles.forEach((role) => {
        authorities.push('ROLE_' + role.name.toUpperCase());
      });

      return res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};

const AuthController = {
  login,
  register
};

export default AuthController;
