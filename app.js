let tasks = [];
let loadedTasks  = false;
fetch("/tasks.json").then(response =>{
  return response.json();
}).then( json => {
  tasks = json;
  loadedTasks = true;
});

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
    var x = document.getElementById("due").value; 
    addTodo(todo, x, false);
}

// Helpers
function addTodo(todo, due, done) {
    let ul = document.querySelector('ul');
    let li = document.createElement('li');

    //document.getElementById("main").innerHTML = x;
    li.innerHTML = `
        <span class="todo-item">${todo}<br><br>${due}</span>
        <button name="checkButton"><i class="fas fa-square"></i></button>
        <button name="deleteButton" ><i class="fas fa-trash"></i></button>
    `;
    //li.classList.add(window.localStorage.setItem('todo', 'clean my room'));
    li.classList.add('todo-list-item');
    ul.appendChild(li);
    if(done){
      actuallyCheckTodo(li.children[1]); //check it
    }
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
    console.log(item);
    actuallyCheckTodo(item);    
}

function deleteTodo(e) {
    let item = e.target.parentNode;
    
    item.addEventListener('transitionend', function () {
        item.remove(); 
    });

    item.classList.add('todo-list-item-fall');
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

let poll = {
  question:"What's your favorite programming language?",
  answers:[
    "C", "Java", "PHP", "JavaScript"
  ],
  pollCount:20,
  answersWeight:[4, 4, 2, 10],
  selectedAnswer:-1
};

let pollDOM = {
  question:document.querySelector(".poll .question"),
  answers:document.querySelector(".poll .answers")
};

pollDOM.question.innerText = poll.question;
pollDOM.answers.innerHTML = poll.answers.map(function(answer,i){
  return (
    `
      <div class="answer" onclick="markAnswer('${i}')">
        ${answer}
        <span class="percentage-bar"></span>
        <span class="percentage-value"></span>
      </div>
    `
  );
}).join("");

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

function loadTodos(name){
  handleClearAll(null);
  console.log("loading todos");
  console.log(name);
    tasks.forEach(todo => {
      if(todo.user == name){
        addTodo(todo.title, todo.due, todo.done);
      }
    });
}

function loadingUsernames(tasklist){
  let usernames = [];
  tasklist.forEach(todo => {
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

//handle this stupid async stuff
function loadUsernames(){ 
  if (!loadedTasks){
    fetch("/tasks.json").then(response =>{
      return response.json();
    }).then( json => {
      tasks = json;
      loadedTasks = true;
      loadingUsernames(tasks);
    });
  }
  else{
    loadingUsernames(tasks);
  }
}