import React from "react";
import './Result.css';

const Result = (props) => {
  const { title, year, rating, length, genres, description, movie_url } = props.movie;

  return (
    <div>
      <h1>Result</h1>
      <a href={movie_url} target="_blank" rel="noreferrer noopener">
        <h2>{title}</h2>
      </a>
      <h2>{year}</h2>
      <h2>{rating}</h2>
      <h2>{length}</h2>
      <h2>{genres}</h2>
      <h2>{description}</h2>
      {props.src && <img src={props.src}/>}
    </div>
  );
}

export default Result;
