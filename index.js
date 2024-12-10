import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Router from "./routes/router.js";

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(Router);

async function startServer() {
    try {
        app.listen(port, () => console.log(`🤖 Listening on Port: ${port}`));
    } catch (err) {
        console.log("🤖 Oh no something went wrong", err);
    }
}

startServer();
