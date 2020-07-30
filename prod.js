const Config = require("./src/config/Config.json");
const http = require("http");
const express = require('express');
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.static('./dist'));

const server = http.createServer(app);

const port = Config.LIVE_PORT;
server.listen(port);
