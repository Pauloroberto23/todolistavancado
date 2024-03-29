// seleção de elementos 
const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;    //significado valor de entrada e saida 
// funções 
const saveTodo = (Text,done = 0, save = 1) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = Text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn);    
    
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn);

    //utilizando dados da storage
    if (done) {
        todo.classList.add("done");
    };

    if (save) {
        saveTodoLocalStorage({Text,done});
    };

    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();

   
};
// significado de toggle é alternar
const toggleForms = () => {
    editForm.classList.toggle("hide");// hide significado esconder
    todoForm.classList.toggle("hide");// hide significado esconder
    todoList.classList.toggle("hide");// hide significado esconder

};

const upDateTodo =  (Text) => {
    
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = Text;
        }
        
    });
};

const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase();

        todo.style.display = "flex";


        if (!todoTitle.includes(normalizedSearch)) {
            todo.style.display = "none";
        }

       
        
    });
}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch(filterValue) {// switch é trocar 
        case "all": // case é caso
        todos.forEach((todo) => todo.style.display = "flex")
        break;

        case "done":
            !todos.forEach((todo) => todo.classList.contains("done") 
            ? (todo.style.display = "flex") 
            : (todo.style.display = "none") 
            );
            break;// break quebrar

            default:
            break;

    }

}


// eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue)
    }

    
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if (targetEl.classList.contains("finish-todo")) {
       parentEl.classList.toggle("done");

       updateTodoStatusLocalStorage(todoTitle);
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();

        removeTodoLocalStorage(todoTitle);
    }

    if (targetEl.classList.contains("edit-todo")) {
       toggleForms();

       editInput.value = todoTitle;
       oldInputValue = todoTitle;
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();// alterar formas
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if (editInputValue) {
        upDateTodo(editInputValue);
    }

    toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;

    getSearchTodos(search);// procurar
});

eraseBtn.addEventListener("click" , (e) => {
    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"));
});

//local storage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
};

const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.Text, todo.done, 0);
    });
}

const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();

    todo.push(todo);

    localStorage.setItem("todos" , JSON.stringify(todos));

};

const removeTodoLocalStorage = (todoText) => {
   const todos = getTodosLocalStorage();
   
   const filteredTodos = todos.filter((todo) => todo.text !== todoText);

   localStorage.setItem("todos" , JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
   
   todos.map((todo) => todo.text === todoText ? ( todo.done = !todo.done): null
   );

   localStorage.setItem("todos" , JSON.stringify(todos));
}

loadTodos();