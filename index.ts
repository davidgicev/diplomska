import Server from "./server/server";
import express from 'express';
const app = express();

const port = 8080;

export const APP_URL = process.env.CYCLIC_URL

const server = new Server(app);
server.start(port);