var bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
var app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
var connection = require('./mysql_config.js')


// =============================== Beneficiaries API's Start Here ====================

app.get("/api/countrylist", (req, res) => {
    const sql = `select * from country order by id`;
    connection.query(sql, (err, results, fields) => {
        if (err) {
            throw err;
        }
        res.send(results);
    });
});
app.get("/api/beneficiaries", (req, res) => {
    const sql = `SELECT b.*, con.countryname FROM beneficiaries b inner join country con on b.countryid = con.id GROUP BY b.id`;
    // const sql = `select * from beneficiaries order by id`;
    connection.query(sql, (err, results, fields) => {
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

app.get("/api/getBeneficiariesDetails/:id", (req, res) => {
    const sql = `select * from beneficiaries where id=?`;
    connection.query(sql, [req.params["id"]], (err, results, fields) => {
        if (err) {
            throw err;
        }
        res.send(results);
    });
});


app.delete("/api/beneficiaries/:id", async (req, res) => {
    const sql = `delete from beneficiaries where id=?`;
    connection.query(sql, [req.params["id"]], (err, results, fields) => {
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

app.post("/api/beneficiaries", async (req, res) => {
    const sql = `INSERT INTO beneficiaries(id, fullname, address, countryid, pincode) VALUES ('', ?, ?, ? ,?)`;
    connection.query(
        sql,
        [
            req.body.fullname,
            req.body.address,
            req.body.countryid,
            req.body.pincode,
        ],
        (err, results) => {
            if (err) {
                throw err;
            }
            res.send(results);
        }
    );
});





app.put("/api/beneficiaries/:id", (req, res) => {
    const columns = [];
    const values = [];
    if (req.body.fullname) {
        columns.push("fullname=?");
        values.push(req.body.fullname);
    }
    if (req.body.address) {
        columns.push("address=?");
        values.push(req.body.address);
    }
    if (req.body.countryid) {
        columns.push("countryid=?");
        values.push(req.body.countryid);
    }
    if (req.body.pincode) {
        columns.push("pincode=?");
        values.push(req.body.pincode);
    }
    values.push(req.params["id"]);

    if (columns.length > 0) {
        var sql =
            "UPDATE beneficiaries SET " + columns.join(",") + " WHERE id=?";
        connection.query(sql, values, (err, results) => {
            if (err) {
                throw err;
            }
            res.send(results);
        });
    } else res.send("OK");
});
// =============================== Beneficiaries API's End Here ====================

app.listen(3007, (error) => {
    if (error) throw error;
    console.log(`App listening on port 3007`);
});

