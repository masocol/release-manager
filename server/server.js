const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone'); // Import moment-timezone

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

// Update the status of a deployment record
app.put('/api/deployments/:id/status', (req, res) => {
  const deploymentId = req.params.id;
  const newStatus = req.body.status;

  // Perform the update operation in the database
  const query = 'UPDATE deployments SET status = ? WHERE id = ?';
  const values = [newStatus, deploymentId];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating deployment status:', err);
      res.status(500).json({ error: 'Failed to update deployment status' });
      return;
    }

    // Check if any rows were affected (updated)
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Deployment record not found' });
      return;
    }

    // Respond with the updated deployment record
    const updatedDeployment = {
      id: deploymentId,
      status: newStatus,
    };
    res.json(updatedDeployment);
  });
});

app.get('/api/deployments/:id', (req, res) => {
  const deploymentId = req.params.id;

  // Perform the query to fetch the specific deployment record
  const query = 'SELECT * FROM deployments WHERE id = ?';
  connection.query(query, [deploymentId], (err, results) => {
    if (err) {
      console.error('Error fetching deployment:', err);
      res.status(500).json({ error: 'Failed to fetch deployment' });
      return;
    }

    // Check if any rows were found
    if (results.length === 0) {
      res.status(404).json({ error: 'Deployment record not found' });
      return;
    }

    // Respond with the fetched deployment record
    const deploymentRecord = results[0];
    res.json(deploymentRecord);
  });
});

// Update an AppData record
app.put('/api/AppData/:id', (req, res) => {
  const id = req.params.id;
  const { application_name, name_of_submitter } = req.body;

  // Perform the update operation in the database
  const query = 'UPDATE Appdata SET application_name = ?, name_of_submitter = ? WHERE id = ?';
  const values = [application_name, name_of_submitter, id];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating AppData:', err);
      res.status(500).json({ error: 'Failed to update AppData' });
      return;
    }

    // Check if any rows were affected (updated)
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'AppData not found' });
      return;
    }

    // Respond with the updated AppData record
    const updatedAppData = {
      id,
      application_name,
      name_of_submitter,
      // Add other fields as needed
    };
    res.json(updatedAppData);
  });
});

// Add a new AppData record
app.post('/api/AppData', (req, res) => {
  const { application_name, name_of_submitter } = req.body;

   // Get the current date and time in Eastern Standard Time (EST)
   const currentDateTime = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');

  // Perform the insert operation in the database
  const query = `INSERT INTO Appdata (application_name, name_of_submitter, date_record_created, date_record_updated) VALUES (?, ?, ?, ?)`;
  const values = [application_name, name_of_submitter, currentDateTime, currentDateTime]; // Set both created and updated dates to current date and time

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error creating AppData:', err);
      res.status(500).json({ error: 'Failed to create AppData' });
      return;
    }

    // Respond with the newly created AppData record
    const newAppData = {
      id: result.insertId,
      application_name,
      name_of_submitter,
      date_record_created: currentDateTime,
      date_record_updated: currentDateTime,
      // Add other fields as needed
    };
    res.status(201).json(newAppData);
  });
});


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
