import database from "../services/database.js";
import {
    ScanCommand,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import bookSchema from "../models/book.js";

async function getAllBooks(req, res, next) {
    try {
        const params = {
            TableName: "BooksTable",
        };
        const command = new ScanCommand(params);
        const result = await database.send(command); res.status(200).json(result.Items);
    } catch (err) {
        next(err);
    }
}

async function addBook(req, res, next) {
    try {
        const uuid = uuidv4();
        req.body.id = uuid;
        const { error, value } = bookSchema.validate(req.body);

        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        const { id, title, author, genre, condition, owner, price } = value;

        const params = {
            TableName: "BooksTable",
            Item: {
                id,
                title,
                author,
                genre,
                condition,
                owner,
                price,
            },
        };

        const command = new PutCommand(params);

        await database.send(command);

        res
            .status(201)
            .json({ message: "📚 Book added successfully", data: params.Item });

    } catch (error) {
        next(error);
    }
}

async function getBookById(req, res, next) {
    const bookId = req.params.id;
    try {
        const params = {
            TableName: "BooksTable",
            Key: { id: bookId },
        };
        const command = new GetCommand(params);
        const result = await database.send(command);
        if (!result.Item) {
            return res.status(404).json({ message: "books Book not found" });
        }
        res.status(200).json(result.Item);
    } catch (err) {
        next(err);
    }
}


async function updateBookById(req, res) {
    try {
        const bookId = req.params.id;
        req.body.id = bookId;
        const { error, value } = bookSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { title, author, genre, condition, owner, price } = value;

        // Get the movie from DynamoDB
        const getParams = {
            TableName: "BooksTable",
            Key: { id: bookId },
        };

        const getCommand = new GetCommand(getParams);

        const result = await database.send(getCommand);

        const book = result.Item;

        if (!book) {
            return res.status(404).json({ message: "No book found" });
        }

        // Update the account in DynamoDB
        const updateParams = {
            TableName: "BooksTable",
            Key: { id: bookId },
            UpdateExpression:
                "set #title = :title, #author = :author, #genre = :genre, #condition = :condition, #owner = :owner, #price = :price",
            ExpressionAttributeNames: {
                "#title": "title",
                "#author": "author",
                "#genre": "genre",
                "#condition": "condition",
                "#owner": "owner",
                "#price": "price",
            },
            ExpressionAttributeValues: {
                ":title": title,
                ":author": author,
                ":genre": genre,
                ":condition": condition,
                ":owner": owner,
                ":price": price,
            },
            ReturnValues: "ALL_NEW",
        };
        const updateCommand = new UpdateCommand(updateParams);
        const updatedBook = await database.send(updateCommand);

        res.status(200).json(updatedBook.Attributes);
    } catch (err) {
        next(err);
    }
}

async function deleteBookById(req, res, next) {
    const bookId = req.params.id;
    try {
        const params = {
            TableName: "BooksTable",
            Key: { id: bookId },
        };
        const command = new DeleteCommand(params);
        await database.send(command);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}

export default {
    getAllBooks,
    addBook,
    getBookById,
    updateBookById,
    deleteBookById,
};


