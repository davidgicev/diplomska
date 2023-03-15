import Server from "./server/server";
import express from 'express';
const app = express();

const port = 8080;

const server = new Server(app);
server.start(port);