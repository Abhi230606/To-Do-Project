console.log("✅ Script loaded");

const addTaskBtn = document.getElementById("add-task");
const taskInput = document.getElementById("task-input");
const deadlineInput = document.getElementById("deadline-input");
const categorySelect = document.getElementById("category-select");
const prioritySelect = document.getElementById("priority-select");
const quoteBox = document.getElementById("quote-box");
const streakDisplay = document.getElementById("streak");
const resetStreakBtn = document.getElementById("reset-streak");

const quotes = [
  "💡 Keep pushing forward!",
  "🔥 Small steps lead to big results!",
  "🚀 You’re stronger than you think!",
  "🌟 Progress, not perfection!",
  "💪 Great job! Keep the momentum!"
];

// Streak system
let streakCount = parseInt(localStorage.getItem("streak")) || 0;
updateStreak();

// Load tasks
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
    if (e.target.classList.contains("delete-btn")) return; // don't trigger on delete
    li.classList.toggle("completed");
    if (li.classList.contains("completed")) {
      showQuote();
      increaseStreak();
      triggerConfetti();
    } else {
      resetStreakValue(); // if unchecked, streak resets
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

  sortTasksByDeadline(ul);
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

// Sort by deadline
function sortTasksByDeadline(ul) {
  const tasks = Array.from(ul.children);
  tasks.sort((a, b) => new Date(a.dataset.deadline) - new Date(b.dataset.deadline));
  tasks.forEach(task => ul.appendChild(task));
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

// 🎉 Confetti effect
function triggerConfetti() {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: Math.random(), y: 0 }
    }));
  }, 250);
}

// Streak functions
function increaseStreak() {
  streakCount++;
  localStorage.setItem("streak", streakCount);
  updateStreak();

  if (streakCount % 10 === 0) {
    // Special big celebration
    triggerConfetti();
    alert(`🎉 Amazing! You’ve reached a ${streakCount}-task streak!`);
  }
}

function resetStreakValue() {
  streakCount = 0;
  localStorage.setItem("streak", streakCount);
  updateStreak();
}

function updateStreak() {
  streakDisplay.textContent = `🔥 Streak: ${streakCount}`;
}

// Reset streak button
resetStreakBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset your streak to 0?")) {
    resetStreakValue();
    alert("🔄 Streak has been reset to 0.");
  }
});
