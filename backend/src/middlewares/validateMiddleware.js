const { validationResult } = require('express-validator');

function validate(rules) {
  return async (req, res, next) => {
    await Promise.all(rules.map(rule => rule.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    res.status(422).json({ errors: errors.array() });
  };
}

module.exports = validate;
