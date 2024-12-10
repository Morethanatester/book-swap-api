import express from "express";
import accountsController from "../controllers/booksController.js";

const Router = express.Router();

Router.route("/books")
    .get(accountsController.getAllBooks)
    .post(accountsController.addBook);

Router.route("/books/:id")
    .get(accountsController.getBookById)
    .put(accountsController.updateBookById)
    .delete(accountsController.deleteBookById);

export default Router;
