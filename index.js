const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Clemente123!',
    database: 'inventory',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));


//Get all items
app.get('/items', (req, res) => {
    mysqlConnection.query('SELECT * FROM employee', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an items
app.delete('/items/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM items WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert an items
app.post('/items', (req, res) => {
    let inv = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [inv.id, inv.name, inv.qty, inv.amount], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted item id : '+element[0].id);
            });
        else
            console.log(err);
    })
});

//Update an items
app.put('/items', (req, res) => {
    let inv = req.body;
    var sql = "SET @id = ?;SET @name = ?;SET @qty = ?;SET @amount = ?; \
    CALL EmployeeAddOrEdit(@id,@name,@qty, @amount);";
    mysqlConnection.query(sql, [inv.id, inv.name, inv.qty, inv.amount], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});
