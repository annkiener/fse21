let tasks = [];
let loadedTasks  = false;
let username = "";
var today = new Date();
//today getDate returns a number which might have length 1
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate() < 10 ? '0' + today.getDate() : today.getDate()); 
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

function getSliderValues(id) {
  var moodNow = document.getElementById(id);
  var display = document.getElementById("display");
  if(id == "physical"){
    var output = document.getElementById("value");
  }

 /* if(getVal<30) {
    display.innerHTML = "My mood is terrible, I feel hopeless";
  }
  
  if(getVal>=30 && getVal<=60) {
    display.innerHTML = "My mood is OK, I feel fine";
  }
  
  if(getVal>60){
    display.innerHTML = "My mood is excellent, I feel optimistic";
  }
  

  if(id =="creative"){
    var output = document.getElementById("value2");
  }*/
  if(id == "logical"){
    var output = document.getElementById("value3");
  }
 
  let update = () => output.innerHTML = moodNow.value;
  moodNow.addEventListener('input', update);
  update();
  loadTodos(username);
}


function addTodoFromWebsite(todo){
    var due = document.getElementById("due").value; 
    var desc = document.getElementById("description").value;
    var attention = parseInt(document.getElementById("attentionSpan").value);
    //var creative = parseInt(document.getElementById("creativeDemand").value);
    var physical = parseInt(document.getElementById("physicalDemand").value);    
    let id = storeNewTodo(todo, username, false, due, desc, attention, physical);
    addTodo(todo, due, false, desc, id, attention, physical);
    //we have to clear the values again, otherwise they'll stay like that
    document.getElementById("newTodo").open = false;
    document.getElementById("attentionSpan").value = 50;    
    document.getElementById("physicalDemand").value = 50;
    document.getElementById("description").value = "";

    loadTodos(username);
    
}

// Helpers
function addTodo(todo, due, done, description, id, attention, physical, color="#000") {
    let ul = document.querySelector('ul');
    let li = document.createElement('li');

    li.innerHTML = `
        <details style="color: ${color}">
          <summary>
            <span class="todo-item">${todo}<br><br>${formatDate(due)}</span>            
            <button name="checkButton"><i class="fas fa-square"></i></button>
            <button name="deleteButton" ><i class="fas fa-trash"></i></button>
            <span class="hidden">${id}</span>
          </summary>
          <p>${description.replaceAll("\n", "<br>")}</p>
        </details>
    `;    
    // the buttons are not yet positioned in the right place.
    //li.classList.add(window.localStorage.setItem('todo', 'clean my room'));
    li.classList.add('todo-list-item');
    ul.appendChild(li);
    if(done){
      actuallyCheckTodo(li.children[0].children[0].children[1]); //give the check the checkbutton
    }
}
function addTodo_MoodNotMet(todo, due, done, description, id, attention, physical) {
  addTodo(todo, due, done, description, id, attention, physical, color="#bbb");
}
function addTodo_Today(todo, due, done, description, id, attention, physical) {
  addTodo(todo, due, done, description, id, attention, physical, color="red");
}

/**
 * formats a date string to DD.mm.YYYY
 * @param {date string} due 
 * @returns 
 */
function formatDate(due){
  var date = new Date(due);
  var month = date.getMonth() + 1;
  dateStr = date.getDate() +"."+ month +"." + date.getFullYear();
  return dateStr;
}

//sorting the todos according to the mood
function sortPlanner(){

}

/**
 * stores a new todo in the tasks and stores it
 * @param {the title of the todo} title 
 * @param {username} user 
 * @param {is it done} done 
 * @param {the due date} due 
 * @param {description} description 
 * @param {attention} attention
 *
 * @param {physical} physical
 */
function storeNewTodo(title, user, done, due, description, attention, physical){
  let highestId = 0;
  let priority = today;
  tasks.forEach(todo =>{
    highestId = todo.id > highestId ? todo.id : highestId;
    priority = todo.due >= today ? todo.due : priority;
  })
  
  tasks.push({"id": ++highestId, "title": title, "user": user, "done": done, "due": due, "description": description, "attention": attention, "physical": physical});
  localStorage.setItem("tasks", JSON.stringify(tasks));
  tasks.sort(function (a, b) {
    if (a.due > b.due) return 1;
    if (a.due < b.due) return -1;
    return 0;
   
  });
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
    let id = item.children[3].innerHTML;    
    deleteTodoById(id);
    item.addEventListener('transitionend', function () {
        item.remove(); 
    });

    item.classList.add('todo-list-item-fall');
    item.parentNode.parentNode.remove() //deletes the li element
}

