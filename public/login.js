'use strict';

const modal = document.querySelector("#myModal");
const btnLogin = document.querySelector("#btnLogin");
const buttonLogin = document.querySelector('#buttonLogin');
const btnCancelLogin = document.querySelector(".btnCancelLogin");
const spanClose = document.querySelector(".close");

// When the user clicks the button, open the modal 

btnLogin.onclick = function () {
    if(btnLogin.innerHTML == '<i class="fa fa-user"></i> LOGIN'){
        modal.style.display = "block";
    }else{
        antwort = confirm("Wollen Sie sich abmelden?");
        if(antwort==true){
            btnLogin.innerHTML = '<i class="fa fa-user"></i> LOGIN'
        }else{}
    } 
}

// When the user clicks the button, send Data to server  
buttonLogin.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks on cancel, close the modal
btnCancelLogin.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
spanClose.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//fetch - Request POST

const nameLogin = document.querySelector('#nameLogin');
const passwordLogin = document.querySelector('#passwordLogin');

buttonLogin.addEventListener('click', () => {

    const meinRequest = new Request('/login', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            name: nameLogin.value,
            password: passwordLogin.value,
        })
    })

    fetch(meinRequest).then(
        answer => answer.json()
    ).then(
        data => {
            if (data.login == true) {
                alert('Willkommen ' + nameLogin.value)
                btnLogin.innerHTML = '<i class="fa fa-user"></i> ' + nameLogin.value
            } else {
                alert(data)
            }
        }
    )
})
        