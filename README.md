# SumoSurvey

> Survey App

$$ Features

- Users can respond to random survey questions.
- Questions that are already answered are not shown again to that user. (Using cookies stored on users' brower)
- Admin can log in to view survey responses and add survey questions/ answers. (Using jwt session)

## Stack
- Node.js/Express server
- MySQL database with Sequelize.js ORM
- AngularJS front-end MVC
- Bootstrap CSS

## Creator
- Austin Worachet

## Development

### Installing Dependencies

From within the root directory:
```sh
* sudo npm install
* bower install
```

### Setting up DataBase development environment

```sh
mysql.server start
mysql -u [your username] -p
Enter Password:  [your password]
```

1. In server/app.js, set your mysql username and password in the configuration object

```sh
create database survey;
use survey;
```
When the app is started (node app.js), the schema will be created so long as this setup has been performed.


1. Run the app in the browser
From root directory:
```sh
node index.js
```
1. Open browser and navigate to http://localhost:5000
