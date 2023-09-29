import Header from '../templates/Header';
import getHash from '../utils/getHash';
import getData from '../utils/getData';

const Character = async () => {
    const id = getHash();
    const character = await getData(id);

    // Verifica si character.image es válido antes de usarlo
    if (character.image) {
        const view = `
            <section class="characters-inner">
                <article class="characters-card">
                    <img src="${character.image}" alt="${character.name}">
                    <h2>${character.name}</h2>
                </article>
                <article class="characters-card">
                    <h3>Episodes: <span>${character.episode.length}</span></h3>
                    <h3>Status: <span>${character.status}</span></h3>
                    <h3>Species: <span>${character.species}</span></h3>
                    <h3>Gender: <span>${character.gender}</span></h3>
                    <h3>Origin: <span>${character.origin.name}</span></h3>
                    <h3>Last Location: <span>${character.location.name}</span></h3>
                </article>
            </section>
        `;

        return view;
    } else {
        // Si character.image es undefined, muestra un mensaje de error
        return '<p>Error: No se encontró una imagen para este personaje.</p>';
    }
};

export default Character;
