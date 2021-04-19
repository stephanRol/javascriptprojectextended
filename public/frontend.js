'use strict';

const sendForm = () => {
    const btnSend = document.querySelector('#contactButton');
    const nameContact = document.querySelector('#nameContact');
    const emailContact = document.querySelector('#emailContact');
    const nachrichtContact = document.querySelector('#nachrichtContact');

    btnSend.addEventListener('click', () => {

        const meinRequest = new Request('/send', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                name: nameContact.value,
                email: emailContact.value,
                nachricht: nachrichtContact.value
            })
        })

        setTimeout(() => {
            alert("Die Daten wurden gesendet, clicken sie bestätigen und warten Sie ein moment bis sie die Bestätigung erhalten")
        }, 200)

        fetch(meinRequest).then(
            answer => answer.json()
        ).then(
            data => alert(data)
        )
    })
}
sendForm();

const btnChat = document.querySelector('#btnChat');
btnChat.addEventListener('click', () => {
    const btnLogin = document.querySelector("#btnLogin");

    if (btnLogin.textContent == ' LOGIN') {
        alert('Bitte einloggen!')
    } else {

        const url = 'http://localhost:8080/chat'
        window.open(url, '_blank')

        const meinRequest = new Request('/websocket', {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                name: btnLogin.textContent,
            })
        })
        fetch(meinRequest).then(
            answer => console.log(answer)
        )
    }
})

