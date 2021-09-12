/**
 * IMPORTANT: 
 * ---------
 * Do not manually edit this file if you'd like to use Colyseus Arena
 * 
 * If you're self-hosting (without Arena), you can manually instantiate a
 * Colyseus Server as documented here: 👉 https://docs.colyseus.io/server/api/#constructor-options 
 */
import { listen } from "@colyseus/arena";

// Import arena config
import arenaConfig from "./arena.config";

// Create and listen on 2567 (or PORT environment variable.)
listen(arenaConfig);


// // Colyseus + Express
// import { Server } from "colyseus";
// import { createServer } from "http";
// import express from "express";
// import { MyRoom } from "./rooms/MyRoom";
// import { monitor } from "@colyseus/monitor";
// import { WebSocketTransport } from "@colyseus/ws-transport"
// const port = Number(process.env.port) || 3000;

// const app = express();
// app.use(express.json());

// const server = createServer(app); // create the http server manually

// const gameServer = new Server({
//   transport: new WebSocketTransport({
//     server // provide the custom server for `WebSocketTransport`
// })
// });

// /**
//  * Bind your custom express routes here:
//  */
//     app.get("/", (req, res) => {
//     res.send("It's time to kick ass and chew bubblegum!");
// });

// /**
//  * Bind @colyseus/monitor
//  * It is recommended to protect this route with a password.
//  * Read more: https://docs.colyseus.io/tools/monitor/
//  */
// app.use("/colyseus", monitor());

// gameServer.listen(port);

// gameServer.define('my_room', MyRoom).filterBy(['password'])
//         .enableRealtimeListing();