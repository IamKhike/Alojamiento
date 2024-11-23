let lastScrollTop = 0; // Guarda la posición previa del scroll
const navbar = document.querySelector('nav');
const links = document.querySelectorAll('.navbar-menu ul li a'); // Selecciona todos los enlaces

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY; // Posición actual del scroll
    const opacity = Math.max(0, Math.min(1, 1 - currentScroll / 200)); // Calcula opacidad (entre 0 y 1)

    // Cambiar transparencia y estilo en la parte superior de la página
    if (currentScroll === 0) {
        navbar.style.backgroundColor = `rgba(255, 255, 255, 0)`; // Fondo transparente
        navbar.style.boxShadow = 'none'; // Sin sombra
        navbar.classList.remove('navbar-scrolled'); // Quita la clase "navbar-scrolled"

        links.forEach(link => {
            link.style.color = 'white'; // Cambia el texto a blanco
        });
    } else {
        navbar.style.backgroundColor = `rgba(255, 255, 255, 1)`; // Fondo blanco sólido
        navbar.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Sombra visible
        navbar.classList.add('navbar-scrolled'); // Agrega la clase "navbar-scrolled"

        links.forEach(link => {
            link.style.color = 'black'; // Cambia el texto a negro
        });
    }
    
    //aplica o quita la clase cuando hay scroll
    if (currentScroll > 0) {
        navbar.classList.add('navbar-scrolled'); // Aplica la clase cuando hay scroll
    } else {
        navbar.classList.remove('navbar-scrolled'); // Quita la clase en la parte superior
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
