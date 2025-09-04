console.log("✅ Script loaded");

const addTaskBtn = document.getElementById("add-task");
const taskInput = document.getElementById("task-input");
const deadlineInput = document.getElementById("deadline-input");
const categorySelect = document.getElementById("category-select");
const prioritySelect = document.getElementById("priority-select");
const quoteBox = document.getElementById("quote-box");

const quotes = [
  "💡 Keep pushing forward!",
  "🔥 Small steps lead to big results!",
  "🚀 You’re stronger than you think!",
  "🌟 Progress, not perfection!",
  "💪 Great job! Keep the momentum!"
];

// Load tasks from localStorage
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(t => renderTask(t.text, t.category, t.priority, t.completed, t.deadline));
};

// Add task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const category = categorySelect.value;
  const priority = prioritySelect.value;
  const deadline = deadlineInput.value;

  if (!text || !deadline) return;

  renderTask(text, category, priority, false, deadline);
  saveTasks();

  taskInput.value = "";
  deadlineInput.value = "";
});

// Format deadline
function formatDeadline(deadline) {
  return deadline.replace("T", " ");
}

// Render task
function renderTask(text, category, priority, completed, deadline) {
  const ul = document.getElementById(`${category}-list`);
  if (!ul) return;

  const li = document.createElement("li");
  li.innerHTML = `- ${text} (Deadline: ${formatDeadline(deadline)})`;

  li.dataset.priority = priority;
  li.dataset.deadline = deadline;
  if (completed) li.classList.add("completed");

  // Toggle completion
  li.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) return;
    li.classList.toggle("completed");
    if (li.classList.contains("completed")) {
      showQuote();
    }
    saveTasks();
  });

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️";
  delBtn.classList.add("delete-btn");
  delBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  li.appendChild(delBtn);
  ul.appendChild(li);
}

// Save tasks
function saveTasks() {
  const allTasks = [];
  document.querySelectorAll(".category ul li").forEach(li => {
    allTasks.push({
      text: li.textContent.split("(")[0].replace("-", "").trim(),
      category: li.closest(".category").classList[1],
      priority: li.dataset.priority,
      completed: li.classList.contains("completed"),
      deadline: li.dataset.deadline
    });
  });
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

// Show motivational quote
function showQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteBox.textContent = randomQuote;
  quoteBox.style.display = "block";
  setTimeout(() => {
    quoteBox.style.display = "none";
  }, 4000);
}
