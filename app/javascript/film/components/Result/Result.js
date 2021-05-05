import React from "react";
import './Result.css';

const Result = (props) => {
  
  const { title, year, rating, length, genres, description } = props.movie;

  return (
    <div>
      <h1>Result</h1>
      <h2>{title}</h2>
      <h2>{year}</h2>
      <h2>{rating}</h2>
      <h2>{length}</h2>
      <h2>{genres}</h2>
      <h2>{description}</h2>
    </div>
  );
}

export default Result;
