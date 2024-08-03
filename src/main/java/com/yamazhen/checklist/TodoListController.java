package com.yamazhen.checklist;

import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class TodoListController {

    @Autowired
    private TodoListService todoListService;

    @GetMapping("/todolist")
    public Iterable<TodoList> get() {
        return todoListService.get();
    }

    @GetMapping("/todolist/{id}")
    public TodoList get(@PathVariable Integer id) {
        return todoListService.get(id);
    }

    @PostMapping("/todolist")
    public RedirectView create(@RequestParam String todo) {
        TodoList todoList = new TodoList();
        todoList.setTodo(todo);
        todoListService.save(todoList);
        return new RedirectView("/");
    }

    @PutMapping("/todolist/{id}")
    public ResponseEntity<String> update(@PathVariable Integer id, @RequestBody TodoList todo) {
        TodoList todoList = todoListService.get(id);
        if (todoList != null) {
           todoList.setTodo(todo.getTodo());
           todoListService.save(todoList);
           return ResponseEntity.ok("Todo updated sucessfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Todo not found");
    }

    @DeleteMapping("/todolist/{id}")
    public void delete(@PathVariable Integer id) {
        todoListService.remove(id);
    }
}
