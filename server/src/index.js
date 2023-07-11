const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const app = express();
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

app.get('/api/deployments', (req, res) => {
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

app.post('/api/deployments', (req, res) => {
  const deployment = req.body;
  const id = uuidv4(); // Generate a unique ID for the deployment

  // Assuming you have a "deployments" table in the database with appropriate columns,
  // you can insert the deployment data into the table
  const query = 'INSERT INTO deployments (id, software_release, planned_installation_datetime, user, request_datetime, top_level_application, jira_items, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    id,
    deployment.software_release,
    deployment.planned_installation_datetime,
    deployment.user,
    deployment.request_datetime,
    deployment.top_level_application,
    deployment.jira_items,
    deployment.comments,
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error saving deployment:', err);
      res.status(500).json({ error: 'Failed to save deployment' });
      return;
    }

    // If the deployment is successfully saved, you can send back the saved deployment object as the response
    res.status(201).json({
      id,
      ...deployment,
    });
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
