const addTaskBtn = document.getElementById("add-task-btn");
addTaskBtn.addEventListener("click", () => addTask());

function addTask() {
  // create a div
  const taskRow = document.createElement("div");

  // create the input
  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a task...";

  // create the delete button
  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "X";

  // append them to the div
  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  // each row we add is now its own div with an input
  // and a delete button, then we add to the taskContainer
  const taskContainer = document.getElementById("task-container");
  taskContainer.appendChild(taskRow);
}
