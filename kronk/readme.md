# Prep

Run `npm install --include=dev` to install dependencies

Check out `https://documenter.getpostman.com/view/21182825/Uz5FJbxs` for API documentation


# Setting up the database

If postgres is not installed on the machine, follow instructions to get the database installed and setup.

### Migrating the database

Migration scripts have all been setup already. Just run:

```
npx sequelize db:migrate
```

To undo the migrations, you will just run:

```
npx sequelize db:migrate:undo
```

