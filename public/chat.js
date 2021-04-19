'use strict';

const modal = document.querySelector("#myModal");
const btn = document.querySelector("#myBtn");
const span = document.querySelector(".close");
const mainContainer = document.querySelector(".mainContainer");

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
    mainContainer.innerHTML = "";
    const divMessages = document.createElement("div");
    divMessages.setAttribute("id", "messages");
    mainContainer.appendChild(divMessages);
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}