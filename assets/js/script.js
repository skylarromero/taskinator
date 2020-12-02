var formE1 = document.querySelector("#task-form");
var tasksToDoE1 = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentE1 = document.querySelector("#page-content");
var taskInProgressE1 = document.querySelector("#tasks-in-progress");
var tasksCompletedE1 = document.querySelector("#tasks-completed");

var taskFormHandler = function(event) {

    event.preventDefault();
    var taskNameInput = document.querySelector( "input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    formE1.reset();
    var isEdit = formE1.hasAttribute("data-task-id");

    if (isEdit) {
        var taskId = formE1.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };
        createTaskE1(taskDataObj);
    }
    
    
    
    
};
var createTaskE1 = function(taskDataObj) {
    var listItemE1 = document.createElement("li");
    listItemE1.className = "task-item";

    listItemE1.setAttribute("data-task-id", taskIdCounter);
    listItemE1.setAttribute("draggable","true");
    var taskInfoE1 = document.createElement("div");
    taskInfoE1.className = "task-info";
    taskInfoE1.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type +"</span>";
    listItemE1.appendChild(taskInfoE1);
    var taskActionE1 = createTaskActions(taskIdCounter);
    listItemE1.appendChild(taskActionE1);
    

    tasksToDoE1.appendChild(listItemE1);

    taskIdCounter++;

}

var createTaskActions = function(taskId) {
    var actionContainerE1 = document.createElement("div");
    actionContainerE1.className = "task-actions";
    // edit button
    var editButtonE1 = document.createElement("button");
    editButtonE1.textContent = "Edit";
    editButtonE1.className = "btn edit-btn";
    editButtonE1.setAttribute("data-task-id", taskId);

    actionContainerE1.appendChild(editButtonE1);

    // delete button
    var deleteButtonE1 = document.createElement("button");
    deleteButtonE1.textContent = "Delete";
    deleteButtonE1.className = "btn delete-btn";
    deleteButtonE1.setAttribute("data-task-id", taskId);

    actionContainerE1.appendChild(deleteButtonE1);

    var statusSelectE1 = document.createElement("select");
    statusSelectE1.className = "select-status";
    statusSelectE1.setAttribute("name", "status-change");
    statusSelectE1.setAttribute("data-task-id", taskId);

    actionContainerE1.appendChild(statusSelectE1);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i=0; i <statusChoices.length; i++) {
        // option element
        var statusOptionE1 = document.createElement("option");
        statusOptionE1.textContent = statusChoices[i];
        statusOptionE1.setAttribute("value", statusChoices[i]);

        statusSelectE1.appendChild(statusOptionE1);
    }

    return actionContainerE1;

};

var taskButtonHandler = function(event) {
    var targetE1 = event.target;
    
    if (targetE1.matches(".edit-btn")) {
        var taskId = targetE1.getAttribute("data-task-id");
        editTask(taskId);
    }

    else if ( targetE1.matches(".delete-btn")) {
        var taskId = targetE1.getAttribute("data-task-id");
        deleteTask(taskId);
    }

};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    
};

var editTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    document.querySelector("input[name='task-name']").value = taskName;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formE1.setAttribute("data-task-id", taskId);
}

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");
    formE1.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    var statusValue = event.target.value.toLowerCase();
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoE1.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        taskInProgressE1.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedE1.appendChild(taskSelected);
    }

}

var dragTaskHandler = function(event) {
   var taskId = event.target.getAttribute("data-task-id");
   event.dataTransfer.setData("text/plain", taskId);
   var getId = event.dataTransfer.getData("text/plain");
   console.log("getId:", getId, typeof getId);
}

var dropZoneDragHandler = function(event) {
    var taskListE1 = event.target.closest(".task-list");
    if (taskListE1) {
        event.preventDefault();
        
    }
}

var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneE1 = event.target.closest(".task-list");
    var statusType = dropZoneE1.id;
    var statusSelectE1 = draggableElement.querySelector("select[name='status-change']");
    if (statusType === "tasks-to-do") {
        statusSelectE1.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectE1.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectE1.selectedIndex = 2;
    }
    dropZoneE1.appendChild(draggableElement);
}
formE1.addEventListener("submit", taskFormHandler);
pageContentE1.addEventListener("click", taskButtonHandler);
pageContentE1.addEventListener("change", taskStatusChangeHandler);
pageContentE1.addEventListener("dragstart", dragTaskHandler);
pageContentE1.addEventListener("dragover", dropZoneDragHandler);
pageContentE1.addEventListener("drop", dropTaskHandler);