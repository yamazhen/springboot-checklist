package com.yamazhen.checklist;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoListService {

    @Autowired
    private TodoListRepository todoListRepository;

    public Iterable<TodoList> get() {
       return todoListRepository.findAll();
    }

    public TodoList get(Integer id) {
        return todoListRepository.findById(id).orElse(null);
    }

    public void save(@Valid TodoList todo) {
        todoListRepository.save(todo);
    }

    public void remove(Integer id) {
        todoListRepository.deleteById(id);
    }
}
