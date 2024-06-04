const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const e = require('express');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
const port = 5000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kushan_electricals'
});

const getItemList = (req, res) => {
    const sql = 'SELECT * from product where status = 1';
    db.query(sql, (err, result) => {
        if (err) res.json({ message: 'Server error occurred' });
        console.log(res)
        res.json(result);
    });
}  
 module.exports = { getItemList };


//  (req, res) => {
//     const sql = 'SELECT * FROM product';
//     db.query(sql, (err, result) => {
//         if (err) res.json({ message: 'Server error occurred' });
//         res.json(result);
//     });
// }