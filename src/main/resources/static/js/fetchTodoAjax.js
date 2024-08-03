document.addEventListener('DOMContentLoaded', function() {
    let currentEditForm = null;
    let currentTodoId = null;
    fetch('/todolist')
        .then(response => response.json())
        .then(data => {
            const todoList = document.getElementById('todolist');
            const renderTodoList = (todos) => {
                todoList.innerHTML = '';
                todos.forEach((todo) => {
                    const todoId = parseInt(todo.id, 10);
                    const listItem = document.createElement('li');
                    listItem.className = 'todo-item';
                    const todoText = document.createTextNode(todo.todo);
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'crud-button';
                    const crudMenu = document.createElement('section');
                    crudMenu.className = 'crud-menu';
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.addEventListener('click', function() {
                        if(currentEditForm && currentTodoId == todoId) {
                            crudMenu.removeChild(currentEditForm);
                            currentEditForm = null;
                            currentTodoId = null;
                            return;
                        }
                        if(currentEditForm) {
                            currentEditForm.parentElement.removeChild(currentEditForm);
                        }
                        fetch(`/todolist/${todoId}`, {
                            method: 'GET'
                        })
                            .then(response => response.json())
                            .then(todoData => {
                                const editForm = document.createElement('form');
                                const input = document.createElement('input');
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
                                        body: JSON.stringify({ todo: input.value })
                                    })
                                        .then(response => {
                                            if(response.ok) {
                                                const updatedTodo = { ...todoData, todo: input.value };
                                                const index = data.findIndex(item => item.id === todoId);
                                                if (index !== -1) {
                                                    data[index] = updatedTodo;
                                                }
                                                todoText.nodeValue = input.value;
                                                crudMenu.removeChild(editForm);
                                                currentEditForm = null;
                                                currentTodoId = null;
                                            }
                                        })
                                        .catch(error => console.error('Error updating todo item: ', error));
                                });

                                editForm.appendChild(input);
                                editForm.appendChild(saveButton);
                                crudMenu.appendChild(editForm);
                                currentEditForm = editForm;
                                currentTodoId = todoId;
                            })
                            .catch(error => console.error('Error fetching todo item for edit: ', error));
                    })
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', function() {
                        fetch(`/todolist/${todoId}`, {
                            method: 'DELETE'
                        })
                            .then(response => {
                                if (response.ok) {
                                    data = data.filter(item => item.id !== todoId);
                                    renderTodoList(data);
                                    currentEditForm = null;
                                    currentTodoId = null;
                                }
                            })
                            .catch(error => console.error('Error deleting todo item:', error));
                    });
                    buttonContainer.appendChild(editButton);
                    buttonContainer.appendChild(deleteButton);
                    crudMenu.appendChild(buttonContainer)

                    listItem.appendChild(todoText);
                    listItem.appendChild(crudMenu)
                    todoList.appendChild(listItem);
                });
            };
            renderTodoList(data);
        })
        .catch(error => console.error('Error fetching todo list:', error));
});
