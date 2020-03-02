CREATE TABLE tasks (
                       id uuid NOT NULL,
                       title varchar(255) NOT NULL,
                       priority smallint NOT NULL DEFAULT 0,
                       PRIMARY KEY (id)
);
CREATE INDEX tasks_priority_index ON tasks (priority);