function deleteTodoById(id){
  let newTasks = [];
  let idx = 0;
  tasks.forEach(todo =>{
    if (todo.id != id){
      newTasks[idx++] = todo;
    }
  })
  tasks = newTasks;
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.getElementById('clearAll').addEventListener('click', clearAll);

function handleClearAll(e) {
  document.querySelector('ul').innerHTML = ''; //UI
}

function clearAll(){
  //logic
  if(confirm("Are you sure to delete all your todos?")){
    let lis = document.querySelector('ul').children;    
    for(let i = 0; i< lis.length; i++){
      id = lis[i].children[0].children[0].children[3].innerHTML;        
      deleteTodoById(id);
    }
    loadTodos(username);
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
  username = name;
  //show todays tasks
  let todaysTasks = tasks.filter(todo => todo.due <= date && !todo.done);
  todaysTasks.forEach(todo => {    
    addTodo_Today(todo.title, todo.due, todo.done, todo.description, todo.id, todo.attention, todo.physical);    
  });
  //filter by user
  let histasks = tasks.filter(todo => todo.user == username && !todaysTasks.includes(todo));
  
  //filter by mood met
  let filtered = filterAndSort(histasks)
  filtered.forEach(todo => {    
    addTodo(todo.title, todo.due, todo.done, todo.description, todo.id, todo.attention, todo.physical);    
  });

  //filter by mood not met
  let moodNotMetTasks = histasks.filter(todo => !filtered.includes(todo) && !todaysTasks.includes(todo));
  moodNotMetTasks.sort(customSort);
  moodNotMetTasks.forEach(todo => {    
    addTodo_MoodNotMet(todo.title, todo.due, todo.done, todo.description, todo.id, todo.attention, todo.physical);    
  });
}

/**
 * filters and sorts the tasks by user and the mood 
 * @param {*} filtered the tasks of the user 
 * @returns all tasks of this user and with at least the mood
 */
function filterAndSort(filtered){
  var attention = document.getElementById("physical").value;
  var physical = document.getElementById("logical").value;   
  filtered = filtered.filter(todo => todo.attention >= attention && todo.physical >= physical);
  filtered.sort(customSort); 
  return filtered
}

/**
 * a custom sort function.
 * currently sorts by total demand of the task
 * @param {Todo} todo1 
 * @param {Todo} todo2 
 * @returns 
 */
function customSort(todo1, todo2){  
  let totalDemand1 = todo1.attention + todo1. physical;
  let totalDemand2 = todo2.attention + todo2. physical;
  //put the todos that are done last
  if (todo1.done != todo2.done && todo2.done) return -1;
  if (todo1.done != todo2.done && todo1.done) return 1;
  //sort by mood
  if (totalDemand1<totalDemand2) return 1;
  if (totalDemand1>totalDemand2) return -1;
  //sort by due date last
  if (todo1.due < todo2.due) return 1;
  if (todo2.due < todo2.due) return -1;
  return 0;
}

/**
 * get tasks if not there yet and load usernames
 */
async function loadUsernames(){ 
  await loadTasks().catch((error) => {});  
  let usernames = [];
  tasks.forEach(todo => {
    if (usernames.lastIndexOf(todo.user) == -1){
      usernames.push(todo.user);
    }
  });

  let usernamesMarkup = document.querySelector("select");
  usernamesMarkup.children = [];
  //add choose user default
  let chooseUserOption = document.createElement("option");
  chooseUserOption.value = "Choose User";
  chooseUserOption.innerHTML = "Choose User";
  chooseUserOption.disabled = true;
  chooseUserOption.hidden = true;
  chooseUserOption.selected = true;
  //add new user option
  usernamesMarkup.appendChild(chooseUserOption);
  let newUserOption = document.createElement("option");
  newUserOption.value = "new User";
  newUserOption.innerHTML = "new User";
  usernamesMarkup.appendChild(newUserOption);
  //add users
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
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    else{
      tasks = JSON.parse(localStorage.getItem("tasks"));
      loadedTasks = true;
    }
  }
}