module.exports = (sequelize, type) => {
  return sequelize.define('user', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_name: {
        type: type.STRING,
        unique: true
      },
      email: {
        type: type.STRING,
        unique: true
      },
      password: type.STRING
  })
}
