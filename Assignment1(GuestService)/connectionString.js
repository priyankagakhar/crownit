var mysql = require("mysql");

var connectionData = {
  host: "localhost", //host name
  user: "root", // Sql user name
  password: "", // sql user password
  database: "GuestsDB", // dasbase name
};

function getConnection() {
  return mysql.createConnection(connectionData);
}

module.exports.getConnection = getConnection;
