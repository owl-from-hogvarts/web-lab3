
# Backend

Bean does not actually store data. It acts like a thin wrapper around database. We want our database to be single source of truth.

## Beans

Single session scoped bean contains current values of input form.

On form submit, the bean is send to application scoped one. It performs addition to database.

