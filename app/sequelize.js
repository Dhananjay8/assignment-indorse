const Sequelize = require('sequelize');


const rootPrefix = '..',
  UrlModel = require(rootPrefix + '/app/models/Url'),
  coreConstants = require(rootPrefix + '/coreConstants');

const mysqlHost = coreConstants.MYSQL_HOST,
  mysqlUser = coreConstants.MYSQL_USER,
  password = coreConstants.MYSQL_PASSWORD,
  dbName = coreConstants.MYSQL_DB_NAME;

const sequelize = new Sequelize(dbName, mysqlUser, password, {
  host: mysqlHost,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const Url = UrlModel(sequelize, Sequelize);

sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`);
    process.exit(1);
  });

module.exports = {
  Url: Url
};
