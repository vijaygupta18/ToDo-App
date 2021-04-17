const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const User = require('./public/schema')
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));


const uri=//enter your db link
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, //connect to DB
  function(err) {
    if (err) console.log(err);
    console.log("DB connected.");
  }
);


const createUserData = (username, userTodosInfo) => {
  username = username.toLowerCase();
  console.log("CREATING DOCUMENT FOR USERNAME: " + username);
  const userData = new User({
    name: username,
    todosInfo: userTodosInfo
  });
  return userData;
}

//get user data from DB
const getInfoFromDB = async (username) => {
  username = username.toLowerCase();
  console.log("GETTING DB FOR USERNAME: " + username);
  let todos;

  const data = await User.find({
    name: username
  });
  if (data.length === 0) { //no data in DB
    // console.log("LINE 57 NO USER DATA",data);
    todos = [];
  } else {
    todos = data[0].todosInfo;
  }
  return todos;
}

//update user data in DB
const updateInfoInDB = async (username, userData, todos) => {
  username = username.toLowerCase();
  const data = await User.updateOne({
    name: username
  }, {
    todosInfo: todos
  });
  if (data.n === 0)
  {
    console.log("Creating new DB");
    saveInfoInDB(username, userData).then((response) => {
    })
  } else
    console.log("UPDATED SUCCESSFULLY");
}

//save user data 
const saveInfoInDB = async (username, userData) => {
  console.log("SAVING DataBase FOR USERNAME: " + username);
  const data = await userData.save();
  console.log("Inserted SUCCESSFULLY" + data);
}


//generate new user todo list
function giveNewTodoList(newTodoListObj) {
  let todos = [];
  for (let newTodoOfList in newTodoListObj) {
    if (newTodoOfList === "newTodo" || newTodoOfList === "addBtn" || newTodoOfList === "saveBtn")
      continue;

    let isDone;
    if (newTodoListObj[newTodoOfList] === "") isDone = false;
    else isDone = true;

    todos.push({
      todoItem: newTodoOfList,
      isDone: isDone
    });
  }
  return todos;
}


app.get("/user/:username", (req, res) => {
  let username = req.params.username; 
  let getInfopromise = getInfoFromDB(username); 

  getInfopromise.then((response) => {
    let todos = response;
    console.log(todos);
    res.render("users", {
      User: username,
      todos: todos
    });
  })
});

app.post("/user/:username", (req, res) => {
  let username = req.params.username; //get username
  let newTodo = req.body.newTodo; //new todo

  let todos = giveNewTodoList(req.body); //generate new todo list

  if (newTodo.length > 0) //add new todo or not
    todos.push({
      todoItem: newTodo,
      isDone: false
    });

  let userData = createUserData(username, todos); 
  let updateInfoPromise = updateInfoInDB(username, userData, todos) 
  updateInfoPromise.then((response) => {
    res.redirect("/user/" + username);
  });
});


app.get("/", (req, res) => {
  res.render("home");
});

app.post("/", (req, res) => {
  let username = req.body.username;
  if (username === "") res.redirect("/"); 
  else res.redirect("/user/" + username);
})

app.listen(process.env.PORT || 80, () => {
  console.log("Server started");
});
