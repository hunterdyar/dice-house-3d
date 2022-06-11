import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

import dotenv from "dotenv";

dotenv.config();

// //CORS copied from old
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next();
// });
//above copied from old

let port = 3001;
if (process.env.PORT) {
    port = parseInt(process.env.PORT);
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on('connection', function(socket){
    console.log("Connection."+socket.id);
    let q = socket.handshake.query;
    let roomName = q.room;
    if(roomName === "") {
        roomName = newRandomLobbyName();
    }
    console.log("created new random room name: "+roomName);

    socket.join(roomName);
    //Send this event to everyone in the room.
    io.in(roomName).emit('connectToRoom', roomName);

    socket.on("joinRoom",function(data){
        //todo: check if client is already in room.
        socket.rooms;
        //todo: check if room is new?

        //todo: check for null.
        data = data.toString();
        if(data) {
            let oldRooms = Array.from(socket.rooms);//This doesn't feel right. Todo: somebody fix this.
            for(let i = 1;i<oldRooms.length;i++)
            {
                let r = oldRooms[i];
                socket.leave(r);
            }
            socket.join(data);
            // socket.emit("connectToRoom", data);//todo: why isn't this updating?
            io.sockets.in(data).emit('connectToRoom', data);

        }
    });
    socket.on("roll",function(data)
    {
        console.log("roll in "+data.room);
        socket.in(data.room).emit("otherRoll",data);
    });
    socket.on("updateForm",function(entryData)
    {
        socket.in(entryData.room).emit("otherForm",entryData);
    });
});

io.listen(port);

// httpServer.listen(port, function () {
//     console.log('listening on *:' + port);
// });

//todo: refactor all of the lobby name code. move to new files and json stuff.
//Lobby Name Things.
function newRandomLobbyName()
{
    let n = randomLobbyName();

    //todo: this was javascript map? change to TS
    //check if room with this id already has a connection. Ensuring its empty. if not empty, recursively try again.
    // if(io.sockets.in(n).size > 0)
    // {
    //     return newRandomLobbyName();
    // }

    return n;
}

//todo: move to own file and such.
let nameOnes = ['banana' +
'pancake','billy','dungeon','dragon','sword','jail','arrow','happy','quest','volcano','knife','ring','item','journey','destiny','marathon','blizzard','storm','squire','blacksmith','dagger','dreams']
let nameTwos = ['adventure','hundred','great','simple','orange','green','red','yellow','blue','purple','chase','axe','magic','wizard','ninja','tornado','light','flower','teleport']

function randomLobbyName()
{
    return nameOnes[Math.floor(Math.random()*nameOnes.length)]+"-"+Math.floor(Math.random()*10)+"-"+nameTwos[Math.floor(Math.random()*nameTwos.length)]+"-"+Math.floor(Math.random()*10);
}
