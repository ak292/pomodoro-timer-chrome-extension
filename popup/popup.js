let tasks = [];

// load tasks when popup is opened
chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ? res.tasks : [];
  tasks.forEach((task, index) => {
    addTask(task, index);
  });
});

function saveTasks() {
  chrome.storage.sync.set({ tasks });
}

function addTask(value = "", taskNum = tasks.length) {
  const taskRow = document.createElement("div");
  taskRow.setAttribute("id", `del-${taskNum}`);

  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a task...";
  text.value = value;
  text.addEventListener("change", () => {
    tasks[taskNum] = text.value;
    saveTasks();
    console.log(tasks);
  });

  // create the delete button
  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "X";
  deleteBtn.addEventListener("click", () => {
    const currentIndex = tasks.indexOf(text.value);
    if (currentIndex !== -1) {
      tasks.splice(currentIndex, 1);
      saveTasks();
    }

    const rowToDelete = document.getElementById(`del-${taskNum}`);
    rowToDelete.remove();
    console.log(tasks);
  });

  // append the input and delete button to the task row
  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  // append the task row to the container
  const taskContainer = document.getElementById("task-container");
  taskContainer.appendChild(taskRow);
}

// add a new task when the "Add Task" button is clicked
const addTaskBtn = document.getElementById("add-task-btn");
addTaskBtn.addEventListener("click", () => {
  tasks.push("");
  addTask();
  saveTasks();
});
