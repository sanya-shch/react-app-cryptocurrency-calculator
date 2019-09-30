const express = require('express');
const cors = require('cors');

const cryptosRouter = require('./routes/crypto');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/crypto', cryptosRouter);

app.listen(port, () => { console.log(`Server is running on port: ${port}`) });