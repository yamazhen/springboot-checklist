CREATE TABLE IF NOT EXISTS todolist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    is_checked BOOL NOT NULL,
    todo VARCHAR(255) NOT NULL
);
