import React from "react";
import './App.css';
import Form from "./components/Form/Form";
import Result from "./components/Result/Result";

const App = () => {
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

    console.log(BASE_URL + q); // do post request here
  }

  return (
    <div className="App">
      <h1>Find me a movie</h1>
      <Form onSubmit={findMovies}/>
      <Result />
    </div>
  );
}

export default App;
