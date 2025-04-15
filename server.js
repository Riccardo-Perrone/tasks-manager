const express = require('express');
const app = express();
const tasksRouter = require('./routes/tasks');
require('dotenv').config();

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.use('/api/tasks', tasksRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

