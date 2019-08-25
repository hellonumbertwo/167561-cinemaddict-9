import {createMovieTemplate} from "./../movie/movie";

export const createMoviesListTemplate = (moviesList) => `
    <div class="films-list__container" id="movies-list">
        ${moviesList.map((movie) => createMovieTemplate(movie)).join(``)}
    </div>
`;
