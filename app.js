// Selectors
document.querySelector('form').addEventListener('submit', handleSubmitForm);

// Event Handlers
function handleSubmitForm(e) {
    e.preventDefault();
    let input = document.querySelector("div.main input[id='fname']");
    if (input.value != '')
        addTodo(input.value);
    input.value = '';
}

// Helpers
function addTodo(todo) {
    let ul = document.querySelector('ul');
    let li = document.createElement('li');
    var x = document.getElementById("due").value;
    //document.getElementById("main").innerHTML = x;
    li.innerHTML = `
        <span class="todo-item">${todo}<br><br>${x}</span>
        <button name="checkButton"><i class="fas fa-check-square"></i></button>
        <button name="deleteButton" ><i class="fas fa-trash"></i></button>
    `;
    //li.classList.add(window.localStorage.setItem('todo', 'clean my room'));
    li.classList.add('todo-list-item');
    ul.appendChild(li);
}

document.querySelector('ul').addEventListener('click', handleClickDeleteOrCheck);

function handleClickDeleteOrCheck(e) {
    if (e.target.name == 'checkButton')
        checkTodo(e);

    if (e.target.name == 'deleteButton')
        deleteTodo(e);
}

function checkTodo(e) {
    let item = e.target.parentNode;
    if (item.style.textDecoration == 'line-through')
        item.style.textDecoration = 'none';
    else
        item.style.textDecoration = 'line-through';
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