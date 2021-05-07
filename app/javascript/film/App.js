import { data } from "jquery";
import React, {useState} from "react";
import Form from "./components/Form/Form";
import Result from "./components/Result/Result";
import {moviesDataList}  from "./Movies";
require('dotenv').config();

const App = () => {
  const [movies, setMovies] = useState();
  const [selectedMovie, setSelectedMovie] = useState();
  const [runTime, setRunTime] = useState();
  const [trailer, setTrailer] = useState();
  const [error, setError] = useState(null);
  const [src, setSrc] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [popular, setPopular] = useState({});


  const getQueryString = (filterHash) => {
    let url = "";

    if (filterHash.yearFrom !== undefined || filterHash.yearTo !== undefined) {
      url += `&primary_release_date.gte=`

      if (filterHash.yearFrom !== undefined) {
        url += `${filterHash.yearFrom}-01-01`
      }

      url += "&primary_release_date.lte="

      if (filterHash.yearTo !== undefined) {
        url += `${filterHash.yearTo}-01-01`
      }
    }

    if (filterHash.rating !== undefined) {
      url += `&vote_average.gte=${(+filterHash.rating).toFixed(1)}`
    }

    if (filterHash.genres && filterHash.genres.length !== 0) {
      url += `&with_genres=${filterHash.genres.join(",")}`
    }

    return url;
  }

  const newFilterDataHandler = (yearFrom, yearTo, genres, rating) => {
    setFilterData({yearFrom, yearTo, genres, rating});
    findMovies({yearFrom, yearTo, genres, rating});
    setShowFilter(false);
  }

  const findMovies = (data) => {
    const q = getQueryString(data);
    const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&with_watch_monetization_types=flatrate&include_adult=false&include_video=true&page=1`;
    getMovies(BASE_URL + q);
  }

  const getMovies = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data)
    const transformedMovies = data.results.map((movie) => {
      return {
        id: movie.id,
        title: movie.title,
        description: movie.overview,
        rating: movie.vote_average,
        genres: movie.genre_ids,
        length: null,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        year: movie.release_date
      }
    })
    setMovies(transformedMovies);
    chooseMovie(transformedMovies);
  }

  const getRunTime = async (movieId) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    setRunTime(data.runtime);
  }

  const getTrailer = async (movieId) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    setTrailer(data.results[0].key);
  }

  const chooseMovie = (moviesData) => {
    const rand = Math.floor(Math.random() * moviesData.length);
    getRunTime(moviesData[rand].id);
    getTrailer(moviesData[rand].id);
    setSelectedMovie(moviesData[rand]);
  }

  const showFilterHandler = () => {
    setShowFilter(true);
  }

  const onCloseHandler = () => {
    setShowFilter(false);
  }

  const getPopular = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
    const data = await response.json();
    const transformedMovies = data.results.map((movie) => {
      return {
        id: movie.id,
        title: movie.title,
        description: movie.overview,
        rating: movie.vote_average,
        genres: movie.genre_ids,
        length: null,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        year: movie.release_date
      }
    })
    
    setPopular(transformedMovies[0]);
    getRunTime(transformedMovies[0].id);
    getTrailer(transformedMovies[0].id);
    setSelectedMovie(transformedMovies[0]);
  }

  return (
    <div className="app">
      <h1>WHAT MOVIE?</h1>
      {showFilter && <Form onSubmit={newFilterDataHandler} filterData={filterData} onClose={onCloseHandler} />}
      <div className="movie-controls d-flex flex-column">
        <button onClick={findMovies.bind(this, filterData)} className="btn btn-primary mt-3">GENERATE</button>
        <button onClick={showFilterHandler} className="btn btn-outline-primary mt-3"><span>FILTER</span></button>
      </div>
      {selectedMovie && <Result movie={selectedMovie} runtime={runTime} trailer={trailer}/>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default App;
