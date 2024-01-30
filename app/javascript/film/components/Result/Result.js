import React from "react";
import { genresIds } from "../../Genres";

const Result = (props) => {
  const {
    title,
    year,
    rating,
    genres,
    description,
    movie_url,
    id,
    poster_path,
    backdrop_path,
  } = props.movie;

  const hours = Math.floor(props.runtime / 60);
  const minutes = props.runtime % 60;

  let posterStyle = {
    backgroundImage: `url(https://image.tmdb.org/t/p/w500/${poster_path})`,
  };

  let noPosterStyle = {
    backgroundColor: "#2F2F3B",
  };

  return (
    <div className="result-container mt-5 mb-5">

      <div
        className="movie-poster-container"
        style={poster_path ? posterStyle : noPosterStyle}
      ></div>
      <div className="movie-info d-flex flex-column">
        <a href={movie_url} target="_blank" rel="noreferrer noopener">
          {title && <h2>{title.toUpperCase()}</h2>}
        </a>
        <div className="d-flex">
          <p className="mr-2">{year && `(${year.substr(0, 4)})`}</p>
          {!!props.runtime && (
            <p>
              {hours !== 0 && `${hours}h`} {minutes !== 0 && `${minutes}min`}
            </p>
          )}
        </div>

        {genres && (
          <div className="d-flex flex-wrap">
            {genres.map((genre) => (
              <p key={genre} className="genre">
                {genresIds[genre].toUpperCase()}
              </p>
            ))}
          </div>
        )}

        <p className="flex-grow-1 mb-5 mt-3">{description}</p>
        <div className="movie-info-bottom">
          {rating !== 0 && (
            <p className="rating">
              <span className="rating-bold">{rating}</span>/10
            </p>
          )}
          {props.trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${props.trailer}`}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-secondary btn-trailer"
            > Watch trailer
              <svg className="arrow-right" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_327_180)">
                  <path d="M19 12H5.39904" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M13.2308 6.5L19 12L13.2308 17.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_327_180">
                    <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
                  </clipPath>
                </defs>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
