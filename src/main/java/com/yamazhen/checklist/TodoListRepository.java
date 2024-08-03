package com.yamazhen.checklist;

import org.springframework.data.repository.CrudRepository;

public interface TodoListRepository extends CrudRepository<TodoList, Integer> {
}
