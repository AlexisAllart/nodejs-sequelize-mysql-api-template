# Node.js express server template (WORK IN PROGRESS)

### Create .env file in root directory and add required contents :

```
JWT_SECRET=$STRING
SV_PORT=$NUMBER
SV_URL=$STRING
EMAIL_HOST=$STRING
EMAIL_SERVICE=$STRING
EMAIL_PORT=$NUMBER
EMAIL_USER=$STRING
EMAIL_PASS=$STRING
```


## Useful commands :
* Database configuration :  
`/config/config.json`

* Install sequelize-cli & sequelize-mig globally:  
`npm install -g sequelize-cli`  
`npm install -g sequelize-mig`

* Create database :  
`sequelize db:create`

* Create new migration from models :  
`sequelize-mig migration:make -n <migration name>`

* Prepare models migration :  
`sequelize db:migrate`

* Populate database with all seed data from `/seeders/` :  
`sequelize db:seed:all`

* Populate database with specific seed data :  
`sequelize db:seed --seed <seed_file_name.js>`

## Other commands :
* Drop database :  
`sequelize db:drop`

* Revert last migration :  
`sequelize db:migrate:undo`

* Revert all migrations :  
`sequelize db:migrate:undo:all`

* Revert last seed :  
`sequelize db:seed:undo`

* Revert all seeds :  
`sequelize db:seed:undo:all`

### More commands on Sequelize web page :
https://www.npmjs.com/package/sequelize-cli