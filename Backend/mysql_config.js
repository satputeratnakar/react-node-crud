var mysql = require("mysql");

  var connection = mysql.createPool({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root123",
    database: "assignment_crud",
  });
  
  module.exports = connection