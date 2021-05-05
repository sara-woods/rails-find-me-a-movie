import React from "react";
import './Result.css';

const Result = (props) => {
  if (!props.movie) return null;

  const { title, year, rating, length, genres } = props.movie;

  return (
    <div>
      <h1>Result</h1>
      <h2>{title}</h2>
      <h2>{year}</h2>
      <h2>{rating}</h2>
      <h2>{length}</h2>
      <h2>{genres}</h2>
    </div>
  );
}

export default Result;
