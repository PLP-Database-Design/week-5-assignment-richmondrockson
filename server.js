// Import our dependencies 
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv')

// Configure environment variables
dotenv.config();

// Create a connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// Test the connection
db.connect((err) => {
    // connection is not successful
    if(err) {
        return console.log("Error connecting to the database: ", err)
    }
    // connection is successful
    console.log("Successfully connected to MySQL", db.threadId)
})

// Retrieve all patients
app.get('/patients', (req, res) => {
    const getPatients = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients'
    db.query(getPatients, (err, data) => {
        if(err) {
            return res.status(500).send("Failed to get patients", err)
        }
        res.status(200).send(data)
    })
});

// Retrieve all providers
app.get('/providers', (req, res) => {
    const getProviders = 'SELECT first_name, last_name, provider_specialty FROM providers'
    db.query(getProviders, (err, data) => {
        if(err) {
            return res.status(500).send("Failed to get providers data", err)
        }
        res.status(200).send(data)
    })
})

// Retrieving patients by first name
app.get('/patients/search', (req, res) => {
    const firstName = req.query.first_name;

    if(!firstName) {
        return res.status(400).send('First name is required');
    }

    const getFirstName = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?'
    db.query(getFirstName, [firstName], (err, data) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('An error occurred while fetching patient data');
          return;
        }

        // Check if any patients where found
        if (data.length === 0) {
            return res.status(404).send('No patients found with that first name');
          }

         res.status(200).send(data)

    });
});


// Retrieving providers by specialty
app.get('/providers/search', (req, res) => {
    const specialty = req.query.provider_specialty;

    if(!specialty){
        return res.status(400).send('Specialty is required')
    }

    const getSpecialty = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?'
    db.query(getSpecialty, [specialty], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('An error occurred while fetching patient data');
            return;
        }

        // Check if any specialties were found
        if (data.length === 0) {
            return res.status(404).send('No providers found with that specialty');
          }

          res.status(200).send(data)
    });
})



// Start and listen to the server
app.listen(3300, () => {
    console.log(`Server is running on port 3300...`)
}) 