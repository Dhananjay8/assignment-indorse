module.exports = (sequelize, type) => {
  return sequelize.define('urls',{
    id: {
      type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
      url: type.TEXT,
      short_id: type.STRING

  },
    {underscored: true})
};
