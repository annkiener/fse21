let tasks = [];
let loadedTasks  = false;
let username = "";

// Selectors
document.querySelector('form').addEventListener('submit', handleSubmitForm);

// Event Handlers
function handleSubmitForm(e) {
    e.preventDefault();
    let input = document.querySelector("div.main input[id='fname']");
    if (input.value != '')
        addTodoFromWebsite(input.value);
    input.value = '';
}

function addTodoFromWebsite(todo){
    var due = document.getElementById("due").value; 
    var desc = document.getElementById("description").value;
    console.log(desc);
    let id = storeNewTodo(todo, username, false, due, desc);
    addTodo(todo, due, false, desc, id);
    document.getElementById("newTodo").open = false;
}

// Helpers
function addTodo(todo, due, done, description, id) {
    let ul = document.querySelector('ul');
    let li = document.createElement('li');

    //document.getElementById("main").innerHTML = x;
    li.innerHTML = `
        <details>
          <summary>
            <span class="todo-item">${todo}<br><br>${due}</span>            
            <button name="checkButton"><i class="fas fa-square"></i></button>
            <button name="deleteButton" ><i class="fas fa-trash"></i></button>
            <span class="hidden">${id}</span>
          </summary>
          <p>${description}</p>
        </details>
    `;    
    //li.classList.add(window.localStorage.setItem('todo', 'clean my room'));
    li.classList.add('todo-list-item');
    ul.appendChild(li);
    if(done){
      actuallyCheckTodo(li.children[0].children[0].children[1]); //give the check the checkbutton
    }
}

/**
 * stores a new todo in the tasks and stores it
 * @param {the title of the todo} title 
 * @param {username} user 
 * @param {is it done} done 
 * @param {the due date} due 
 * @param {description} description 
 */
function storeNewTodo(title, user, done, due, description){
  let highestId = 0;
  tasks.forEach(todo =>{
    highestId = todo.id > highestId ? todo.id : highestId;
  })
  
  tasks.push({"id": ++highestId, "title": title, "user": user, "done": done, "due": due, "description": description});
  localStorage.setItem("tasks", JSON.stringify(tasks));
  return highestId;
}

document.querySelector('ul').addEventListener('click', handleClickDeleteOrCheck);

function handleClickDeleteOrCheck(e) {
    if (e.target.name == 'checkButton')
        checkTodo(e);

    if (e.target.name == 'deleteButton')
        deleteTodo(e);
}

function actuallyCheckTodo(node){
  let item = node.parentNode;  
  if (item.style.textDecoration == 'line-through'){
    item.style.textDecoration = 'none';
    node.children[0].classList.replace("fa-check-square", "fa-square");
  }
  else{
      item.style.textDecoration = 'line-through';
      node.children[0].classList.replace("fa-square", "fa-check-square");
  }
}

function checkTodo(e) {
    let item = e.target;
    let id = item.parentNode.children[3].innerHTML;
    tasks.forEach(todo =>{
      if(todo.id == id){
        todo.done = !todo.done;
      }
    })     
    localStorage.setItem("tasks", JSON.stringify(tasks));
    actuallyCheckTodo(item);    
}

function deleteTodo(e) {
    let item = e.target.parentNode;
    console.log(item);
    let id = item.children[3].innerHTML;    
    let newTasks = [];
    let idx = 0;
    tasks.forEach(todo =>{
      if (todo.id != id){
        newTasks[idx++] = todo;
      }
    })
    tasks = newTasks;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    item.addEventListener('transitionend', function () {
        item.remove(); 
    });

    item.classList.add('todo-list-item-fall');
    item.parentNode.parentNode.remove() //deletes the li element
}

document.getElementById('clearAll').addEventListener('click', handleClearAll);

function handleClearAll(e) {
    document.querySelector('ul').innerHTML = '';
}


var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; 

slider.oninput = function() {
  output.innerHTML = this.value;
}


function markAnswer(i){
  poll.selectedAnswer = +i;
  try {
    document.querySelector(".poll .answers .answer.selected").classList.remove("selected");
  } catch(msg){}
  document.querySelectorAll(".poll .answers .answer")[+i].classList.add("selected");
  showResults();
}

function showResults(){
  let answers = document.querySelectorAll(".poll .answers .answer");
  for(let i=0;i<answers.length;i++){
    let percentage = 0;
    if(i == poll.selectedAnswer){
      percentage = Math.round(
        (poll.answersWeight[i]+1) * 100 / (poll.pollCount+1)
      );
    } else {
      percentage = Math.round(
        (poll.answersWeight[i]) * 100 / (poll.pollCount+1)
      );
    }
    
    answers[i].querySelector(".percentage-bar").style.width = percentage + "%";
    answers[i].querySelector(".percentage-value").innerText = percentage + "%";
  }
}

/**
 * loads all todos from a user and displays them
 * @param {username} name 
 * @returns 
 */
function loadTodos(name){  
  handleClearAll(null);
  
  //show new user name "form"
  if(name == "new User"){
    document.getElementById("newUserName").classList.remove("hidden");
  }
  else{
    document.getElementById("newUserName").classList.add("hidden");
  }

  //show the webpage if a valid user has been chosen
  if( name == "" || name == "new User"){
    document.getElementById("webpage").classList.add("hidden");
    return;
  }
  document.getElementById("webpage").classList.remove("hidden");

  console.log("1");
  username = name;
  tasks.forEach(todo => {
    if(todo.user == name){
      addTodo(todo.title, todo.due, todo.done, todo.description, todo.id);
      console.log(todo.id);
    }
  });
}

/**
 * get tasks if not there yet and load usernames
 */
async function loadUsernames(){ 
  await loadTasks().catch((error) => {console.log(error);});  
  let usernames = [];
  tasks.forEach(todo => {
    if (usernames.lastIndexOf(todo.user) == -1){
      usernames.push(todo.user);
    }
  });

  let usernamesMarkup = document.querySelector("select");
 
  usernames.forEach(username => {
    let option = document.createElement("option");
    option.value = username;
    option.innerText = username;
    usernamesMarkup.appendChild(option);
  });     
}

/**
 * locally stores the username
 * @param {username} name 
 */
function changeUsername(name){    
  username = name;
  let usernamesMarkup = document.querySelector("select");
  let option = document.createElement("option");
  option.value = username;
  option.innerText = username;
  usernamesMarkup.appendChild(option);
  usernamesMarkup.value = username;
  document.getElementById("newUserName").classList.add("hidden");
  loadTodos(name);
}

/**
 * loads the tasks either from localstorage or from server
 */
async function loadTasks(){
  if (!loadedTasks){
    if (localStorage.getItem("tasks") == null){
      let response = await fetch("/tasks.json");  
      tasks = await response.json();    
      loadedTasks = true;
    }
    else{
      tasks = JSON.parse(localStorage.getItem("tasks"));
      loadedTasks = true;
    }
  }
}