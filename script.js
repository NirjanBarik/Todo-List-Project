const todoLists = document.querySelector(".todoLists ol");
        const listValue = document.querySelector(".todoValue");
        const addBtn = document.querySelector(".btn");
        const form = document.querySelector("form");

        // Add to local storage
        let todoListValue = [];

        // Get todo list from local storage
        const getTodoListFromLS = () => {
            const todos = localStorage.getItem("todoKey");
            return todos ? JSON.parse(todos) : [];
        };

        // Create todo item HTML
        const createTodoHTML = (todoText) => {
            const liElement = document.createElement("li");
            liElement.className = "todo-item-new";
            liElement.innerHTML = `
                <span class="todo-text">${todoText}</span>
                <button class="remove-btn">×</button>
            `;
            return liElement;
        };

        // Remove a todo from the list and update local storage
        const removeTodoList = (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const todoItem = e.target.closest('li');
                const todoText = todoItem.querySelector('.todo-text').textContent;
                
                // Add removal animation
                todoItem.style.animation = 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse';
                
                setTimeout(() => {
                    todoListValue = todoListValue.filter((curTodoValue) => curTodoValue !== todoText);
                    addLocalStorage(todoListValue);
                    todoItem.remove();
                    
                    // Show empty state if no todos
                    if (todoListValue.length === 0) {
                        showEmptyState();
                    }
                }, 300);
            }
        };

        // Show empty state
        const showEmptyState = () => {
            todoLists.innerHTML = '<div class="empty-state">No todos yet. Add one above!</div>';
        };

        // Add to local storage
        const addLocalStorage = (todos) => {
            localStorage.setItem("todoKey", JSON.stringify(todos));
        };

        // Load todos from local storage
        const loadTodos = () => {
            todoListValue = getTodoListFromLS();
            todoLists.innerHTML = '';
            
            if (todoListValue.length === 0) {
                // Add welcome message
                const welcomeItem = createTodoHTML("Welcome! Click the × to remove this example");
                todoLists.appendChild(welcomeItem);
            } else {
                todoListValue.forEach(todo => {
                    const todoItem = createTodoHTML(todo);
                    todoLists.appendChild(todoItem);
                });
            }
        };

        // Add todo list
        const addTodoList = (e) => {
            e.preventDefault();
            
            // Get the current todo list from local storage
            todoListValue = getTodoListFromLS();
            
            // Trim the input value
            let newTodo = listValue.value.trim();
            
            // Validate input
            if (newTodo.length === 0) {
                listValue.focus();
                return;
            }
            
            if (todoListValue.includes(newTodo)) {
                alert('This todo already exists!');
                listValue.focus();
                return;
            }
            
            // Add loading state
            addBtn.classList.add('loading');
            addBtn.textContent = '';
            
            setTimeout(() => {
                // Add the new todo to the list
                todoListValue.push(newTodo);
                
                // Update local storage
                addLocalStorage(todoListValue);
                
                // Clear empty state if present
                const emptyState = todoLists.querySelector('.empty-state');
                if (emptyState) {
                    emptyState.remove();
                }
                
                // Add the new todo to the UI
                const todoItem = createTodoHTML(newTodo);
                todoLists.appendChild(todoItem);
                
                // Clear input and remove loading state
                listValue.value = "";
                addBtn.classList.remove('loading');
                addBtn.textContent = 'Add Todo';
                
                // Focus back to input
                listValue.focus();
            }, 300);
        };

        // Event listeners
        form.addEventListener("submit", addTodoList);
        todoLists.addEventListener("click", removeTodoList);

        // Load todos on page load
        document.addEventListener('DOMContentLoaded', loadTodos);

        // Auto-focus input on page load
        window.addEventListener('load', () => {
            listValue.focus();
        });