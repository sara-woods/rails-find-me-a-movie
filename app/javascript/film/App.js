import React, {useState} from "react";
import './App.css';
import Form from "./components/Form/Form";
import Result from "./components/Result/Result";
import {moviesData}  from "./Movies";

const App = () => {
  const [movies, setMovies] = useState(moviesData);
  const [selectedMovie, setSelectedMovie] = useState();

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
    
    // postUrl(BASE_URL + q);
    chooseMovie();
  }

  const postUrl = (url) => {
    console.log(url);
    fetch("http://localhost:3000/api/v1/search", {
      method: "POST",
      body: JSON.stringify({url}),
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      setMovies(data);
      chooseMovie();
    })
  }

  const chooseMovie = () => {
    const rand = Math.floor(Math.random() * movies.length);
    setSelectedMovie(movies[rand]);
  }

  return (
    <div className="App">
      <h1>Find me a movie</h1>
      <Form onSubmit={findMovies}/>
      <Result movie={selectedMovie}/>
    </div>
  );
}

export default App;
