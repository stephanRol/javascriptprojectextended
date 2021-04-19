'use strict';

let socket = io.connect('http://localhost:8080', { 'forceNew': true });
let emiter = "";

socket.on('info', (data) => {
    console.log(data);
    emiter = data;
})

socket.on('messages', (data) => {
    render(data);
})

function render(data) {
    console.log(emiter);
    if (data.length == 0) {
        true;
    } else {
        let html = data.map((data, index) => {
            return (`<div>
                    <strong>${data.author}</strong>:
                    <em>${data.text}</em>
                 </div>`);
        })
        const lastElement = html.pop();
        const autor = data.pop().author;

        const div = document.createElement("div");
        const span = document.createElement("span");

        const date = new Date();
        const hours = date.getHours().toString().padStart(2, 0);
        const minutes = date.getMinutes().toString().padStart(2, 0);

        div.innerHTML = lastElement;
        span.innerHTML = `${hours}:${minutes}`

        console.log('El autor es: ' + autor);
        console.log('El Emiter es: ' + emiter);

        if (autor == emiter) {
            div.setAttribute("class", "containerdarker");
            span.setAttribute("class", "time-right");
        } else {
            div.setAttribute("class", "container");
            span.setAttribute("class", "time-right");
        }
        div.appendChild(span)
        document.querySelector('#messages').appendChild(div);
    }
}

function addMessage(event) {
    let payload = {
        author: emiter,
        text: document.querySelector('#texto').value,
        login: true
    };

    socket.emit('new-message', payload);
    return false;
}