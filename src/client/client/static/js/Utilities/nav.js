const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        /* Ενεργοποίηση Nav */
        nav.classList.toggle('nav-active');

         /* Δημιουργία animation - Όταν κλείσουμε το burger menu να ξανα κάνει το animation */
        navLinks.forEach((link, index)=> {
        if(link.style.animation) { 
            link.style.animation = ''
        } else {
            link.style.animation = `navLinkFade 0.3s ease forwards ${index / 7 + 1}s`;
        }

    });
    /*Burger animation */
    burger.classList.toggle('toogle');
    });
}

navSlide();

document.getElementById("logout").addEventListener('click', (e) => {
    try {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userID");
        window.location.href = "/"
    } catch (e) {
        
    }
})
