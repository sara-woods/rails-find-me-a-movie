import React from "react";

const Result = (props) => {
  const { title, year, rating, length, genres, description, movie_url } = props.movie;

  const styles = {
    backgroundImage: `url(${props.src})`
  }

  return (
    <div className="result-container d-flex">
      <div className="movie-poster-container" style={styles}>
      </div>
      <div className="movie-info">
        <a href={movie_url} target="_blank" rel="noreferrer noopener">
          <h2>{title.toUpperCase()}</h2>
        </a>
        <p>{year} | {rating} | {length}</p>
        <div className="d-flex">
          {genres.map((genre) => <p className="genre">{genre}</p>)}
        </div>
        
        <p>{description}</p>
        <a href={movie_url} target="_blank" rel="noreferrer noopener"><button className="btn btn-primary mt-3 btn-read-more">Read more</button></a>
      </div>
    </div>
  );
}

export default Result;
