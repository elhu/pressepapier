-- +goose Up
-- +goose StatementBegin
ALTER TABLE clipboards
ADD file LONGBLOB;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE clipboards
DROP COLUMN file;
-- +goose StatementEnd
