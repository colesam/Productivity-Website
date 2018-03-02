/*global localStorage*/

//  GLOBAL VARIABLES
var storeLocally = typeof(Storage) !== "undefined" && typeof(localStorage.tasks) !== "undefined";

/*  initialize global arrays
        tasks:      holds every task object
        tasksP:     holds the tasks objects but is immune from sorting methods, preserving original order
        categories: holds every category object
*/
var tasks       = [];
var tasksP      = []
var categories  = [new Category("Chore", "FFF07C"), new Category("School", "EF626C"), new Category("Girlfriend", "5FAD41"), new Category("Hobby", "84DCCF")];

//  if there is localStorage then retrieve the values and parse
if(storeLocally) { tasks        = JSON.parse(localStorage.tasks) }
if(storeLocally) { tasksP       = JSON.parse(localStorage.tasksP) }
if(storeLocally) { categories   = JSON.parse(localStorage.categories) }

//  to preserve the task function delete(), I need to reconstruct the objects after JSON parse
if(storeLocally) {
    
    tasks.forEach(function(task, i, tasks) {
        
        //  call the constructor for each task
        tasks[i] = new Task(task.name, task.date, task.category.name, task.isComplete);
        
    });
    
    tasksP.forEach(function(task, i, tasksP) {
        
        //  call the constructor for each task
        tasksP[i] = new Task(task.name, task.date, task.category.name, task.isComplete);
        
    });
    
}

var sortMode    = 0;
var sorts       = [];
var canvas;


//  OBJECTS
/*  CATEGORY OBJECT
        this object is a category that can be attached to a task
    
        object variables
            name:           String representing the name of the category
            hex:            String representing six character hex code (no #)
            count:          int representing the number of associated tasks
    
        object functions
            Category:       constructor method to create a new instance of a category
                                see object variables for function param descriptions
*/
function Category(name, hex) {
    
    this.name   = name;
    this.hex    = hex;
    this.count  = 0;
    
}

/*  TASK OBJECT
        this object is a task located on the to do list
    
        object variables
            name:           String representing the task itself
            date:           String representing due date of the task
            category:       Category variable representing the category of the task
    
        object functions
            Task:           constructor method to create a new instance of a task
                                see object variables for function param descriptions
                                
            delete:         removes the object who called this method from the tasks array
*/
function Task(name, date, category, isComplete) {
    
    this.name       = name;
    this.date       = date;
    this.category   = findCategoryByName(category);
    this.isComplete = isComplete;
    
}

Task.prototype.delete = function() {
    
    var newTasks = [];
    var toDelete = this;
    
    //  update category count for pie chart
    toDelete.category.count--;
    
    //  add every task into the newTasks array except for "this"
    tasks.forEach(function(task) {
        
        if(!(task.name == toDelete.name && task.date == toDelete.date && task.category == toDelete.category)) {
            
            newTasks.push(task);
            
        }
        
    });
    
    //  update tasks array and GUI
    tasks = newTasks;
    updateGUI();
    
}


//  FUNCTIONS

/*  createTask(String name, String date, String category)
    creates a new instance of the task object, pushes it to tasks array, and updates the display
*/
function createTask(name, date, category) {
    
    //  create new task and push to arrays (regular and preserved)
    var task = new Task(name, date, category, false);
    tasks.push(task);
    tasksP.push(task);
    
    //  update category count
    task.category.count++;
    
    //  update the display
    updateGUI();
    
}

/*  findTaskByName(String name)
    search tasks array for category matching name, return Category obj if found, null otherwise
*/
function findTaskByName(name) {
    
    //  if there is no match, null will be returned
    var retTask = null;
    
    //  cycle through tasks looking for a match
    tasks.forEach(function(task) {
        
        if(task.name == name) { retTask = task; }
        
    });
    
    return retTask;
    
}

/*  createCategory(String name, String hex)
    creates a new instance of the task object, pushes it to tasks array, and updates the display
*/
function createCategory(name, hex) {
    
    //  create category and push to the categories array
    var category = new Category(name, hex.toUpperCase());
    categories.push(category);
    
    //  update the display
    updateGUI();
    
}

/*  findCategoryByName(String name)
    search categories array for category matching name, return Category obj if found, null otherwise
*/
function findCategoryByName(name) {

    //  if there is no match, null will be returned
    var retCategory = null;
    
    //  cycle through categories looking for a match
    categories.forEach(function(category) {
        
        if(category.name == name) { retCategory = category; }
        
    });
    
    return retCategory;
        
}

