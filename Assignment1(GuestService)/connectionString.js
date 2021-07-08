var mysql = require("mysql");

var connectionData = {
  host: "localhost",
  user: "priyanka",
  password: "Priyanka@310195",
  database: "GuestsDB",
};

function getConnection() {
  return mysql.createConnection(connectionData);
}

module.exports.getConnection = getConnection;
