# SumoSurvey

> Features

- Users can respond to random survey questions.
- Questions that are already answered are not shown again to that user.
- Admin can log in to view survey responses.
- Admin can add survey questions/ answers.

## Stack
- Node.js/Express server
- MySQL database with Sequelize.js ORM
- AngularJS front-end MVC
- Bootstrap CSS

## Creator
- Austin Worachet [blog](https://austinwo.com)

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

In server/app.js, set your mysql username and password in the configuration object

```sh
create database survey;
use survey;
```
When the app is started (node app.js), the schema will be created so long as this setup has been performed.


Run the app in the browser
From root directory:
```sh
node server/index.js
```
Open browser and navigate to http://localhost:5000
