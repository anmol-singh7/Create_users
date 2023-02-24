// const express = require("express");
// const db = require("../db/connection")
// const router = express.Router();
// const bodyParser = require("body-parser");
// router.use(bodyParser.json());
// router.get('/', function (req, res) {
//     res.send("response with a resource")
// })
// router.get('/hi', (req, res) => {
//     var sql = "SELECT * FROM Create_Users"
//     db.query(sql, function (err, rows, fields) {
//         if (err) {
//             res.status(500).send({ error: "failed" })
//         }
//         res.json(rows);
//     })
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { getConnection } = require('../db/connection');

router.get('/users', async (req, res) => {
    try {
        const con1nection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM Create_Users');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addusers', async (req, res) => {
    const { user_id, user_name, employ_id,designation, department, email, password, phone_number } = req.body;

    try {
        const connection = await getConnection();
        if (!user_id || !user_name || !employ_id ||!designation|| !department || !email || !password || !phone_number) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const result = await connection.query(
            'INSERT INTO Create_Users (User_Id, User_Name, Employ_Id, Designation, Department, Email, Password, Phone_Number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, user_name, employ_id, designation, department, email, password, phone_number]
        );
        connection.release();
        res.json({ message: 'User added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/forms',async (req,res)=>{
    try {
        const connection = await getConnection();
        const [Form_rows] = await connection.query('SELECT * FROM Form_Types');
        connection.release();
        res.json(Form_rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addforms', async (req, res) => {
    const { Form_Type } = req.body;
    console.log(req.body)

    try {
        const connection = await getConnection();
        if (!Form_Type) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const result = await connection.query(
            'INSERT INTO  Form_Types(Form_Types) VALUES (?)',
            [Form_Type]
        );
        connection.release();
        res.json({ message: 'Form added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/pwd_auto/columns', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('DESCRIBE pwd_auto');
        connection.release();
        const columns = rows.map(row => row.Field);
        res.json(columns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/add_audit_report_prototype', async (req, res) => {
    const { Head1, Head2, Unit, AttributeType } = req.body;
 console.log(req.body)
    try {
        const connection = await getConnection();
        const result = await connection.query(
            'INSERT INTO audit_report_prototype (Head1, Head2, Unit, AttributeType) VALUES (?, ?, ?, ?)',
            [ Head1, Head2, Unit, AttributeType]
        );
        connection.release();
        res.json({ message: 'Audit report prototype added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addclient', async (req, res) => {
    const { Client_Id, Client_Name, Client_logo } = req.body;

    try {
        const connection = await getConnection();
        if (!Client_Id || !Client_Name) {
            return res.status(400).json({ message: 'Client ID and Client Name are required fields' });
        }

        // Add the new client to the database
        const result = await connection.query(
            'INSERT INTO Client_table (Client_Id, Client_Name, Client_logo) VALUES (?, ?, ?)',
            [Client_Id, Client_Name, Client_logo]
        );
        connection.release();
        res.json({ message: 'Client added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/clients', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM Client_table');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addsystems', async (req, res) => {
    const { client_id, system_name, manufacturer, manufacturer_logo } = req.body;

    try {
        const connection = await getConnection();
        if (!client_id || !system_name || !manufacturer) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const result = await connection.query(
            'INSERT INTO Systems_table (Client_Id, System_Name, Manufacturer, Manufacturer_Logo) VALUES (?, ?, ?, ?)',
            [client_id, system_name, manufacturer, manufacturer_logo]
        );
        connection.release();
        res.json({ message: 'System added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/systems', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM Systems_table');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.post('/addsensorlist', async (req, res) => {
    const sensorList = req.body;
    const numRows = await getNumRows('Sensor_List');

    try {
        const connection = await getConnection();
        if (!Array.isArray(sensorList)) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const promises = sensorList.map(async (sensor, index) => {
            const sensorName = `S${numRows + index + 1}`;
            const { Head1, Head2, Unit, AttributeType } = sensor;
            const result = await connection.query(
                'INSERT INTO Sensor_List (Sensor_Name, Head1, Head2, Unit, AttributeType) VALUES (?, ?, ?, ?, ?)',
                [sensorName, Head1, Head2, Unit, AttributeType]
            );
        });

        await Promise.all(promises);
        connection.release();
        res.json({ message: 'Sensor list added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

async function getNumRows(tableName) {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query(`SELECT COUNT(*) as numRows FROM ${tableName}`);
        connection.release();
        return rows[0].numRows;
    } catch (error) {
        console.error(error);
        return 0;
    }
}


router.get('/sensorlist', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM Sensor_List');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});






// const sql = `INSERT INTO audit_report_prototype (Head1, Head2, Unit, AttributeType) VALUES (?, ?, ?, ?)`;

// // Execute query
// connection.query(sql, [Head1, Head2, Unit, AttributeType], (error, results, fields) => {
//     if (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     } else {
//         res.status(200).send('Values added successfully');
//     }
// });
// });


module.exports = router;


// const express = require('express');
// const router = express.Router();
// const db = require('../db/connection');

// router.post('/api/users', async (req, res) => {
//     const { user_id, user_name, employ_id, department, email, password, phone_number } = req.body;

//     if (!user_id || !user_name || !employ_id || !department || !email || !password || !phone_number) {
//         return res.status(400).json({ message: 'Invalid request' });
//     }

//     const conn = await db.getConnection();

//     try {
//         await conn.query('START TRANSACTION');

//         const [result] = await conn.query('INSERT INTO Create_Users (serial_number, user_id, user_name, employ_id, department, email, password, phone_number) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)', [user_id, user_name, employ_id, department, email, password, phone_number]);

//         await conn.query('COMMIT');

//         return res.status(200).json({ message: 'User added successfully' });
//     } catch (err) {
//         console.error(err);
//         await conn.query('ROLLBACK');
//         return res.status(500).json({ message: 'Internal server error' });
//     } finally {
//         conn.release();
//     }
// });