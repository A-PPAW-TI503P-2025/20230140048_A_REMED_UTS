require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
);

const Book = sequelize.define("Book", {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const BorrowLog = sequelize.define("BorrowLog", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  bookId: { type: DataTypes.INTEGER, allowNull: false },
  borrowDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
});

sequelize.sync({ alter: true }).then(() => console.log("Database synced!"));

module.exports = { sequelize, Book, BorrowLog };
