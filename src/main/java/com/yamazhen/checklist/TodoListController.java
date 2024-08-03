package com.yamazhen.checklist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
public class TodoListController {

    @Autowired
    private TodoListService todoListService;

    @GetMapping("/todolist")
    public Iterable<TodoList> get() {
        return todoListService.get();
    }

    @GetMapping("/todolist/{id}")
    public ResponseEntity<TodoList> get(@PathVariable Integer id) {
        TodoList todoList = todoListService.get(id);
        if (todoList != null) {
            return ResponseEntity.ok(todoList);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/todolist")
    public RedirectView create(@RequestParam String todo, @RequestParam(defaultValue = "false") boolean isChecked) {
        TodoList todoList = new TodoList();
        todoList.setTodo(todo);
        todoList.setChecked(isChecked);
        todoListService.save(todoList);
        return new RedirectView("/");
    }

    @PutMapping("/todolist/{id}")
    public ResponseEntity<String> update(@PathVariable Integer id, @RequestBody TodoList todo) {
        TodoList todoList = todoListService.get(id);
        if (todoList != null) {
           todoList.setTodo(todo.getTodo());
           todoList.setChecked(todo.isChecked());
           todoListService.save(todoList);
           return ResponseEntity.ok("Todo updated successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Todo not found");
    }

    @DeleteMapping("/todolist/{id}")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        if (todoListService.get(id) != null) {
            todoListService.remove(id);
            return ResponseEntity.ok("Todo deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Todo not found");
    }

    @PutMapping("/todolist/check/{id}")
    public ResponseEntity<String> check(@PathVariable Integer id, @RequestBody Map<String, Boolean> requestBody) {
        Boolean isChecked = requestBody.get("isChecked");
        if (isChecked == null) {
            return ResponseEntity.badRequest().body("Invalid request body");
        }
        TodoList todoList = todoListService.get(id);
        if (todoList != null) {
            todoList.setChecked(isChecked);
            todoListService.save(todoList);
            return ResponseEntity.ok("Todo checked");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Todo not found");
    }
}