/*  findCategoryByHex(String hex)
    search categories array for category matching hex value (no #), return Category obj if found, null otherwise
*/
function findCategoryByHex(hex) {
    
    //  if there is no match, null will be returned
    var retCategory = null;
    hex = hex.toUpperCase();
    
    //  cycle through categories array looking for a match
    categories.forEach(function(category) {
        
        if(category.hex == hex) { retCategory = category; }
        
    });
    
    return retCategory;
        
}

/*  validateTask(String name, String date, String category)
    validates the parameters and returns true if they are valid, false otherwise
        1. name must be greater than or equal to 3 characters long, must be unique
        2. date cannot be null and must follow format: MM-DD-YYYY 
            a) note:    at this moment in time it is possible to enter fictitious dates (21-68-3000),
                        but as long as it passes the RegEx it will not break any sorting algorithms
        3. category cannot be null and must be in category array
*/
function validateTask(name, date, category) {
    
    var valid = true;
    
    // regex for testing valid date
    var regex = new RegExp("^[0-9]{2}\-[0-9]{2}\-[0-9]{4}$");  
    
    //  name must be greater than or equal to 3 characters long
    (name == null || name.length < 3) ? valid = false : valid = valid;
    
    //  name must be unique
    (!(findTaskByName(name) == null)) ? valid = false : valid = valid;
    
    //  date cannot be null
    (date == null) ? valid = false : valid = valid;
    
    //  date must be in 
    (!regex.test(date)) ? valid = false: valid = valid;
    
    //  category cannot be null and must be in categories array
    (category == null || findCategoryByName(category) == null) ? valid = false : valid = valid;
    
    return valid;
    
}

/*  validateCategory(String name, String hex)
    validates the parameters and returns true if they are valid, false otherwise
        1. name must be greater than or equal to 5 characters long, must be unique
        2. hex cannot be null, must be valid 6 character hex code, must be unique
*/
function validateCategory(name, hex) {
    
    var valid = true;
    hex = hex.toUpperCase();
    
    // regex for testing valid 6 character hex code
    var regex = new RegExp("[A-F0-9]{6}");   
    
    //  name must be greater than or equal to 5 characters long
    (name == null || name.length < 5) ? valid = false : valid = valid;
    
    //  name must be unique
    (findCategoryByName(name) != null) ? valid = false: valid = valid;
    
    //  hex must be valid 6 character hex code, not null
    (hex == null || !(regex.test(hex))) ? valid = false : valid = valid;
    
    //  hex must be unique
    (findCategoryByHex(hex) != null) ? valid = false: valid = valid;
    
    return valid;
    
}

/*  loadPieChart()
    uses tasks array to create a pie chart using canvas
*/
function loadPieChart() {
    
    //  set up canvas
    var ctx         = canvas.getContext("2d");
    var radius      = Math.min(canvas.width, canvas.height) / 2; //  radius will be based off the shorter side
    var position    = 0;
    
    //  clear previous canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //  get sum of all category counts
    var sum = 0;
    categories.forEach(function(category) {
        
        sum += category.count;
        
    });
    
    //  fill the pie chart according to category counts
    categories.forEach(function(category) {
        
        if(category.count > 0) {
            
            //  calculate the angle of this slice
            var angle = Math.PI * 2 * (category.count / sum);
            
            //  draw the slice
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);    //  move to the center
            ctx.arc(canvas.width / 2, canvas.height / 2, radius, position, position + angle);
            ctx.lineTo(canvas.width / 2, canvas.height / 2);    //  draw line to the center
            ctx.fillStyle = "#" + category.hex;
            ctx.fill();
            position += angle;
        
        }
        
    });
    
}

/*  storeLocal()
    use JSON to stringify the three global arrays and store them in the localStorage object
*/
function storeLocal() {
        
        localStorage.tasks = JSON.stringify(tasks);
        localStorage.tasksP = JSON.stringify(tasksP);
        localStorage.categories = JSON.stringify(categories);
    
}

