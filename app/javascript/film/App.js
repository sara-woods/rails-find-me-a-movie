// import { data } from "jquery";
import React, {useState} from "react";
import Form from "./components/Form/Form";
import Result from "./components/Result/Result";

const App = () => {
  const [movies, setMovies] = useState();
  const [selectedMovie, setSelectedMovie] = useState();
  const [runTime, setRunTime] = useState();
  const [trailer, setTrailer] = useState();
  const [error, setError] = useState(null);
  
  const [showFilter, setShowFilter] = useState(false);
  const [filterData, setFilterData] = useState({});
  // const [popular, setPopular] = useState({});
  const [movieIndex, setMovieIndex] = useState(0);
  const [moviePageIndex, setMoviePageIndex] = useState(1);
  // const [findMoviesUrl, setFindMoviesUrl] = useState("https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&with_watch_monetization_types=flatrate&include_adult=false&include_video=false&page=1");

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
    const newFilterInput = {yearFrom, yearTo, genres, rating};

    setShowFilter(false);

    for (const [key, value] of Object.entries(newFilterInput)) {
      if (filterData[key] !== value) {
        setFilterData(newFilterInput);
        setMovieIndex(0);
        findMovies(newFilterInput);
        
        return;
      }
    }
    chooseMovie(movies);
  }

  const generateButtonHandler = () => {
    // app has just initialised
    if (!movies) {
      
      findMovies(filterData);
    } else {
      chooseMovie(movies);
    }
  }

  const findMovies = (filterInput) => {
    console.log(movies)
    const q = getQueryString(filterInput);
    const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&with_watch_monetization_types=flatrate&include_adult=false&include_video=false&page=${moviePageIndex}`;
    console.log(BASE_URL)
    getMovies(BASE_URL + q);
  }

  const getMovies = async (url) => {
    setError(null);
    console.log("request starts");
    console.log(url);
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      
      if (data.results.length === 0) {
        throw new Error("Sorry, no movies were found.");
      }
      
      const transformedMovies = data.results.map((movie) => {
        return {
          id: movie.id,
          title: movie.title,
          description: movie.overview,
          rating: movie.vote_average,
          genres: movie.genre_ids,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          year: movie.release_date
        }
      })
      setMovies(transformedMovies);
      // setMoviePageIndex(prevState => prevState += 1);
      chooseMovie(transformedMovies);
    } catch (errorThrown) {
      setError(errorThrown.message);
    }
  }

  const getRunTime = async (movieId) => {
    setError(null);
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
      const data = await response.json();
      setRunTime(data.runtime);
      console.log(data.runtime);
    } catch {
      setRunTime(null);
    }
  }

  const getTrailer = async (movieId) => {
    setError(null);
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
      const data = await response.json();
      setTrailer(data.results[0].key);
    } catch {
      setTrailer(null);
    }
  }

  const chooseMovie = (moviesData) => {
    // const rand = Math.floor(Math.random() * moviesData.length);
    // getRunTime(moviesData[rand].id);
    // getTrailer(moviesData[rand].id);
    // setSelectedMovie(moviesData[rand]);
    getRunTime(moviesData[movieIndex].id);
    getTrailer(moviesData[movieIndex].id);
    setSelectedMovie(moviesData[movieIndex]);
    console.log(movieIndex);
    console.log(moviePageIndex);

    if (movieIndex < moviesData.length - 1) {
      setMovieIndex(prevState => prevState += 1);
    } else {
      setMovieIndex(0);
      setMoviePageIndex(prevState => prevState += 1);
      // findMovies(filterData);
    }
  }

  const showFilterHandler = () => {
    setShowFilter(true);
  }

  const onCloseHandler = () => {
    setShowFilter(false);
  }

  // const getPopular = async () => {
  //   const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
  //   const data = await response.json();
  //   const transformedMovies = data.results.map((movie) => {
  //     return {
  //       id: movie.id,
  //       title: movie.title,
  //       description: movie.overview,
  //       rating: movie.vote_average,
  //       genres: movie.genre_ids,
  //       length: null,
  //       poster_path: movie.poster_path,
  //       backdrop_path: movie.backdrop_path,
  //       year: movie.release_date
  //     }
  //   })
    
  //   setPopular(transformedMovies[0]);
  //   getRunTime(transformedMovies[0].id);
  //   getTrailer(transformedMovies[0].id);
  //   setSelectedMovie(transformedMovies[0]);
  // }

  return (
    <div className="app">
      <h1>WHAT MOVIE?</h1>
      {showFilter && <Form onSubmit={newFilterDataHandler} filterData={filterData} onClose={onCloseHandler} />}
      <div className="movie-controls">
        <button onClick={generateButtonHandler} className="btn btn-primary mt-3">GENERATE</button>
        <button onClick={showFilterHandler} className="btn btn-outline-primary mt-3"><span>FILTER</span></button>
      </div>
      {selectedMovie && <Result movie={selectedMovie} runtime={runTime} trailer={trailer}/>}
      {error && <p className="mt-5">{error}</p>}
    </div>
  );
}

export default App;
