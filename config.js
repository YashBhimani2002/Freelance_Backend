module.exports = {
  development: {
    dialect: 'mysql',
    pool: {
      acquire: 30000,
      idle: 10000,
    },
    host: '127.0.0.1',
    username: 'root',
    password: '',
    database: 'praiki69_dev_master',
    dialect: 'postgres', 
  },
};