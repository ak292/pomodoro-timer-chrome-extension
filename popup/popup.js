let tasks = [];

/* the timer increments every second using the
background service worker, here we just grab
the value and make use of it for popup */
function updateTime() {
  chrome.storage.local.get(["timer"], (res) => {
    const time = document.getElementById("time");
    const minutes = `${25 - Math.ceil(res.timer / 60)}`.padStart(2, "0");
    let seconds = "00";
    if (res.timer % 60 != 0) {
      seconds = 60 - (res.timer % 60);
    }
    time.textContent = `${minutes}:${seconds}`;
  });
}

updateTime();
setInterval(updateTime, 1000);

const startTimerBtn = document.getElementById("start-timer-btn");

// simple function to make sure button text content is consistent
// whenever user closes the popup and opens it up again
function checkButton() {
  chrome.storage.local.get("isRunning", (res) => {
    if (res.isRunning) {
      startTimerBtn.textContent = "Pause Timer";
    }
  });
}

// run function everytime user opens popup
checkButton();

startTimerBtn.addEventListener("click", () => {
  chrome.storage.local.get("isRunning", (res) => {
    chrome.storage.local.set(
      {
        isRunning: !res.isRunning,
      },
      () => {
        startTimerBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer";
      }
    );
  });
});

const resetTimerBtn = document.getElementById("reset-timer-btn");
resetTimerBtn.addEventListener("click", () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      startTimerBtn.textContent = "Start Timer";
    }
  );
});

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
