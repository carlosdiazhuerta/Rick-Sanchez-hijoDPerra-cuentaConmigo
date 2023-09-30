// Importa los módulos y utilidades necesarios
import Header from '../templates/Header';
import Home from '../pages/Home';
import Character from '../pages/Character';
import Error404 from '../pages/Error404';
import getHash from '../utils/getHash';
import resolveRoutes from '../utils/resolveRoutes';
import getData from '../utils/getData';

// Define las rutas de la aplicación
const routes = {
    '/': Home,
    '/:id': Character,
    '/contact': 'Contact'
}

// Define la función principal del enrutador
const router = async () => {
    // Obtiene las referencias a los elementos del DOM
    const header = document.getElementById('header');
    const content = document.getElementById('content');

    // Renderiza el encabezado de la página
    header.innerHTML = await Header();

    // Obtiene el fragmento de ruta actual y resuelve la ruta correspondiente
    let hash = getHash();
    let route = await resolveRoutes(hash);

    // Decide qué componente debe renderizarse en función de la ruta
    let render = routes[route] ? routes[route] : Error404;

    // Renderiza el componente en el contenido principal
    content.innerHTML = await render();

    // Variables para controlar la paginación
    let currentPage = 1; // Página actual
    const itemsPerPage = 20; // Cantidad de elementos por página

    // Función para cargar más personajes
    async function getMoreCharacters() {
        currentPage++; // Aumenta la página actual
        const newData = await getData(`?page=${currentPage}`); // Obtiene datos de la siguiente página

        // Renderiza los nuevos datos en tu aplicación, por ejemplo, agregándolos a la lista existente.
        // Utiliza newData.results para obtener los elementos adicionales y agregarlos al contenido actual.
        const newCharacters = newData.results.map(character => `
            <article class="characters-item">
                <a href="#/${character.id}/">
                    <img data-src="${character.image}" alt="${character.name}">
                    <h2 class="character-name">${character.name}</h2>
                </a>
            </article>
        `).join('');

        // Agrega los nuevos personajes al contenido
        content.querySelector('.characters').innerHTML += newCharacters;

        // Observa las nuevas imágenes
        const newImages = content.querySelectorAll('.characters-item img[data-src]');
        newImages.forEach(image => {
            observer.observe(image);
        });
    }

    // Observador de intersección para cargar imágenes a medida que se hacen visibles en la pantalla
    const img = content.querySelectorAll("img[data-src]");
    function intersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
            }
        });
    }

    // Crea un observador de intersección y observa las imágenes
    const observer = new IntersectionObserver(intersection);
    img.forEach(imagen => {
        observer.observe(imagen);
    });

    // Agrega un observador de scroll infinito
    window.addEventListener("scroll", () => {
        const contentHeight = content.offsetHeight;
        const yOffset = window.pageYOffset;
        const windowHeight = window.innerHeight;

        // Si se ha llegado al final de la página, carga más personajes
        if (yOffset + windowHeight >= contentHeight) {
            getMoreCharacters();
        }
    });

    // Estilos y manejo del modo oscuro
    const $header = header;
    const $btnSwitch = $header.querySelector('#switch');

    $btnSwitch.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        $btnSwitch.classList.toggle('active');

        // Guarda el modo en localStorage
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('dark-mode', 'true');
        } else {
            localStorage.setItem('dark-mode', 'false');
        }
    });

    // Restaura el modo oscuro desde localStorage
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark');
        $btnSwitch.classList.add('active');
    } else {
        document.body.classList.remove('dark');
        $btnSwitch.classList.remove('active');
    }
}

// Exporta la función del enrutador
export default router;
