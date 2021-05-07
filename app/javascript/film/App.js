import { data } from "jquery";
import React, {useState} from "react";
import Form from "./components/Form/Form";
import Result from "./components/Result/Result";
import {moviesData}  from "./Movies";
require('dotenv').config();

const App = () => {
  const [movies, setMovies] = useState(moviesData);
  const [selectedMovie, setSelectedMovie] = useState();
  const [error, setError] = useState(null);
  const [src, setSrc] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterData, setFilterData] = useState({});


  const getQueryString = (filterHash) => {
    console.log(filterHash)
    let url = "?title_type=feature";

    if (filterHash.yearFrom !== "" || filterHash.yearTo !== "") {
      url += `&release_date=`

      if (filterHash.yearFrom !== "") {
        url += `${filterHash.yearFrom}-01-01`
      }

      url += ","

      if (filterHash.yearTo !== "") {
        url += `${filterHash.yearTo}-01-01`
      }
    }

    if (filterHash.rating !== "") {
      url += `&user_rating=${filterHash.rating}.0,`
    }

    if (filterHash.genres && filterHash.genres.length !== 0) {
      url += `&genres=${filterHash.genres.join()}`
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
    const BASE_URL = "https://www.imdb.com/search/title/";
    // postUrl(BASE_URL + q);
    chooseMovie(moviesData);
  }

  const postUrl = async (url) => {
    setError(null);

    try {
      const response = await fetch("/api/v1/search", {
        method: "POST",
        body: JSON.stringify({url}),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      
      const data = await response.json();

      if (data.length === 0 ) {
        throw new Error("No movies were found!");
      }

      setMovies(data);
      chooseMovie(data);
      
    } catch (errorThrown) {
      setError(errorThrown.message);
    }

  }

  const chooseMovie = (moviesData) => {
    const rand = Math.floor(Math.random() * moviesData.length);
    setSelectedMovie(moviesData[rand]);
    console.log(selectedMovie)
    getMoviePoster(moviesData[rand]);
  }

  const getMoviePoster = async (movie) => {
    setSrc(null);
    
    const url = `http://img.omdbapi.com/?apikey=${process.env.POSTER_API_KEY}&i=${movie.id}`;
    const response = await fetch(url);

    if (response.ok) {       
      const blob = await response.blob();
      setSrc(URL.createObjectURL(blob));
    }
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
      <div className="movie-controls d-flex flex-column">
        <button onClick={findMovies.bind(this, filterData)} className="btn btn-primary mt-3">GENERATE</button>
        <button onClick={showFilterHandler} className="btn btn-outline-primary mt-3"><span>FILTER</span></button>
      </div>
      {selectedMovie && <Result movie={selectedMovie} src={src}/>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default App;
