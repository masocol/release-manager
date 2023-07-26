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
  //timezone: 'America/New_York', // Set the timezone to Eastern Standard Time
  timezone: '-05:00',
});

// const moment = require('moment-timezone');

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Routes
app.get('/api/deployments', (req, res) => {
  const query = 'SELECT `id`, `software_release`, `deployment_type`,`status`, `planned_installation_datetime`, `user`, `request_datetime`, `top_level_application`, `jira_items`, `comments`, `approvers` FROM deployments';
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

app.get('/api/approver', (req, res) => {
  const query = 'SELECT `user_name` FROM approver';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching approver:', err);
      res.status(500).json({ error: 'Failed to fetch Approver Name' });
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
  const { software_release, deployment_type, status, planned_installation_datetime, request_datetime, user, approvers, AppDataName, jira_items, comments } = req.body;
 
  const query = `INSERT INTO deployments (software_release, deployment_type, status, planned_installation_datetime, user, request_datetime, jira_items, comments, top_level_application, approvers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [software_release, deployment_type, status, planned_installation_datetime, user, request_datetime, jira_items, comments, AppDataName, approvers];
  console.log('Received request body:', req.body);

  //const estTime = 'America/New_York';
  //const plannedInstallationDateTimeEst = moment.tz(req.body.planned_installation_datetime, estTime).format('YYYY-MM-DD HH:mm:ss');
  //const requestDateTimeEst = moment.tz(req.body.request_datetime, estTime).format('YYYY-MM-DD HH:mm:ss');
  
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
      planned_installation_datetime,   // Use the EST converted datetime
      user,
      request_datetime,                // Use the EST converted datetime
      jira_items,
      comments,
      AppDataName,
      approvers
    };
    
    res.status(201).json(newDeployment);
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
