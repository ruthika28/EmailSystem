const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Creating a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'scriptchain'
});

// Creating a nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cutiepiemanik@gmail.com', // replace email here
    pass: 'zkdmiwouuzenbgpj' // replace with passcode for the respective email
  }
});
const app = express();
app.use(cors());
// Use body-parser middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//API endpoints
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  // Query the MySQL database for the user with the specified ID
  pool.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// Define API endpoints
app.get('/allUsers', (req, res) => {
  const userId = req.params.id;
  // Query the MySQL database for the user with the specified ID
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(results);
    }
  });
});

app.post('/users', (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  console.log('body is: ',req);
  // Insert the user's information into the MySQL database
  pool.query('INSERT INTO users (email, name) VALUES (?, ?)', [email, name], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // Send a confirmation email to the user
      const mailOptions = {
        from: 'cutiepiemanik@gmail.com',
        to: email,
        subject: 'Confirmation email',
        text: `Dear ${name}, Thank you for registering with our website. Your email address (${email}) has been added to our database.`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          console.log('Email sent: ' + info.response);
          res.json({ message: 'User created successfully' });
        }
      });
    }
  });
});

app.post('/email', (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  console.log('body is: ',req);
      const mailOptions = {
        from: 'cutiepiemanik@gmail.com', //Replace with from email here
        to: email,
        subject: 'Re Check email',
        text: `Dear ${name}, Thank you for continuing with our website. Your email address (${email}) has already been added to our database.`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          console.log('Email sent: ' + info.response);
          res.json({ message: 'User created successfully' });
        }
      });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
