const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: '192.168.0.206',
  user: 'AppAdmin',
  password: 'Mysql-Admin!@#',
  database: 'releasemanagerdb',
});

app.use(cors());
app.use(express.json());

// Fetch all deployments from the database
app.get('/deployments', (req, res) => {
  const query = 'SELECT * FROM deployments';

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching deployments:', error);
      return res.status(500).json({ error: 'An error occurred while fetching the deployments.' });
    }

    return res.status(200).json(results);
  });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
