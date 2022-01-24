const API_KEY = "cc4d1dd0c0cd3d659a1304f42211ad26";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies(){
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
  .then(response=>response.json()
  )}