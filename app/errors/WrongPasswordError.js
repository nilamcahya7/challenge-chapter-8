const ApplicationError = require("./ApplicationError");

class WrongPasswordError extends ApplicationError {
  constructor() {
    super("Password is not correct!");
    this.password = "Please input correct password";
  }
  get details() {
    return { password: this.password };
  }
}

module.exports = WrongPasswordError;