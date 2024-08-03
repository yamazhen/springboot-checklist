package com.yamazhen.checklist;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("TODOLIST")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TodoList {

    @Id
    private Integer id;

    @NotEmpty
    private String todo;
}
