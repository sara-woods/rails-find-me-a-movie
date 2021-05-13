// import { data } from "jquery";
import React, { useState, useEffect, useReducer } from "react";
import Form from "./components/Form/Form";
import Result from "./components/Result/Result";

const selectedMovieReducer = (state, action) => {
  switch (action.type) {
    case "NEW_MOVIE":
      return { movie: action.val, runtime: state.runtime, trailer: state.trailer };
    case "NEW_RUNTIME":
      return { movie: state.movie, runtime: action.val, trailer: state.trailer };
    case "NEW_TRAILER":
      return { movie: state.movie, runtime: state.runtime, trailer: action.val };
    default:
      return { movie: null, runtime: null, trailer: null };
  }
}

const App = () => {
  const [movies, setMovies] = useState();

  const [selectedMovieState, dispatchSelectedMovie] = useReducer(selectedMovieReducer, {movie: null, runtime: null, trailer: null });

  const [movieIndex, setMovieIndex] = useState(0);
  const [moviePageIndex, setMoviePageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState();

  const [error, setError] = useState(null);
  
  const [showFilter, setShowFilter] = useState(false);
  const [filterData, setFilterData] = useState({});
  
  
  useEffect(() => {
    if (!movies) {
      return;
    }
    if (movieIndex < movies.length - 1) {
      setMovieIndex(prevState => prevState += 1);
    } else {
      setMovieIndex(0);
      setMovies(null);
      if (moviePageIndex < totalPages) {
        setMoviePageIndex(prevState => prevState += 1);
      } else {
        setMoviePageIndex(1);
      }
    }
  }, [selectedMovieState.movie])


  // useEffect(() => {
  //   const getPopular = async () => {
  //     const response = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_TMDB_API_KEY}`);
  //     const data = await response.json();
  //     const transformedMovies = data.results.map((movie) => {
  //       return {
  //         id: movie.id,
  //         title: movie.title,
  //         description: movie.overview,
  //         rating: movie.vote_average,
  //         genres: movie.genre_ids,
  //         length: null,
  //         poster_path: movie.poster_path,
  //         backdrop_path: movie.backdrop_path,
  //         year: movie.release_date
  //       }
  //     })
      
      
  //     console.log("useeffect")
  //     getPopular();
  //     getRunTime(transformedMovies[0].id);
  //     getTrailer(transformedMovies[0].id);
  //     setSelectedMovie(transformedMovies[0]);
  //   }
  // }, [])


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
    const q = getQueryString(filterInput);
    const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&with_watch_monetization_types=flatrate&include_adult=false&include_video=false&page=${moviePageIndex}`;
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
      console.log(data);
      
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
      setTotalPages(data.total_pages);
      setMovies(transformedMovies);
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

      dispatchSelectedMovie({type: "NEW_RUNTIME", val: data.runtime})
    } catch {
      dispatchSelectedMovie({type: "NEW_RUNTIME", val: null})
    }
  }

  const getTrailer = async (movieId) => {
    setError(null);
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
      const data = await response.json();
      dispatchSelectedMovie({type: "NEW_TRAILER", val: data.results[0].key});
    } catch {
      dispatchSelectedMovie({type: "NEW_TRAILER", val: null});
    }
  }

  const chooseMovie = (moviesData) => {
    getRunTime(moviesData[movieIndex].id);
    getTrailer(moviesData[movieIndex].id);
    dispatchSelectedMovie({type: "NEW_MOVIE", val: moviesData[movieIndex]});
  }

  const showFilterHandler = () => {
    setShowFilter(true);
  }

  const onCloseHandler = () => {
    setShowFilter(false);
  }

  return (
    <div className="app">
      <h1>WHAT MOVIE?</h1>
      {showFilter && <Form onSubmit={newFilterDataHandler} filterData={filterData} onClose={onCloseHandler} />}
      <div className="movie-controls">
        <button onClick={generateButtonHandler} className="btn btn-primary mt-3">GENERATE</button>
        <button onClick={showFilterHandler} className="btn btn-outline-primary mt-3"><span>FILTER</span></button>
      </div>
      {selectedMovieState.movie && !error && <Result movie={selectedMovieState.movie} runtime={selectedMovieState.runtime} trailer={selectedMovieState.trailer}/>}
      {error && <p className="mt-5">{error}</p>}
    </div>
  );
}

export default App;
