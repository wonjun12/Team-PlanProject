require('dotenv/config');
require('./db/db');
const app = require('./server');

const port = process.env.PORT;
 

const router = require('./router/router')(app);

app.listen(port, console.log(`server open ${port}`));