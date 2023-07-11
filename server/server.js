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
  const query = 'SELECT `id`, `software_release`, `deployment_type`, `planned_installation_datetime`, `user`, `request_datetime`, `top_level_application`, `jira_items`, `comments` FROM deployments';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching deployments:', err);
      res.status(500).json({ error: 'Failed to fetch deployments' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/AppData', (req, res) => {
  const query = 'SELECT * FROM Appdata';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching AppData:', err);
      res.status(500).json({ error: 'Failed to fetch AppData' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/AppDataName', (req, res) => {
  const query = 'SELECT `application_name` FROM Appdata';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching AppDataName:', err);
      res.status(500).json({ error: 'Failed to fetch AppDataName' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/UserAdministrationUsers', (req, res) => {
  const query = 'SELECT `user_name` FROM UserAdministration';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching User Administration USER list:', err);
      res.status(500).json({ error: 'Failed to fetch User Administration User list' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/deployments', (req, res) => {
  const { software_release, deployment_type, status, app_name, app_name2, app_name3, app_name4, app_name5, planned_installation_datetime, user, request_datetime, top_level_application, jira_items, comments } = req.body;
 
  const query = `INSERT INTO deployments (software_release, deployment_type, status, app_name, app_name2, app_name3, app_name4, app_name5, planned_installation_datetime, user, request_datetime, top_level_application, jira_items, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [software_release, deployment_type, status, app_name, app_name2, app_name3, app_name4, app_name5, planned_installation_datetime, user, request_datetime, top_level_application, jira_items, comments];
  
  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error saving deployment:', err);
      res.status(500).json({ error: 'Failed to save deployment' });
      return;
    }
    
    const newDeployment = {
      id: result.insertId,
      software_release,
      deployment_type,
      status,
      app_name, 
      app_name2, 
      app_name3, 
      app_name4, 
      app_name5,
      planned_installation_datetime,
      user,
      request_datetime,
      top_level_application,
      jira_items,
      comments
    };
    
    res.status(201).json(newDeployment);
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
