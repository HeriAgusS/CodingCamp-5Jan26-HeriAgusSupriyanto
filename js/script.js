let todos = [];
let currentFilter = "all";
let sortAscending = true;

// DOM Elements
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-btn");
const todoBody = document.getElementById("todo-body");
const searchInput = document.getElementById("search-input");
const errorMsg = document.getElementById("error-msg");
const emptyState = document.getElementById("empty-state");

// Theme Switcher
function changeTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("has-theme", theme);
}
changeTheme(localStorage.getItem("has-theme") || "light");

// --- CRUD LOGIC ---

function updateStats() {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("stat-total").innerText = total;
  document.getElementById("stat-completed").innerText = completed;
  document.getElementById("stat-pending").innerText = total - completed;
  document.getElementById("stat-progress").innerText = `${progress}%`;

  document.getElementById("total-tasks").innerText = `Total: ${total} Tugas`;
  document.getElementById(
    "completed-tasks"
  ).innerText = `Selesai: ${completed}`;
}

function addTodo() {
  if (!todoInput.value || !dateInput.value) {
    errorMsg.innerText = "Isi tugas dan tanggal!";
    return;
  }
  errorMsg.innerText = "";
  todos.push({
    id: Date.now(),
    task: todoInput.value,
    date: dateInput.value,
    completed: false,
    subtasks: [], // Inisialisasi array subtasks
  });
  todoInput.value = "";
  renderTodos();
}

// Fungsi Subtask baru
function addSubtask(parentId) {
  const subtaskName = prompt("Masukkan nama subtask:");
  if (subtaskName) {
    const todo = todos.find((t) => t.id === parentId);
    todo.subtasks.push({
      id: Date.now(),
      text: subtaskName,
      completed: false,
    });
    renderTodos();
  }
}

// Perbaikan fungsi Edit (Nama & Tanggal)
function editTodo(id) {
  const todo = todos.find((t) => t.id === id);
  const newName = prompt("Edit Nama Tugas:", todo.task);
  if (newName === null) return; // User cancel

  const newDate = prompt("Edit Tanggal (YYYY-MM-DD):", todo.date);
  if (newDate === null) return;

  todo.task = newName || todo.task;
  todo.date = newDate || todo.date;
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  todo.completed = !todo.completed;
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  renderTodos();
}

function deleteAll() {
  if (confirm("Hapus semua tugas?")) {
    todos = [];
    renderTodos();
  }
}

function setFilter(f) {
  currentFilter = f;
  renderTodos();
}
function toggleSort() {
  sortAscending = !sortAscending;
  renderTodos();
}

function renderTodos() {
  const term = searchInput.value.toLowerCase();
  let filtered = todos.filter((t) => {
    const match = t.task.toLowerCase().includes(term);
    if (currentFilter === "completed") return t.completed && match;
    if (currentFilter === "pending") return !t.completed && match;
    return match;
  });

  filtered.sort((a, b) =>
    sortAscending
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date)
  );

  todoBody.innerHTML = "";
  updateStats();

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    filtered.forEach((todo) => {
      const row = document.createElement("tr");
      row.className =
        "hover:bg-base-200/40 transition-all border-b border-base-100";

      // Subtasks HTML
      const subtasksHtml = todo.subtasks
        .map(
          (st) => `
                <div class="flex items-center gap-2 mt-1 ml-4 opacity-70 text-[11px]">
                    <i class="fa-solid fa-caret-right"></i> ${st.text}
                </div>
            `
        )
        .join("");

      row.innerHTML = `
                <td class="px-8 py-5">
                    <div class="font-bold ${
                      todo.completed
                        ? "line-through opacity-30 italic"
                        : "text-base-content/80"
                    }">
                        ${todo.task}
                    </div>
                    ${subtasksHtml}
                </td>
                <td class="px-8 py-5 text-xs opacity-50 font-medium">${
                  todo.date
                }</td>
                <td class="px-8 py-5 text-center">
                    <button onclick="toggleTodo(${todo.id})" class="badge ${
        todo.completed ? "badge-success" : "badge-warning"
      } border-none font-bold p-3 cursor-pointer hover:scale-105 transition-transform">
                        ${todo.completed ? "Completed" : "Pending"}
                    </button>
                </td>
                <td class="px-8 py-5">
                    <div class="flex justify-end gap-1">
                        <button onclick="addSubtask(${
                          todo.id
                        })" class="btn btn-circle btn-xs bg-info/20 text-info border-none hover:bg-info hover:text-white" title="Add Subtask">
                            <i class="fa-solid fa-plus scale-75"></i>
                        </button>
                        <button onclick="editTodo(${
                          todo.id
                        })" class="btn btn-circle btn-xs bg-warning/20 text-warning border-none hover:bg-warning hover:text-white" title="Edit Task">
                            <i class="fa-solid fa-pen scale-75"></i>
                        </button>
                        <button onclick="deleteTodo(${
                          todo.id
                        })" class="btn btn-circle btn-xs bg-error/20 text-error border-none hover:bg-error hover:text-white" title="Delete">
                            <i class="fa-solid fa-trash scale-75"></i>
                        </button>
                    </div>
                </td>
            `;
      todoBody.appendChild(row);
    });
  }
}

addBtn.addEventListener("click", addTodo);
searchInput.addEventListener("input", renderTodos);
renderTodos();
