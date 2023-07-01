// DEPENDENCIES & DECLARATIONS
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.SV_PORT;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PUBLIC DIRECTORY
const path = require('path');
const dir = path.join(__dirname, 'public');
app.use(express.static(dir));

// ROUTES
const user = require('./routes/user.route.js');
const passwordReset = require('./routes/passwordReset.route.js');

app.use('/user', user);
app.use('/passwordReset', passwordReset);

app.get('/', function (req, res) {
    res.send('server status = OK');
});

app.listen(port, () => console.log(`server running on port ${port}`));