import React from "react";
import { genresIds } from "../../Genres";

const Result = (props) => {
  const { title, year, rating, genres, description, movie_url, id, poster_path, backdrop_path } = props.movie;

  const hours = Math.floor(props.runtime / 60);
  const minutes = props.runtime % 60;

  const styles = {
    backgroundImage: `url(https://image.tmdb.org/t/p/w500/${poster_path})`
  }

  return (
    <div className="result-container d-flex mt-4 mb-5">
      <div className="movie-poster-container" style={styles}>
      </div>
      <div className="movie-info">
        <a href={movie_url} target="_blank" rel="noreferrer noopener">
          <h2>{title.toUpperCase()}</h2>
        </a>
        <p>{year.substr(0,4)} | {rating} | {hours}h {minutes}min</p>
        <div className="d-flex flex-wrap">
          {genres.map((genre) => <p key={genre} className="genre">{genresIds[genre]}</p>)}
        </div>
        
        <p>{description}</p>
        <a href={`https://www.youtube.com/watch?v=${props.trailer}`} target="_blank" rel="noreferrer noopener"><button className="btn btn-primary mt-3 btn-read-more">View trailer</button></a>
      </div>
    </div>
  );
}

export default Result;
