document.addEventListener('DOMContentLoaded', function() {
    let currentEditForm = null;
    let currentTodoId = null;

    fetch('/todolist')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const todoList = document.getElementById('todolist');

            const renderTodoList = (todos) => {
                todoList.innerHTML = '';
                todos.forEach((todo) => {
                    const todoId = parseInt(todo.id, 10);
                    const listItem = document.createElement('li');
                    listItem.className = 'todo-item';
                    const todoContent = document.createElement('div');
                    todoContent.className = 'todo-content'
                    const todoCheck = document.createElement('input');
                    todoCheck.type = 'checkbox';
                    todoCheck.checked = todo.checked;
                    const todoText = document.createElement('p');
                    todoText.textContent = todo.todo;
                    todoText.style.textDecoration = todoCheck.checked ? 'line-through' : 'none';
                    todoCheck.addEventListener('change', function() {
                        const isChecked = todoCheck.checked;
                        todoText.style.textDecoration = isChecked ? 'line-through' : 'none';
                        fetch(`/todolist/check/${todoId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ isChecked: isChecked })
                        })
                            .then(response => {
                                if (response.ok) {
                                    const updatedTodo = todos.find(item => item.id === todoId);
                                    if (updatedTodo) {
                                        updatedTodo.isChecked = isChecked;
                                    }
                                } else {
                                    todoCheck.checked = !isChecked;
                                    todoText.style.textDecoration = todoCheck.checked ? 'line-through' : 'none';
                                }
                            })
                            .catch(error => {
                                todoCheck.checked = !isChecked;
                                todoText.style.textDecoration = todoCheck.checked ? 'line-through' : 'none';
                                console.error('Error checking todo item:', error);
                            });
                    });

                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'crud-button';
                    const crudMenu = document.createElement('section');
                    crudMenu.className = 'crud-menu';
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';

                    editButton.addEventListener('click', function() {
                        if (currentEditForm && currentTodoId == todoId) {
                            crudMenu.removeChild(currentEditForm);
                            currentEditForm = null;
                            currentTodoId = null;
                            buttonContainer.style.right = '';
                            return;
                        }
                        if (currentEditForm) {
                            currentEditForm.parentElement.removeChild(currentEditForm);
                        }
                        fetch(`/todolist/${todoId}`, {
                            method: 'GET'
                        })
                            .then(response => response.json())
                            .then(todoData => {
                                const editForm = document.createElement('form');
                                editForm.className = 'update-form';
                                const input = document.createElement('input');
                                input.className = 'type-input';
                                input.value = todoData.todo;
                                const saveButton = document.createElement('button');
                                saveButton.textContent = 'Save';

                                editForm.addEventListener('submit', function(event) {
                                    event.preventDefault();
                                    fetch(`/todolist/${todoId}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ todo: input.value, isChecked: todoData.isChecked })
                                    })
                                        .then(response => {
                                            if (response.ok) {
                                                const updatedTodo = { ...todoData, todo: input.value };
                                                const index = data.findIndex(item => item.id === todoId);
                                                if (index !== -1) {
                                                    data[index] = updatedTodo;
                                                }
                                                todoText.textContent = input.value;
                                                crudMenu.removeChild(editForm);
                                                currentEditForm = null;
                                                currentTodoId = null;
                                                buttonContainer.style.right = '';
                                            }
                                        })
                                        .catch(error => console.error('Error updating todo item: ', error));
                                });

                                editForm.appendChild(input);
                                editForm.appendChild(saveButton);
                                crudMenu.appendChild(editForm);
                                currentEditForm = editForm;
                                currentTodoId = todoId;
                                buttonContainer.style.right = '25px';
                            })
                            .catch(error => console.error('Error fetching todo item for edit: ', error));
                    });

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', function() {
                        fetch(`/todolist/${todoId}`, {
                            method: 'DELETE'
                        })
                            .then(response => {
                                if (response.ok) {
                                    return fetch('/todolist');
                                } else {
                                    throw new Error('Failed to delete the todo item.');
                                }
                            })
                            .then(response => response.json())
                            .then(updatedData => {
                                data = updatedData;
                                renderTodoList(data);
                                currentEditForm = null;
                                currentTodoId = null;
                            })
                            .catch(error => console.error('Error deleting todo item:', error));
                    });

                    buttonContainer.appendChild(editButton);
                    buttonContainer.appendChild(deleteButton);
                    crudMenu.appendChild(buttonContainer);
                    todoContent.appendChild(todoCheck);
                    todoContent.appendChild(todoText);

                    listItem.appendChild(todoContent);
                    listItem.appendChild(crudMenu);
                    todoList.appendChild(listItem);
                });
            };

            renderTodoList(data);
        })
        .catch(error => console.error('Error fetching todo list:', error));
});
