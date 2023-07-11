const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const { v4: uuidv4 } = require('uuid');

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Rmasocol',
  password: 'Alpha5!@#',
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
  const {
    software_release,
    planned_Installation_date,
    user,
    request_datetime,
    top_level_application,
    jira_items,
    comments
  } = req.body;

  const id = uuidv4();
  const query =
    'INSERT INTO deployments (software_release, planned_installation_datetime, user, request_datetime, top_level_application, jira_items, comments) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(
    query,
    [
      software_release,
      planned_installation_datetime,
      user,
      request_datetime,
      top_level_application,
      jira_items,
      comments
    ],
    (err) => {
      if (err) {
        console.error('Error saving deployment:', err);
        res.status(500).json({ error: 'Failed to save deployment' });
        return;
      }
      res.json({
        software_release,
        planned_installation_datetime,
        user,
        request_datetime,
        top_level_application,
        jira_items,
        comments
      });
    }
  );
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
