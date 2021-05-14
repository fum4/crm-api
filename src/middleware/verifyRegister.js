import db from '../models';

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

const verifyRegister = {
  checkDuplicateUsernameOrEmail
};

export default verifyRegister;
