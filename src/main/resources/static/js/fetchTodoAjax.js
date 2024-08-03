document.addEventListener('DOMContentLoaded', function() {
    fetch('/todolist')
        .then(response => response.json())
        .then(data => {
        const todoList = document.getElementById('todolist');
        let i = 1;
        data.forEach(todo => {
            const todoId = parseInt(todo.id, 10);
            const listItem = document.createElement('li');
            const todoText = document.createTextNode(i +  ' ' + todo.todo);
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', function() {
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
                                todoText.nodeValue = i + ' ' + input.value;
                            }
                        })
                            .catch(error => console.error('Error updating todo item: ', error));
                    });

                    editForm.appendChild(input);
                    editForm.appendChild(saveButton);
                    listItem.appendChild(editForm);
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
                        listItem.remove();
                    }
                })
                    .catch(error => console.error('Error deleting todo item:', error));
            });

            listItem.appendChild(todoText);
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            todoList.appendChild(listItem);
            i++;
        });
    })
        .catch(error => console.error('Error fetching todo list:', error));
});
