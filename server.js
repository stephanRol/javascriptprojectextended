'use strict';
//Server 
const express = require('express');
let server = express();
//Nodemailer modul
const nodemailer = require('nodemailer');
//CouchDB modul
const db = require('nano')('http://step:abc12345@localhost:5984').db
//Socket und HTTP 
const http = require('http');
const socket = require('socket.io');

let serverHTTP = http.Server(server)
let io = socket(serverHTTP);

//Statische Dateien
server.use(express.static('public', {
    extensions: ['html']
}));
//To recognize the incoming Request object as a JSON Object 
server.use(express.json())


//Email senden
server.post('/send', (req, res) => {

    const user = req.body.name;
    const email = req.body.email;

    console.log(user);

    //Schritt 1
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'projectjavascript2021@gmail.com',
            pass: 'projectjavascript2021!"#$%'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    //Scritt 2
    const mailOptions = {
        from: 'projectjavascript2021@gmail.com',
        to: email,
        subject: 'Abonnement Bestätigung',
        text: 'TEST!',
        html: `<head><style> p{color:#3e4444;font-family:'Open Sans Condensed', sans-serif;
    font-size: 18px;}</style><head><h1 style="color:#82b74b;">Willkommen und Danke ${user}! </h1><br><p>Dein Abonnement wurde bestätigt! Vielen Dank, dass du unseren Newsletter abonniert hast.</p><p>Wir werden dich über unsere Neuigkeiten und Sonderangebote informieren!</p><br><div><b><p style="color:#034f84;">MELTING AWAY Team</p></b><p style="color:#034f84;">Musterstr. 8</p><p style="color:#034f84;">22345 Hamburg</p></div>`,
        attachments: [{
            filename: 'Zeitschrift_Februar_2021.pdf',
            path: 'public/Magazine_Februar.pdf'
        }]
    };
    //Schritt 3
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.send(JSON.stringify('Dein Abonnement wurde bestätigt!\nBitte checken Sie Ihre Email'));
        }
    });
})

//Login Daten
server.post('/login', (req, res) => {
    const user = req.body.name;
    const password = req.body.password;

    console.log(user);
    console.log(password);

    let dbName = 'users';
    let userJSON = {
        name: user,
        password: password
    }
    db.list().then(
        antwort => {
            // Falls Datenbank nicht existiert, anlegen
            if (antwort.includes(dbName)) {
                return true;
            } else {
                return db.create(dbName);
            }
        }
    ).then(
        // Use liefert die Verbindung zur Datenbank in Form eines Objektes
        () => db.use(dbName)
    ).then(
        dbBeispiel => dbBeispiel.find({
            selector: {
                name: userJSON.name
            }
        })
    ).then(
        antwort => {
            //console.log(antwort.docs);
            if (antwort.docs[0] == undefined) {
                res.send(JSON.stringify('Falscher Username oder Passwort'))
            } else {
                if (antwort.docs[0].name == userJSON.name &&
                    antwort.docs[0].password == userJSON.password) {
                    console.log('Username & password RICHTIG!');
                    res.send(JSON.stringify({
                        login: true
                    }))
                } else {
                    res.send(JSON.stringify('Falscher Username oder Passwort'))
                }
            }
        }
    ).catch(
        err => console.log(err)
    )
})

//Websockets
let user='';
server.post('/websocket', (req, res) => {
    user = req.body.name;
    console.log(user);
})
    let arrayMessages = [];

    io.on('connection', (socket) => {
        console.log('Jemand hat sich mit Sockets verbunden:' + user);
        socket.emit('info', user);
        socket.emit('messages', arrayMessages);

        socket.on('new-message', data => {
            arrayMessages.push(data);
            io.sockets.emit('messages', arrayMessages)
        });
    });

//Socket server
serverHTTP.listen(8080, () => {
    console.log("Server verbunden");
});

//Server listening
server.listen(80, err => console.log(err || 'Server läuft'));