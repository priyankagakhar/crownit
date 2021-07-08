var express = require("express");
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const port = 2410;

app.listen(port, () => console.log("Listening on port : ", port));

var getConnection = require("./connectionString.js").getConnection;

// Post Data in GuestList

app.post("/guest_list/:name", (req, res) => {
  let name = req.params.name;
  let table = +req.body.table;
  let accompanying_guests = +req.body.accompanying_guests;
  let con = getConnection();
  con.query("SELECT * FROM Venue", (err, result) => {
    if (err) throw err;
    else {
      if (table > result[0].totalTables) {
        res.status(400).send("Table is not avaliable");
      } else if (accompanying_guests + 1 > result[0].seatsOnTable) {
        res.send("Accompany Guests Are More Than Table Size");
      } else {
        let sql = `INSERT INTO GuestList VALUES ('${name}',${table},${accompanying_guests},${null},${false},${null},${
          accompanying_guests + 1
        })`;
        con.query(sql, (err1, result1) => {
          if (err1) {
            if (err1.message.includes("table_no"))
              res.status(400).send("Table Already Assigned");
            else if (err1.message.includes("PRIMARY"))
              res.status(400).send("Name Already Entered");
            else res.status(400).send(err1.message);
          } else res.send({ name: name });
        });
      }
    }
  });
});

// Get All Guests

app.get("/guest_list", (req, res) => {
  let con = getConnection();
  con.query(
    "SELECT name,table_no,expected_accompanying_guests,arrived_accompanying_guests,is_arrived FROM GuestList",
    (err, result) => {
      if (err) throw err;
      else {
        let guests = result.map((ele) => {
          return {
            name: ele.name,
            table: ele.table_no,
            accompanying_guests: ele.is_arrived
              ? ele.arrived_accompanying_guests
              : ele.expected_accompanying_guests,
          };
        });
        res.send({ guests: guests });
      }
    }
  );
});

// Guest Arrives

app.put("/guests/:name", (req, res) => {
  let name = req.params.name;
  let accompanying_guests = +req.body.accompanying_guests;
  let time = new Date().toLocaleTimeString([], { hour12: true });
  let con = getConnection();
  con.query("SELECT seatsOnTable FROM Venue", (err, result) => {
    if (err) throw err;
    else {
      if (accompanying_guests + 1 > result[0].seatsOnTable)
        res.send("Accompanying Guests are more the Table Capacity");
      else {
        let sql = `UPDATE GuestList SET arrived_accompanying_guests=${accompanying_guests},time_arrived='${time}',is_arrived=${true},occupied_seats=${
          accompanying_guests + 1
        } WHERE name='${name}'`;
        con.query(sql, (err1, result1) => {
          if (err1) {
            throw err1;
          } else {
            res.send({ name: name });
          }
        });
      }
    }
  });
});

// Get Arrived Guests

app.get("/guests", (req, res) => {
  let con = getConnection();
  let sql = `SELECT name,time_arrived,arrived_accompanying_guests AS accompanying_guests FROM GuestList WHERE is_arrived=${true}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    else res.send({ guests: result });
  });
});

//Guest Leaves

app.delete("/guests/:name", (req, res) => {
  let con = getConnection();
  let name = req.params.name;
  let sql = `DELETE FROM GuestList WHERE name='${name}'`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    else {
      if (result.affectedRows === 0) res.status(400).send("Name not Found");
      else res.send({ name: name });
    }
  });
});

// Empty Seats

app.get("/seats_empty", (req, res) => {
  let con = getConnection();
  con.query("SELECT * FROM Venue", (err, result) => {
    if (err) throw err;
    else {
      let totalSeats = result[0].totalTables * result[0].seatsOnTable;
      let sql = `SELECT SUM(occupied_seats) AS totalOccupiedSeats FROM GuestList`;
      con.query(sql, (err1, result1) => {
        if (err1) throw err1;
        else {
          let empty_seats = totalSeats - result1[0].totalOccupiedSeats;
          res.json({ empty_seats: empty_seats });
        }
      });
    }
  });
});
