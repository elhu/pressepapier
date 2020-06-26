-- +goose Up
-- SQL in this section is executed when the migration is applied.
CREATE TABLE clipboards
(
  id int NOT NULL AUTO_INCREMENT,
  data text NOT NULL,
  user_uuid VARCHAR
  (255),
  PRIMARY KEY
  (id)
);
CREATE INDEX clipboards_user_uuid ON clipboards (user_uuid);
-- +goose Down
-- SQL in this section is executed when the migration is rolled back.
DROP TABLE clipboards;
