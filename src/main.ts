type TTodo = {
  id: string;
  text: string;
  completed: boolean;
};

const form = document.querySelector<HTMLFormElement>("#todo-form")!;
const input = document.querySelector<HTMLInputElement>("#todo-input")!;
const list = document.querySelector<HTMLUListElement>("#todo-list")!;
const emptyState = document.querySelector<HTMLDivElement>("#empty-state");
const creatCont = document.querySelector<HTMLSpanElement>("#created-count")!;
const completedCount =
  document.querySelector<HTMLSpanElement>("#completed-count")!;

const modal = document.querySelector<HTMLDivElement>("#modal")!;
const confirmBtn = document.querySelector<HTMLButtonElement>("#confirm-btn");
const cancelBtn = document.querySelector<HTMLButtonElement>("#cancel-btn");

let todos: TTodo[] = [];

let todoToDelete: string | null = null;

function updateCount(): void {
  creatCont.textContent = todos.length.toString();
  completedCount.textContent =
    todos.filter((todo) => todo.completed).length + "of" + todos.length;
}

function checkEmpty(): void {
  if (todos.length === 0) {
    emptyState?.classList.remove("hidden");
  } else {
    emptyState?.classList.add("hidden");
  }
}

function saveTodo(): void {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodo() {
  list.innerHTML = "";
  todos.forEach((todo) => {
    const li: HTMLLIElement = document.createElement("li");
    li.className =
      "bg-zinc-800 px-4 py-3 rounded-lg flex justify-between items-center border border-zinc-700";

    const label: HTMLSpanElement = document.createElement("span");
    label.textContent = todo.text;
    label.className = "text-sm";
    if (todo.completed) {
      label.classList.add("line-through", "text-zinc-500");
    }

    const left: HTMLDivElement = document.createElement("div");
    left.className = "flex items-center gap-3";

    const check: HTMLButtonElement = document.createElement("button");

    check.className =
      "w-5 h-5 rounded-full border-2 flex items-center " +
      (todo.completed ? "bg-purple-600 border-purple-600" : "border-blue-500");

    check.onclick = () => {
      todo.completed = !todo.completed;
      saveAndRender();
    };

    left.appendChild(check);
    left.appendChild(label);

    const deleteBtn: HTMLButtonElement = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.className = "hover:text-red-500 text-zinc-400 text-sm";
    deleteBtn.onclick = () => {
      todoToDelete = todo.id;
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    };

    li.appendChild(left);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
  updateCount();
  checkEmpty();
}

function saveAndRender() {
  saveTodo();
  renderTodo();
}

confirmBtn?.addEventListener("click", () => {
  if (todoToDelete !== null) {
    todos = todos.filter((todo) => todo.id !== todoToDelete);
    todoToDelete = null;
    modal.classList.add("hidden");
    saveAndRender();
  }
});

cancelBtn?.addEventListener("click", () => {
  todoToDelete = null;
  modal.classList.add("hidden");
});

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input?.value.trim();
  if (!text) return;
  todos.push({ id: crypto.randomUUID(), text, completed: false });
  input.value = "";
  saveAndRender();
});

window.addEventListener("load", () => {
  const save = localStorage.getItem("todos");
  if (save) todos = JSON.parse(save);
  renderTodo();
});
