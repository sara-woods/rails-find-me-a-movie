import React, { useState } from "react";

const Form = (props) => {
  const [yearFrom, setYearFrom] = useState(props.filterData.yearFrom);
  const [yearTo, setYearTo] = useState(props.filterData.yearTo);
  const [genres, setGenres] = useState(props.filterData.genres);
  const [rating, setRating] = useState(props.filterData.rating || "0");

  const formSubmitHandler = (event) => {
    event.preventDefault();

    if (yearFrom > yearTo) {
      props.onSubmit(yearTo, yearFrom, genres, rating);
    } else {
      props.onSubmit(yearFrom, yearTo, genres, rating);
    }
  };

  const yearFromChangedHandler = (event) => {
    setYearFrom(event.target.value);
  };

  const yearToChangedHandler = (event) => {
    setYearTo(event.target.value);
  };

  const genreChangedHandler = (event) => {
    const genresInput = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setGenres(genresInput);
  };

  const ratingChangedHandler = (event) => {
    setRating(event.target.value);
  };

  const getYearOptions = () => {
    const createOption = (t, v) => {
      return (
        <option key={t} value={v}>
          {t}
        </option>
      );
    };

    const endYear = new Date().getFullYear();
    const yearOptions = [];

    yearOptions.push(createOption("-", ""));
    for (let i = endYear; i >= 1900; i--) {
      yearOptions.push(createOption(i, i));
    }

    return yearOptions;
  };

  return (
    <>
      <div className="form-underlay" onClick={props.onClose}></div>
      <div className="form-container">
        <form onSubmit={formSubmitHandler}>
          <label className="form-header mb-2 mt-2">Year</label>
          <div className="d-flex justify-content-between">
            <div className="form-group">
              <select
                className="form-control"
                onChange={yearFromChangedHandler}
                id="year-from"
                value={yearFrom}
                aria-label="Year from"
              >
                <option value="" disabled selected>From</option>
                {getYearOptions()}
              </select>
            </div>

            <div className="form-group">
              <select
                className="form-control"
                onChange={yearToChangedHandler}
                id="year-to"
                value={yearTo}
                aria-label="Year to"
              >
                <option value="" disabled selected>To</option>
                {getYearOptions()}
              </select>
            </div>
          </div>
          <p className="form-header mb-1 mt-4">Minimum rating</p>
          <label htmlFor="customRange1">{(+rating).toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="9"
            step="0.5"
            className="custom-range"
            id="customRange1"
            onChange={ratingChangedHandler}
            value={rating}
          />

          <div className="form-group">
            <label htmlFor="genres" className="form-header mt-4">Genres</label>
            <select
              className="form-control"
              onChange={genreChangedHandler}
              id="genres"
              multiple={true}
              value={genres}
            >
              <option value="28">Action</option>
              <option value="12">Adventure</option>
              <option value="16">Animation</option>
              <option value="35">Comedy</option>
              <option value="80">Crime</option>
              <option value="99">Documentary</option>
              <option value="18">Drama</option>
              <option value="10751">Family</option>
              <option value="14">Fantasy</option>
              <option value="36">History</option>
              <option value="27">Horror</option>
              <option value="10402">Musical</option>
              <option value="9648">Mystery</option>
              <option value="10749">Romance</option>
              <option value="878">Sci-Fi</option>
              <option value="53">Thriller</option>
              <option value="10752">War</option>
              <option value="37">Western</option>
            </select>
          </div>

          <button className="btn btn-primary btn-block mt-4" type="submit">
            Generate
          </button>
          <button
            className="btn btn-outline-primary btn-block"
            onClick={props.onClose}
          >
            Cancel
          </button>
        </form>
      </div>
    </>
  );
};

export default Form;
