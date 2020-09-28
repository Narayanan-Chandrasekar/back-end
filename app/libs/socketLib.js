/**
 * modules dependencies.
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();


const tokenLib = require("./tokenLib.js");
const check = require("./checkLib.js");
const response = require('./responseLib')
const userController = require('../controllers/userController');
let setServer = (server) => {

    let allOnlineUsers = []

    let io = socketio.listen(server);

    let myIo = io.of('')

    myIo.on('connection',(socket) => {

        console.log("on connection--wait");

        socket.on("online",() =>{
            socket.emit('1111',"Admin is online");
        })
        
         
        
        // code to verify the user and make him online

        socket.on('alert-user',(meetingData) => {

            console.log("alert-user called")
            userController.alertUser(meetingData,(err,user)=>{
                if(err){
                    socket.emit('alert-error', { status: 500, error: 'Please provide valid alert details' })
                }
                else{

                    console.log("..alerting user");
                    
                    // setting socket user id 
                    socket.uId = user.uId
                             
                    socket.emit(socket.uId,meetingData)
                    console.log(socket.uId + "alerted");

                }


            })
          
        }) // end of listening set-user event

        socket.on("alert-received",() => { console.log("User received the alert");})
        socket.on("alert-received-by-admin",() => { console.log("Admin received the alert");})
        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId);


        }) // end of on disconnect


    });

}

module.exports = {
    setServer: setServer
}
