import React, { useState } from "react";
import './Form.css';

const Form = (props) => {

  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [genres, setGenres] = useState([]);
  const [rating, setRating] = useState("");

  // const [invalidYearTo, setInvalidYearTo] = useState(false);
  // const [invalidYearFrom, setInvalidYearFrom] = useState(false);

  const formSubmitHandler = (event) => {
    event.preventDefault();

    // setInvalidYearTo(yearTo.length !== 4);
    // setInvalidYearFrom(yearFrom.length !== 4);

    // if (invalidYearFrom || invalidYearTo) return;
    
    props.onSubmit(yearFrom, yearTo, genres, rating);

    setYearFrom("");
    setYearTo("");
    setGenres([]);
    setRating("");
    // setInvalidYearTo(false);
    // setInvalidYearFrom(false);
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
      <form onSubmit={formSubmitHandler}>
        <div className="d-flex justify-content-between">

{/*
          <div className="form-group">
            <label htmlFor="year-from">Year from</label>
            <input className="form-control" onChange={yearFromChangedHandler} min="0" type="number" id="year-from"  value={yearFrom} />
            {invalidYearFrom && <small id="year-from" className="form-text text-muted">Please enter a valid format (YYYY)</small>}
          </div>

          <div className="form-group">
            <label htmlFor="year-to">Year to</label>
            <input className="form-control" onChange={yearToChangedHandler} min="0" type="number" id="year-to"  value={yearTo} />
            {invalidYearTo && <small id="year-to" className="form-text text-muted">Please enter a valid format (YYYY)</small>}
          </div>
*/}
          <div className="form-group">
            <label htmlFor="year-from">Year from</label>
            <select className="form-control" onChange={yearFromChangedHandler} id="year-from" value={yearFrom} >
              {getYearOptions()}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="year-to">Year to</label>
            <select className="form-control" onChange={yearToChangedHandler} id="year-to" value={yearTo} >
              {getYearOptions()}
            </select>
          </div>


          <div className="form-group">
            <label htmlFor="rating">Minimum rating</label>
            <select className="form-control" onChange={ratingChangedHandler} id="rating" value={rating} >
              <option value="">-</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>          
            </select>
          </div>
        </div>

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

        <button className="btn btn-primary" type="submit">Search</button>
      </form>
      

  );
}

export default Form;
