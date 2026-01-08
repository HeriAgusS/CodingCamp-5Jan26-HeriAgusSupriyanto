// State aplikasi
let todos = [];

// Seleksi Elemen
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const filterInput = document.getElementById("filter-input");
const errorMsg = document.getElementById("error-msg");

// Fungsi: Tambah Tugas
function addTodo() {
  const taskValue = todoInput.value.trim();
  const dateValue = dateInput.value;

  // Validasi
  if (!taskValue || !dateValue) {
    errorMsg.textContent = "Kolom teks dan tanggal wajib diisi!";
    return;
  }

  errorMsg.textContent = "";

  const newTodo = {
    id: Date.now(),
    task: taskValue,
    date: dateValue,
    completed: false, // Properti untuk 'Mark as Done'
  };

  todos.push(newTodo);
  renderTodos(todos);

  // Reset Form
  todoInput.value = "";
  dateInput.value = "";
}

// Fungsi: Hapus Tugas
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos(todos);
}

// Fungsi: Mark as Done (Toggle Selesai)
function toggleDone(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  renderTodos(todos);
}

// Fungsi: Filter (Pencarian)
function filterTodos() {
  const keyword = filterInput.value.toLowerCase();
  const filtered = todos.filter((todo) =>
    todo.task.toLowerCase().includes(keyword)
  );
  renderTodos(filtered);
}

// Fungsi: Render List ke HTML
function renderTodos(data) {
  todoList.innerHTML = "";

  if (data.length === 0) {
    todoList.innerHTML = `<p class="text-center text-gray-400 text-sm py-4">Tidak ada tugas ditemukan.</p>`;
    return;
  }

  data.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item flex items-center justify-between p-4 rounded-xl border transition-all ${
      todo.completed
        ? "bg-gray-50 border-gray-200"
        : "bg-white border-blue-100 shadow-sm"
    }`;

    li.innerHTML = `
            <div class="flex items-center gap-3 overflow-hidden">
                <input type="checkbox" ${todo.completed ? "checked" : ""} 
                    onchange="toggleDone(${todo.id})"
                    class="w-5 h-5 cursor-pointer accent-blue-600">
                <div class="flex flex-col truncate">
                    <span class="font-semibold ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }">
                        ${todo.task}
                    </span>
                    <span class="text-xs text-gray-400">${todo.date}</span>
                </div>
            </div>
            <button onclick="deleteTodo(${todo.id})" 
                class="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        `;
    todoList.appendChild(li);
  });
  const totalTasks = document.getElementById("total-tasks");
  const completedTasks = document.getElementById("completed-tasks");

  const countCompleted = todos.filter((t) => t.completed).length;

  totalTasks.textContent = `Total: ${todos.length} Tugas`;
  completedTasks.textContent = `Selesai: ${countCompleted}`;
}

// Event Listeners
addBtn.addEventListener("click", addTodo);
filterInput.addEventListener("input", filterTodos);

// Jalankan fungsi tambah saat menekan tombol 'Enter'
todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});
