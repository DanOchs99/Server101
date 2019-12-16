class TodoItem {
    constructor(title, priority) {
        this.title = title;             // a string with the todo item description
        this.priority = priority;       // 1 = high, 0 = low
        this.dateCreated = new Date();  // when created on server
        this.dateCompleted = null;      // when marked completed
        this.isCompleted  = false;      // completion flag, false = not done; true = completed
    }
}

// initialize server
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

todoList = [];

// create a GET endpoint on /todos
app.get('/todos',(req,res) => {
    // send the todoList - an array of TodoItem objects
    res.json(todoList);
});

// create a POST endpoint on /todos
app.post('/todos',(req,res) => {
    // expects JSON in form { "title" : "<todo item title>", "priority" : <0> }
    // add validation on req.body here?
    todoList.push(new TodoItem(req.body.title, req.body.priority));
    // send the updated todoList - an array of TodoItem objects
    res.json(todoList);
});

// start server
app.listen(3000, () => {
    console.log('Server running on localhost:3000');
});
