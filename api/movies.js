// Obtener últimas películas populares
const API_KEY = "f1ef49cd416d7f693bf8065608e66b38";
export async function getLatestMovies() {
  
  const LATEST_MOVIES = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

  const rawData = await fetch(LATEST_MOVIES);
  const json = await rawData.json();

  return json.results.map((item) => {
    const { overview: description, release_date: releaseDate, title, poster_path: image, vote_average, id: movieId, genre_ids } = item;

    // Crear URL completa de la imagen
    const img = `https://image.tmdb.org/t/p/w500${image}`;

    // Mapear los géneros a partir de genre_ids
    const genres = genre_ids.map((id) => GENRES[id] || "Unknown");

    return {
      description,
      releaseDate,
      score: vote_average.toFixed(1),
      slug: movieId,
      title,
      image: img,
      genres,
    };
  });
}

// Obtener todas las películas (incluye películas viejas y permite paginación)
// Obtener todas las películas populares

export async function getAllMovies(page = 1) {
  
  const BASE_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
  //console.log(BASE_URL);
  const response = await fetch(BASE_URL);
  const json = await response.json();

  return json.results.map((item) => {
    
    const {
      overview: description,
      release_date: releaseDate,
      title,
      poster_path: image,
      vote_average,
      id: movieId,
      genre_ids,
    } = item;

    //console.log(title)

    const img = `https://image.tmdb.org/t/p/w500${image}`;
    const genres = genre_ids.map((id) => GENRES[id] || "Unknown");

    return {
      description,
      releaseDate,
      score: vote_average.toFixed(1),
      slug: movieId,
      title,
      image: img,
      genres,
    };
  });
}

// Obtener múltiples páginas de películas (para paginación continua)
export async function getMoviesWithPagination(totalPages = 5) {
  const allMovies = [];
  let page = 1;

  // Obtener películas por cada página
  while (page <= totalPages) {
    const movies = await getAllMovies(page);
    allMovies.push(...movies); // Añadir las películas obtenidas
    page++;
  }

  return allMovies;
}

// Obtener detalles de una película, incluyendo elenco, reseñas y géneros
export async function getMovieDetails(movieId) {
  //const API_KEY = "f1ef49cd416d7f693bf8065608e66b38";
  const MOVIE_DETAILS = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
  const CREDITS_URL = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`;

  // Obtener detalles de la película
  const rawData = await fetch(MOVIE_DETAILS);
  const json = await rawData.json();
  const { title, overview: description, vote_average, release_date: releaseDate, poster_path, genres } = json;
  const img = `https://image.tmdb.org/t/p/w500${poster_path}`;

  // Obtener nombres de géneros
  const genreNames = genres.map((genre) => genre.name);

  // Obtener elenco
  const rawCredits = await fetch(CREDITS_URL);
  const creditsData = await rawCredits.json();
  const cast = creditsData.cast.map((member) => ({
    name: member.name,
    character: member.character,
    profileImg: member.profile_path ? `https://image.tmdb.org/t/p/w500${member.profile_path}` : null,
  }));

  return {
    img,
    title,
    movieId,
    description,
    score: vote_average.toFixed(1),
    releaseDate,
    genres: genreNames,
    cast,
  };
}

export async function searchMovieByName(query) {
  const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=en-US`;
  //console.log(SEARCH_URL);
  const rawData = await fetch(SEARCH_URL);
  const json = await rawData.json();

  ////console.log(json);
  //console.log(json.results.length);
  return json.results.map((item) => {
    const { overview: description, release_date: releaseDate, title, poster_path: image, vote_average, id: movieId, genre_ids } = item;

    // Crear URL completa de la imagen
    const img = `https://image.tmdb.org/t/p/w500${image}`;

    // Mapear los géneros a partir de genre_ids
    const genres = genre_ids.map((id) => GENRES[id] || "Unknown");

    const movie = {
      description,
      releaseDate,
      score: vote_average.toFixed(1),
      slug: movieId,
      title,
      image: img,
      genres,
    }


    //console.log(movie.title);
    return movie;
  });
}



// Mapeo de géneros comunes
const GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

