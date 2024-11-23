let lastScrollTop = 0; // Guarda la posición previa del scroll
const navbar = document.querySelector('nav');
const links = document.querySelectorAll('.navbar-menu ul li a'); // Selecciona todos los enlaces
const userDisplay = document.querySelector('#user-display'); // Selecciona el user-display

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY; // Posición actual del scroll

    // Cambiar transparencia y estilos en función del scroll
    if (currentScroll === 0) {
        // Estado en la parte superior
        navbar.style.backgroundColor = `rgba(255, 255, 255, 0)`; // Fondo transparente
        navbar.style.boxShadow = 'none'; // Sin sombra
        navbar.classList.remove('navbar-scrolled'); // Quita la clase "navbar-scrolled"

        links.forEach(link => link.style.color = 'white'); // Cambia enlaces a blanco
        userDisplay.style.color = 'white'; // Cambia el color de user-display a blanco
    } else {
        // Estado al hacer scroll
        navbar.style.backgroundColor = `rgba(255, 255, 255, 1)`; // Fondo blanco
        navbar.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Sombra visible
        navbar.classList.add('navbar-scrolled'); // Agrega la clase "navbar-scrolled"

        links.forEach(link => link.style.color = '#00bcd4'); // Cambia enlaces a #00bcd4
        userDisplay.style.color = '#00bcd4'; // Cambia el color de user-display a #00bcd4
    }

    // Ocultar o mostrar navbar gradualmente
    if (currentScroll > lastScrollTop) {
        // Scroll hacia abajo: oculta el navbar
        navbar.style.transform = `translateY(-100%)`;
    } else {
        // Scroll hacia arriba: muestra el navbar
        navbar.style.transform = `translateY(0)`;
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Evita valores negativos
});