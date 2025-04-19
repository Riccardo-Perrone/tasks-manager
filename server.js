const express = require('express');
const app = express();
const tasksRouter = require('./db/routes/tasks');
const taskListsRouter = require('./db/routes/tasksList');

require('dotenv').config();

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.use('/api/tasks-list', taskListsRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

