//  VARIABLES
var tasks       = [];
var categories  = [new Category("Chore", "FFF07C"), new Category("School", "EF626C"), new Category("Girlfriend", "5FAD41"), new Category("Hobby", "84DCCF")];
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
*/

function Task(name, date, category) {
    
    this.name       = name;
    this.date       = date;
    this.category   = category;
    
    //  functions
    this.delete = function() {
        
        var newTasks = [];
        var toDelete = this;
        
        toDelete.category.count--;
        
        tasks.forEach(function(task) {
            
            if(!(task.name == toDelete.name && task.date == toDelete.date && task.category == toDelete.category)) {
                
                newTasks.push(task);
                
            }
            
        });
        
        tasks = newTasks;
        updateGUI();
        
    }
    
}


//  FUNCTIONS

/*  createTask(String name, String date, String category)
    creates a new instance of the task object, pushes it to tasks array, and updates the display
*/
function createTask(name, date, category) {
    
    //  find category
    category = findCategoryByName(category);
    
    //  create new task and push to array
    var task = new Task(name, date, category);
    tasks.push(task);
    
    //  update category count
    category.count++;
    
    //  update the display
    updateGUI();
    
}

/*  createCategory(String name, String hex)
    creates a new instance of the task object, pushes it to tasks array, and updates the display
*/
function createCategory(name, hex) {
    
    var category = new Category(name, hex.toUpperCase());
    categories.push(category);
    
    //  update the display
    updateGUI();
    
}

/*  findCategoryByName(String name)
    search categories array for category matching name, return Category obj if found, null otherwise
*/
function findCategoryByName(name) {
        
    var retCategory = null;
    
    categories.forEach(function(category) {
        
        if(category.name == name) {
            
            retCategory = category;
            
        }
        
    });
    
    return retCategory;
        
}

/*  findCategoryByHex(String hex)
    search categories array for category matching hex value (no #), return Category obj if found, null otherwise
*/
function findCategoryByHex(hex) {
        
    var retCategory = null;
    hex = hex.toUpperCase();
    
    categories.forEach(function(category) {
        
        if(category.hex == hex) {
            
            retCategory = category;
            
        }
        
    });
    
    return retCategory;
        
}

/*  validateTask(String name, String date, String category)
    validates the parameters and returns true if they are valid, false otherwise
        1. name must be greater than or equal to 5 characters long
        2. date cannot be null
        3. category cannot be null and must be in category array
*/
function validateTask(name, date, category) {
    
    var valid = true;
    
    //  name must be greater than or equal to 5 characters long
    (name == null || name.length < 5) ? valid = false : valid = valid;
    
    //  date cannot be null
    (date == null) ? valid = false : valid = valid;

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
    
    //  get sum of all data
    var sum = 0;
    categories.forEach(function(category) {
        
        sum += category.count;
        
    });
    
    //  fill the pie chart
    categories.forEach(function(category) {
        
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);    //  move to the center
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, position, position + (Math.PI * 2 * (category.count / sum)));
        ctx.lineTo(canvas.width / 2, canvas.height / 2);    //  draw line to the center
        ctx.fillStyle = "#" + category.hex;
        ctx.fill();
        position += (Math.PI * 2 * (category.count / sum));
        
    });
    
}

/*  updateGUI()
    uses tasks and categories arrays to update the GUI
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
    
    //  recreate default option
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
        deleteElement.addEventListener("click", function() {
            
            //  delete the current task
            task.delete();
            
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
    
    loadPieChart();
    
}

/*  load()
    executes when the body of index.html has been loaded
*/
function load() {
    
    //  DOM DEPENDENT VARIABLES
    //  set up canvas
    canvas          = document.querySelector("canvas");
    // var ctx         = canvas.getContext("2d");
    // var ratio       = window.devicePixelRatio;
    // var old_width   = canvas.width;
    // var old_height  = canvas.height;
    
    // canvas.width = old_width * ratio;
    // canvas.style.width = old_width + "px";
    
    // canvas.height = old_height * ratio;
    // canvas.style.height = old_height + "px";
    
    // ctx.scale(ratio, ratio);
    
    //  FUNCTION CALLS
    
    updateGUI();
    
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
    
}

