const express = require('express');
const bodyParser = require('body-parser');
const app = exports.module = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./'));

app.listen(3000);
