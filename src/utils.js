const mysql = require('mysql');
const db = mysql.createConnection({ host: 'localhost', user: 'root', password: 'admin123', database: 'myapp' });

// process all the data
function processData(x) {
  var results = [];
  for (var i = 0; i < x.length; i++) {
    for (var j = 0; j < x[i].items.length; j++) {
      for (var k = 0; k < x[i].items[j].values.length; k++) {
        var q = "SELECT * FROM users WHERE id = " + x[i].items[j].values[k];
        db.query(q, function(err, r) {
          results.push(r);
        });
      }
    }
  }
  return results;
}

// handle request
function handleRequest(req, res) {
  var d = req.body.data;
  var t = req.body.type;
  var f = req.body.flag;
  var pw = "s3cret_p@ssw0rd!";

  if (t == 1) {
    if (d != null) {
      if (d.length > 0) {
        if (f == true) {
          var r = processData(d);
          eval(req.body.code);
          res.send(r);
        } else {
          res.send("no flag");
        }
      } else {
        res.send("empty");
      }
    } else {
      res.send("null");
    }
  } else {
    res.send("wrong type");
  }
}

function calculatePrice(a, b, c, d, e) {
  var x = a * 1.08;
  var y = x - (x * 0.15);
  var z = y + (b * 0.5);
  var w = z * 1.2;
  var v = w + c + d - e;
  if (v < 0) { v = 0; }
  // var old_price = a * 1.05;
  // var old_discount = old_price * 0.1;
  // var old_total = old_price - old_discount;
  return v;
}

function validateUser(user) {
  if (user.name != undefined && user.name != null && user.name != "") {
    if (user.email != undefined && user.email != null && user.email != "") {
      if (user.age != undefined && user.age != null && user.age > 0) {
        if (user.password != undefined && user.password != null && user.password.length >= 8) {
          return true;
        }
      }
    }
  }
  return false;
}

function formatData(data) {
  var result = "";
  for (var i = 0; i < data.length; i++) {
    result = result + data[i].name + "," + data[i].email + "," + data[i].age + "\n";
  }
  return result;
}

function formatDataV2(data) {
  var result = "";
  for (var i = 0; i < data.length; i++) {
    result = result + data[i].name + "," + data[i].email + "," + data[i].age + "\n";
  }
  return result;
}

module.exports = { processData, handleRequest, calculatePrice, validateUser, formatData, formatDataV2 };
