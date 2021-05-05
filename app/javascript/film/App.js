import { data } from "jquery";
import React, {useState} from "react";
import './App.css';
import Form from "./components/Form/Form";
import Result from "./components/Result/Result";
import {moviesData}  from "./Movies";
require('dotenv').config();

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState();
  const [error, setError] = useState(null);
  const [src, setSrc] = useState(null);

  const getQueryString = (yearFrom, yearTo, genres, rating) => {
    let url = "?title_type=feature";

    if (yearFrom !== "" || yearTo !== "") {
      url += `&release_date=`

      if (yearFrom !== "") {
        url += `${yearFrom}-01-01`
      }

      url += ","

      if (yearTo !== "") {
        url += `${yearTo}-01-01`
      }
    }

    if (rating !== "") {
      url += `&user_rating=${rating}.0,`
    }

    if (genres.length !== 0) {
      url += `&genres=${genres.join()}`
    }

    return url;
  }

  const findMovies = (yearFrom, yearTo, genres, rating) => {
    const q = getQueryString(yearFrom, yearTo, genres, rating);
    const BASE_URL = "https://www.imdb.com/search/title/";
    
    postUrl(BASE_URL + q);
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

  return (
    <div className="App">
      <h1>Find me a movie</h1>
      <Form onSubmit={findMovies}/>
      {selectedMovie && <Result movie={selectedMovie} src={src}/>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default App;
