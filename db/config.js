let options = {};
if (process.env.NODE_ENV) {
  options = { path: '.env.' + process.env.NODE_ENV};
}
require('dotenv').config(options);

let vars = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOSTNAME,
  dialect: 'mysql',
};

module.exports = {
  dev: vars,
  test: vars,
  prod: vars,
  vars: vars
};
