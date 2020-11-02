module.exports = (sequelize, type) => {
  return sequelize.define('project', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: type.STRING,
      text: type.STRING,
      image: type.STRING
  })
}