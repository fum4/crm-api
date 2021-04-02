import db from '../models';

const ROLES = db.ROLES;
const User = db.models.User;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  return User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (user) {
      return res.status(400).send({ message: 'Failed! Username is already in use!' });
    }

    next();
  });
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    return req.body.roles.forEach((role) => {
      if (!ROLES.includes(role)) {
        return res.status(400).send({
          message: `Failed! Role ${role} does not exist!`
        });
      }
    });
  }

  next();
};

const verifyRegister = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

export default verifyRegister;