/*  updateGUI()
    use the tasks and categories array to refresh the interface on the page
    this function is called almost every time a change to one of the three global arrays is made
    steps:
        1.  delete all of the tasks and categories in DOM
        2.  recreate all of the task HTML elements based off of tasks array and append
        3.  recreate all of the category HTML elements based off of categories array and append
        4.  reload the pie chart
        5.  store the three global arrays locally - this was a very convenient place to put this call
            because updateGUI() is called whenever there is a change to the three global arrays
*/
function updateGUI() {
    
    //  delete all tasks and categories
    document.querySelectorAll(".task").forEach(function(task) {
        
        task.remove();
        
    });
    
    document.querySelectorAll(".category").forEach(function(category) {
        
        category.remove();
        
    });
    
    document.querySelectorAll("option").forEach(function(option) {
        
        option.remove();
        
    });
    
    //  recreate default option for the category select field in the task creation form
    var option = document.createElement("option");
    option.innerHTML = "Select Category";
    option.value = "";
    option.selected = "selected";
    document.querySelector("#category").appendChild(option);
    
    //  replace all tasks and categories
    tasks.forEach(function(task) {

        var taskElement, deleteElement, checkboxElement, nameElement, dateElement, indicatorElement;
        
        //  create task element
        taskElement = document.createElement("div");
        taskElement.classList.add("row", "task");
        
        //  create button for deleting task
        deleteElement = document.createElement("i");
        deleteElement.classList.add("fas", "fa-trash", "transitions");
        taskElement.appendChild(deleteElement);
        
        //  create checkbox to mark for completion
        checkboxElement = document.createElement("div");
        checkboxElement.classList.add("checkbox", "transitions");
        if(task.isComplete){ checkboxElement.classList.add("complete"); }
        taskElement.appendChild(checkboxElement);
        
        //  add the name of the task in a paragraph tag
        nameElement = document.createElement("p");
        nameElement.innerHTML = task.name;
        taskElement.appendChild(nameElement);
        
        //  add the date of the task in a paragraph tag
        dateElement = document.createElement("p");
        dateElement.classList.add("date");
        dateElement.innerHTML = task.date;
        taskElement.appendChild(dateElement);
        
        //  add the category color indicator element
        indicatorElement = document.createElement("div");
        indicatorElement.classList.add("category-indicator", "align-self-stretch");
        indicatorElement.style.background = "#" + task.category.hex;
        taskElement.appendChild(indicatorElement);
        
        //  append the new element to the tasks display
        document.querySelector(".tasks .display").appendChild(taskElement);
        
        //  add event listener to the trashcan icon
        deleteElement.addEventListener("click", function() { confirmDelete(task); });
        
        //  add event listener to checkbox
        checkboxElement.addEventListener("click", function() {
            
            //  toggle complete class
            this.classList.toggle("complete");
            
            //  flip the task's complete variable
            (task.isComplete) ? task.isComplete = false : task.isComplete = true;
            
            //  update the localStorage
            storeLocal();

        });
        
    });
    
    categories.forEach(function(category) {
        
        var categoryElement, nameElement, indicatorElement, optionElement;
        
        //  create category element
        categoryElement = document.createElement("div");
        categoryElement.classList.add("row", "category");
        
        //  create category name in paragraph tag
        nameElement = document.createElement("p");
        nameElement.innerHTML = category.name;
        categoryElement.appendChild(nameElement);
        
        //  create category color indicator div
        indicatorElement = document.createElement("div");
        indicatorElement.classList.add("category-indicator", "align-self-stretch");
        indicatorElement.style.background = "#" + category.hex;
        categoryElement.appendChild(indicatorElement);
        
        //  append new element to the tools display
        document.querySelector(".tools .display").appendChild(categoryElement);
        
        //  create an option for the task creation form
        optionElement = document.createElement("option");
        optionElement.innerHTML = category.name;
        optionElement.value = category.name;
        document.querySelector("#category").appendChild(optionElement);
        
    });
    
    //  final function calls
    loadPieChart();
    storeLocal();
    
}

/*  confirmDelete()
    display deletion confirmation message that will either delete or leave the task
    where it is in the list
*/
function confirmDelete(task) {
    
    //  display the message
    var message = document.querySelector(".confirmation-display");
    message.classList.remove("hidden");
    
    //  if delete button is clicked, call the delete method and exit out of message
    document.querySelector(".btn-confirm").addEventListener("click", function() { 
        
        task.delete(); 
        message.classList.add("hidden"); 
        
    });
    
    //  if the cancel button is clicked, exit out of warning message
    document.querySelector(".btn-cancel").addEventListener("click", function() { message.classList.add("hidden"); });
    
}

