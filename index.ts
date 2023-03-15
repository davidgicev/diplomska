import Server from "./server/server";
import express from 'express';
const app = express();

const port = 8080;

export const APP_URL = process.env.APP_URL

console.log("APP URL IS ", APP_URL)

const server = new Server(app);
server.start(port);