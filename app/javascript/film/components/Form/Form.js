import React, { useState } from "react";
import './Form.css';

const Form = (props) => {

  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [genres, setGenres] = useState([]);
  const [rating, setRating] = useState("0");

  const formSubmitHandler = (event) => {
    event.preventDefault();
    console.log(yearFrom, yearTo, genres, rating)
    props.onSubmit(yearFrom, yearTo, genres, rating);
  }

  const yearFromChangedHandler = (event) => {
    setYearFrom(event.target.value);
  }

  const yearToChangedHandler = (event) => {
    setYearTo(event.target.value);
  }

  const genreChangedHandler = (event) => {
    const genresInput = Array.from(event.target.selectedOptions, option => option.value);
    setGenres(genresInput);
  }

  const ratingChangedHandler = (event) => {
    setRating(event.target.value);
  }

  const getYearOptions = () => {
    const createOption = (t, v) => {
      return <option key={t} value={v}>{t}</option>
    }

    const endYear = new Date().getFullYear();
    const yearOptions = [];

    yearOptions.push(createOption("-", ""))
    for (let i = endYear; i >= 1900; i--) {
      yearOptions.push(createOption(i, i))
    }

    return yearOptions;
  }

  return (
    <div className="form-container">
      <form onSubmit={formSubmitHandler}>

        <div className="d-flex justify-content-between">
          <div className="form-group">
            <label htmlFor="year-from">From</label>
            <select className="form-control" onChange={yearFromChangedHandler} id="year-from" value={yearFrom} >
              {getYearOptions()}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="year-to">To</label>
            <select className="form-control" onChange={yearToChangedHandler} id="year-to" value={yearTo} >
              {getYearOptions()}
            </select>
          </div>
        </div>

        <label htmlFor="customRange1">{`Minimum Rating: ${(+rating).toFixed(1)}`}</label>
        <input type="range" min="0" max="9" step="0.5" className="custom-range" id="customRange1" onChange={ratingChangedHandler} value={rating} />

        <div className="form-group">
          <label htmlFor="genres">Genres</label>
          <select className="form-control" onChange={genreChangedHandler} id="genres" multiple={true} value={genres} >
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="animation">Animation</option>
            <option value="biography">Biography</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
            <option value="documentary">Documentary</option>
            <option value="drama">Drama</option>
            <option value="family">Family</option>
            <option value="fantasy">Fantasy</option>
            <option value="film-noir">Film-Noir</option>
            <option value="history">History</option>
            <option value="horror">Horror</option>
            <option value="musical">Musical</option>
            <option value="mystery">Mystery</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="sport">Sport</option>
            <option value="thriller">Thriller</option>
            <option value="war">War</option>
            <option value="western">Western</option>
          </select>
        </div>

        <button className="btn btn-primary" type="submit">Generate</button>
      </form>
    </div>
      

  );
}

export default Form;