/*  sort(int mode)
    sort the tasks by specifying a mode (int)
        1. sort by the task's name (case insensitive)
        2. sort by the task's category
        3. sort by the task's date
        4. sort by the task's completeness
        default: sort by the date added
*/
function sort(mode) {

    switch(mode) {
        
        case 1:
            //  sort by task name
            tasks.sort(function(a, b) {
                
                return a.name.localeCompare(b.name);
                
            }); 
            break;
        
        case 2:
            //  sort by task's category
            tasks.sort(function(a, b) {
                
                return a.category.name.localeCompare(b.category.name);
                
            });
            break;
            
        case 3:
            //  sort by task date
            tasks.sort(function(a, b) {
                
                var dateA = {
                    
                    day:    parseInt(a.date.substr(0, 2)),
                    month:  parseInt(a.date.substr(3, 2)),
                    year:   parseInt(a.date.substr(6))
                    
                }
                
                var dateB = {
                    
                    day:    parseInt(b.date.substr(0, 2)),
                    month:  parseInt(b.date.substr(3, 2)),
                    year:   parseInt(b.date.substr(6))
                    
                }
                
                //  sort by day
                if(dateA.year == dateB.year && dateA.month == dateB.month) { return dateA.day - dateB.day; }
                
                //  sort by month
                if(dateA.year == dateB.year) { return dateA.month - dateB.month }
                
                //  sort by year
                return dateA.year - dateB.year;
                
            });
        
        case 4:
            //  sort by completeness
            tasks.sort(function(a, b) {
                
                if(a.isComplete == b.isComplete) { 
                    
                    return 0; 
                    
                } else if(a.isComplete) {
                    
                    return -1;
                    
                } else {
                    
                    return 1;
                    
                }
                
            });
            break;    
        
        case 5:
            //  sort by original order (just update with tasksP array)
            tasks = tasksP;
            break;
            
        default:
            console.log("Hit default case in sort(mode) method");
    }
    
    //  update the display
    updateGUI();
    
}

c
function load() {
    
    //  DOM DEPENDENT VARIABLES
    //  set up canvas
    canvas          = document.querySelector("canvas");

    
    //  FUNCTION CALLS AND MISC
    //  update the GUI right away
    updateGUI();
    
    //  show task creation form if there are no tasks
    if(tasks.length == 0) { document.querySelector(".tasks .form-new").classList.remove("hidden"); }
    
    
    //  EVENT LISTENERS
    //  display the task creation form
    document.querySelector(".tasks .fa-plus").addEventListener("click", function() {
        
        document.querySelector(".tasks .form-new").classList.remove("hidden");
        
    });
    
    //  display the category creation form
    document.querySelector(".tools .fa-plus").addEventListener("click", function() {
        
        document.querySelector(".tools .form-new").classList.remove("hidden");
        
    });
    
    //  create new task and close task creation form
    document.querySelector(".tasks .form-new button").addEventListener("click", function() {
        
        //  get the data from the create form
        var name        = document.querySelector("#name").value;
        var date        = document.querySelector("#date").value;
        var category    = document.querySelector("#category").value;
        
        //  validate the data
        if(validateTask(name, date, category)) {
            
            //  create new task
            createTask(name, date, category);
            
            //  close task creation form
            document.querySelector(".tasks .form-new").classList.add("hidden");
            
        }
        
    });
    
    //  create new category and close category creation form
    document.querySelector(".tools .form-new button").addEventListener("click", function() {
        
        //  get the data from the create form
        var name    = document.querySelector("#cat_name").value;
        var hex     = document.querySelector("#hex").value;
        
        //  strip leading #
        if(hex.charAt(0) == "#") {
            
            hex = hex.substr(1, 6);
            
        }
        
        //  validate the data
        if(validateCategory(name, hex)) {
            
            //  create new category
            createCategory(name, hex);
            
            //  close category creation form
            document.querySelector(".tools .form-new").classList.add("hidden");
            
        }
        
    });
    
    //  get the sorter elements
    sorts = document.querySelectorAll(".sort");
    
    //  define a mode for each sort element
    for(var i = 0; i < 5; i++) {
        
        sorts[i]["mode"] = i + 1;
        
    }
    
    sorts.forEach(function(element) {
        element.addEventListener("click", function() {
            //  remove active class from all sorts
            sorts.forEach(function(element) {
                
              element.classList.remove("active");
                
            });
            
            //  add active tag and sort the tasks, i acts as the mode parameter
            this.classList.add("active");
            sort(this.mode);
        });
    });
    
}