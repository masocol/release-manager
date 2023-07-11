const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mysql-Admin!@#',
  database: 'releasemanagerdb',
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database');
  });
  
  app.get('/deployments', (req, res) => {
    const query = 'SELECT * FROM deployments';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching deployments:', err);
        res.status(500).json({ error: 'Failed to fetch deployments' });
        return;
      }
      res.json(results);
    });
  });
  
  const port = 5000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });