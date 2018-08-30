const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require("path");
const bodyParser = require('body-parser');


const app = express();

app.get('/', (req, res) => {

});

app.listen(3000, () => console.log('Example app listening on port 3000!'))