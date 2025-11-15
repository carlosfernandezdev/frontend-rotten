// Función para obtener todas las series populares con paginación
const API_KEY = "f1ef49cd416d7f693bf8065608e66b38";

export const getAllSeries = async (page = 1) => {
  
  const LATEST_SERIES = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`;

  try {
    const rawData = await fetch(LATEST_SERIES);
    const json = await rawData.json();

    // Si no hay resultados, retorna un array vacío
    if (!json.results || json.results.length === 0) {
      return [];
    }

    return json.results.map((item) => {
      const {
        overview: description,
        first_air_date: releaseDate,
        name,
        poster_path: image,
        vote_average,
        id: seriesId,
        genre_ids,
      } = item;

      const img = `https://image.tmdb.org/t/p/w500${image}`;

      // Mapeo de IDs de géneros a nombres
      const genres = genre_ids.map(id => GENRES[id] || "Unknown");

      return {
        description,
        releaseDate,
        score: vote_average.toFixed(1),
        slug: seriesId,
        title: name,
        image: img,
        genres,  // Géneros incluidos
      };
    });
  } catch (error) {
    console.error('Error al obtener series populares:', error);
    return [];
  }
};

// Nueva función para obtener series populares con géneros
export const getLatestSeries = async () => {
  //const API_KEY = "f1ef49cd416d7f693bf8065608e66b38";
  const LATEST_SERIES = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`;

  const rawData = await fetch(LATEST_SERIES);
  const json = await rawData.json();

  return json.results.map((item) => {
    const { 
      overview: description, 
      first_air_date: releaseDate, 
      name, 
      poster_path: image, 
      vote_average, 
      id: seriesId, 
      genre_ids 
    } = item;

    const img = `https://image.tmdb.org/t/p/w500${image}`;

    // Mapeo de IDs de géneros a nombres
    const genres = genre_ids.map(id => GENRES[id] || "Unknown");

    return {
      description,
      releaseDate,
      score: vote_average.toFixed(1),
      slug: seriesId,
      title: name,
      image: img,
      genres,  // Géneros incluidos
    };
  });
};

// Nueva función para obtener detalles de una serie, incluyendo géneros y elenco
export async function getSeriesDetails(seriesId) {
  //const API_KEY = "f1ef49cd416d7f693bf8065608e66b38";
  const SERIES_DETAILS = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${API_KEY}&language=en-US`;
  const CREDITS_URL = `https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=${API_KEY}`;
  //const REVIEWS_URL = `https://api.themoviedb.org/3/tv/${seriesId}/reviews?api_key=${API_KEY}&language=en-US`;

  try {
    // Obtener detalles de la serie
    const rawData = await fetch(SERIES_DETAILS);
    const json = await rawData.json();
    //console.log(seriesId)
    const { 
      name: title, 
      overview: description, 
      vote_average, 
      first_air_date: releaseDate, 
      poster_path, 
      genres 
    } = json;

    const img = `https://image.tmdb.org/t/p/w500${poster_path}`;

    // Obtener nombres de géneros
    const genreNames = genres.map(genre => genre.name);

    // Obtener elenco
    const rawCredits = await fetch(CREDITS_URL);
    const creditsData = await rawCredits.json();
    const cast = creditsData.cast.map((member) => ({
      name: member.name,
      character: member.character,
      profileImg: member.profile_path ? `https://image.tmdb.org/t/p/w500${member.profile_path}` : null,
    }));

    // Obtener reseñas
    // const rawReviews = await fetch(REVIEWS_URL);
    // const reviewData = await rawReviews.json();
    // const reviews = reviewData.results && reviewData.results.length > 0
    //   ? reviewData.results.map((review) => {
    //     const { content: quote, author, created_at: date, author_details: {rating} } = review;
    //     //console.log('en api/movies review es:', review)
    //     //console.log('quote:', quote)
    //     //console.log('author:', author)
    //     //console.log('date:', date)
    //     //console.log('rating:', rating)
    //     return { quote, author, date, rating };
    //     })
    //   : [];  // Si no hay reseñas, asigna un arreglo vacío

    return {
      img,
      title,
      seriesId,
      description,
      score: vote_average.toFixed(1),
      releaseDate,
      genres: genreNames,  // Géneros incluidos
      cast,  // Elenco incluido
      //reviews,  // Reseñas
    };

  } catch (error) {
    console.error('Error al obtener detalles de la serie:', error);
    // Puedes manejar el error de forma adecuada en tu UI si es necesario
    return {
      error: "Hubo un problema al obtener los detalles de la serie."
    };
  }
}

export async function searchSeriesByName(query) {
  try {
    const SEARCH_URL = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}&language=en-US`;
    //console.log(SEARCH_URL);
    const rawData = await fetch(SEARCH_URL);
    const json = await rawData.json();
  
    ////console.log(json);
    //console.log(json.results.length);
    return json.results.map((item) => {
      const { overview: description, first_air_date: releaseDate, name, poster_path: image, vote_average, id: seriesId, genre_ids } = item;
  
      // Crear URL completa de la imagen
      const img = `https://image.tmdb.org/t/p/w500${image}`;
  
      // Mapear los géneros a partir de genre_ids
      const genres = genre_ids.map((id) => GENRES[id] || "Unknown");
  
      const serie = {
        description,
        releaseDate,
        score: vote_average.toFixed(1),
        slug: seriesId,
        title: name,
        image: img,
        genres,
      }
  
  
      //console.log(serie);
      return serie;
    })
  } catch (error) {
    console.error('Error al buscar series por nombre:', error);
  }
}
  //const

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
  10770: "TV serie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};
