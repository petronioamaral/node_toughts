const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('toughts2', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
})

try {
  sequelize.authenticate()
  console.log('conectou ok')
} catch (error) {
  console.log('error conexao', error) 
}

module.exports = sequelize;