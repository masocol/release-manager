const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
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

// Routes
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
  const {
    software_release,
    planned_installation_datetime,
    user,
    request_datetime,
    top_level_application,
    jira_items,
    comments,
  } = req.body;

  const id = uuidv4(); // Generate a unique ID for the deployment

  const query = `
    INSERT INTO deployments (id, software_release, planned_installation_datetime, user, request_datetime, top_level_application, jira_items, comments)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    id,
    software_release,
    planned_installation_datetime,
    user,
    request_datetime,
    top_level_application,
    jira_items,
    comments,
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error saving deployment:', err);
      res.status(500).json({ error: 'Failed to save deployment' });
      return;
    }

    const newDeployment = {
      id,
      software_release,
      planned_installation_datetime,
      user,
      request_datetime,
      top_level_application,
      jira_items,
      comments,
    };

    res.json(newDeployment);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
