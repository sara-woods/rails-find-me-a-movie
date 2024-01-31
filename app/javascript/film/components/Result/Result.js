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

  const star = <svg className="star" width = "17" height = "16" viewBox = "0 0 17 16" fill = "none" xmlns = "http://www.w3.org/2000/svg" >
                <path d="M3.81832 16C3.98027 16 4.14223 15.96 4.30418 15.88L8.08985 14.14C8.19782 14.0867 8.33278 14.06 8.49473 14.06C8.67018 14.06 8.81189 14.0867 8.91986 14.14L12.665 15.88C13.1644 16.08 13.5625 16.02 13.8594 15.7C14.0484 15.4867 14.1226 15.2067 14.0821 14.86L13.576 10.78C13.5625 10.66 13.5828 10.5267 13.6368 10.38C13.6907 10.2067 13.7582 10.08 13.8392 10L16.6734 7.02C16.9703 6.68667 17.0648 6.35333 16.9568 6.02C16.8219 5.66 16.5452 5.44667 16.1268 5.38L12.0375 4.6C11.943 4.58667 11.8249 4.53 11.6832 4.43C11.5415 4.33 11.4369 4.23333 11.3694 4.14L9.46645 0.7C9.39897 0.566667 9.3045 0.433333 9.18304 0.3C8.98059 0.0999998 8.75116 0 8.49473 0C8.10334 0 7.79293 0.22 7.5635 0.66L5.59981 4.14C5.55932 4.23333 5.46822 4.33 5.32651 4.43C5.1848 4.53 5.05322 4.58667 4.93175 4.6L0.862665 5.38C0.417292 5.44667 0.147369 5.66 0.0528961 6.02C-0.0685691 6.36667 0.0191559 6.7 0.316071 7.02L3.1705 10C3.23799 10.0933 3.29872 10.22 3.3527 10.38C3.42018 10.54 3.44043 10.6733 3.41344 10.78L2.88709 14.86C2.86009 15.2067 2.94107 15.4867 3.13002 15.7C3.30547 15.9 3.5349 16 3.81832 16Z" fill="#F8C645" />
              </svg>

  const movieLength = <span>
                        {hours !== 0 && `${hours}h`} {minutes !== 0 && `${minutes}min`}
                      </span>

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
        <p id="movie-data">{rating !== 0 && star}{rating !== 0 && ` ${rating} · `}{year && `${year.substr(0, 4)} · `}{!!props.runtime && movieLength}</p>

        {genres && (
          <div className="d-flex flex-wrap genre-group">
            {genres.map((genre) => (
              <p key={genre} className="genre">
                {genresIds[genre]}
              </p>
            ))}
          </div>
        )}

        <p className="flex-grow-1 mb-5 mt-3">{description}</p>

        <div className="movie-info-bottom">
          {props.trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${props.trailer}`}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-secondary btn-trailer"
            > Watch trailer
              <svg className="arrow-right" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g cliPath="url(#clip0_327_180)">
                  <path d="M19 12H5.39904" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.2308 6.5L19 12L13.2308 17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
