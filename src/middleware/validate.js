function validate(schema) {
  return (req, res, next) => {
    try {
      const result = schema.parse(req.body);
      req.validated = result;
      return next();
    } catch (err) {
      return next({ status: 400, message: 'Validation failed', details: err.errors || err.message });
    }
  };
}

module.exports = { validate };
