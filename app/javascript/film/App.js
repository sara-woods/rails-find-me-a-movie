// import { data } from "jquery";
import React, { useState, useEffect, useReducer } from "react";
import Form from "./components/Form/Form";
import Result from "./components/Result/Result";
import popcorn from "../../assets/images/popcorn.png";

const selectedMovieReducer = (state, action) => {
  switch (action.type) {
    case "NEW_MOVIE":
      return {
        movie: action.val,
        runtime: state.runtime,
        trailer: state.trailer,
      };
    case "NEW_RUNTIME":
      return {
        movie: state.movie,
        runtime: action.val,
        trailer: state.trailer,
      };
    case "NEW_TRAILER":
      return {
        movie: state.movie,
        runtime: state.runtime,
        trailer: action.val,
      };
    default:
      return { movie: null, runtime: null, trailer: null };
  }
};

const App = () => {
  const [movies, setMovies] = useState();

  const [selectedMovieState, dispatchSelectedMovie] = useReducer(
    selectedMovieReducer,
    { movie: null, runtime: null, trailer: null }
  );

  const [movieIndex, setMovieIndex] = useState(0);
  const [moviePageIndex, setMoviePageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState();

  const [error, setError] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [filterData, setFilterData] = useState({});

  // When user first lands on page, populate page with a movie
  useEffect(() => {
    getMoviesRails(filterData);
  }, []);

  useEffect(() => {
    if (!movies) {
      return;
    }

    if (movieIndex < movies.length - 1) {
      setMovieIndex((prevState) => (prevState += 1));
    } else {
      setMovieIndex(0);
      setMovies(null);
      if (moviePageIndex < totalPages) {
        setMoviePageIndex((prevState) => (prevState += 1));
      } else {
        setMoviePageIndex(1);
      }
    }
  }, [selectedMovieState.movie]);

  const getQueryString = (filterHash) => {
    let url = "";

    if (filterHash.yearFrom !== undefined || filterHash.yearTo !== undefined) {
      url += `&primary_release_date.gte=`;

      if (filterHash.yearFrom !== undefined) {
        url += `${filterHash.yearFrom}-01-01`;
      }

      url += "&primary_release_date.lte=";

      if (filterHash.yearTo !== undefined) {
        url += `${filterHash.yearTo}-01-01`;
      }
    }

    if (filterHash.rating !== undefined) {
      url += `&vote_average.gte=${(+filterHash.rating).toFixed(1)}`;
    }

    if (filterHash.genres && filterHash.genres.length !== 0) {
      url += `&with_genres=${filterHash.genres.join(",")}`;
    }

    return url;
  };

  const newFilterDataHandler = (yearFrom, yearTo, genres, rating) => {
    const newFilterInput = { yearFrom, yearTo, genres, rating };

    setShowFilter(false);

    for (const [key, value] of Object.entries(newFilterInput)) {
      if (filterData[key] !== value) {
        setMovieIndex(0);
        setMoviePageIndex(1);
        setFilterData(newFilterInput);
        getMoviesRails(newFilterInput, 1);
        return;
      }
    }
    generateButtonHandler();
  };

  const generateButtonHandler = () => {
    if (!movies) {
      getMoviesRails(filterData);
    } else {
      chooseMovie(movies);
    }
  };

  const getMoviesRails = async (filterInput, pageIndex = moviePageIndex) => {
    const urlAddon = getQueryString(filterInput);

    setError(null);
    try {
      const response = await fetch("/api/v1/search", {
        method: "POST",
        body: JSON.stringify({ urlAddon: urlAddon, moviePageIndex: pageIndex }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      if (data.results.length === 0) {
        throw new Error("Sorry, no movies were found.");
      }

      const transformedMovies = data.results.map((movie) => {
        return {
          id: movie.id,
          title: movie.title,
          description: movie.overview,
          rating: movie.vote_average,
          genres: movie.genre_ids,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          year: movie.release_date,
        };
      });

      setTotalPages(data.total_pages);
      setMovies(transformedMovies);
      chooseMovie(transformedMovies, 0);
    } catch (errorThrown) {
      setMovies(null);
      dispatchSelectedMovie({ type: "NEW_MOVIE", val: null });
      dispatchSelectedMovie({ type: "NEW_RUNTIME", val: null });
      dispatchSelectedMovie({ type: "NEW_TRAILER", val: null });
      setError(errorThrown.message);
    }
  };

  const getRunTimeRails = async (movieId) => {
    setError(null);
    try {
      const response = await fetch("/api/v1/runtime", {
        method: "POST",
        body: JSON.stringify({ movieId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      dispatchSelectedMovie({ type: "NEW_RUNTIME", val: data.runtime });
    } catch {
      dispatchSelectedMovie({ type: "NEW_RUNTIME", val: null });
    }
  };

  const getTrailerRails = async (movieId) => {
    setError(null);
    try {
      const response = await fetch("/api/v1/trailer", {
        method: "POST",
        body: JSON.stringify({ movieId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      dispatchSelectedMovie({ type: "NEW_TRAILER", val: data.results[0].key });
    } catch {
      dispatchSelectedMovie({ type: "NEW_TRAILER", val: null });
    }
  };

  const chooseMovie = (moviesData, index = movieIndex) => {
    getRunTimeRails(moviesData[index].id);
    getTrailerRails(moviesData[index].id);
    dispatchSelectedMovie({ type: "NEW_MOVIE", val: moviesData[index] });
  };

  const showFilterHandler = () => {
    setShowFilter(true);
  };

  const onCloseHandler = () => {
    setShowFilter(false);
  };

  let bgStyle = {
    backgroundImage: `url(https://image.tmdb.org/t/p/w500/${selectedMovieState?.movie?.poster_path})`,
  };

  return (
    <div className="app" >
      <div className="subheader">
        <p>Don’t know what to watch?</p>
      </div>
      <h1>GENERATE A MOVIE<span><img src={popcorn}/></span></h1>
      {showFilter && (
        <Form
          onSubmit={newFilterDataHandler}
          filterData={filterData}
          onClose={onCloseHandler}
        />
      )}
      <div className="movie-controls">
        <button
          onClick={generateButtonHandler}
          className="btn generate-btn btn-primary mt-5 mb-3"
        >
          Generate movie
        </button>
        <button
          onClick={showFilterHandler}
          className="btn btn-outline-primary mt-5 mb-3"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_327_152)">
              <g clip-path="url(#clip1_327_152)">
                <path d="M12.5 18.5417H20.9583M5.25 18.5417H7.65466H5.25Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.5652 12.5H20.9583M5.25 12.5H13.5154H5.25Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12.4953 6.4585H20.9583M5.25 6.4585H7.6543H5.25Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.0827 8.87508C11.4174 8.87508 12.4993 7.7931 12.4993 6.45841C12.4993 5.12373 11.4174 4.04175 10.0827 4.04175C8.74799 4.04175 7.66602 5.12373 7.66602 6.45841C7.66602 7.7931 8.74799 8.87508 10.0827 8.87508Z" stroke="white" stroke-width="1.5" />
                <path d="M16.1257 14.9168C17.4603 14.9168 18.5423 13.8349 18.5423 12.5002C18.5423 11.1655 17.4603 10.0835 16.1257 10.0835C14.791 10.0835 13.709 11.1655 13.709 12.5002C13.709 13.8349 14.791 14.9168 16.1257 14.9168Z" stroke="white" stroke-width="1.5" />
                <path d="M10.0827 20.9583C11.4174 20.9583 12.4993 19.8764 12.4993 18.5417C12.4993 17.207 11.4174 16.125 10.0827 16.125C8.74799 16.125 7.66602 17.207 7.66602 18.5417C7.66602 19.8764 8.74799 20.9583 10.0827 20.9583Z" stroke="white" stroke-width="1.5" />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_327_152">
                <rect width="24" height="24" fill="white" />
              </clipPath>
              <clipPath id="clip1_327_152">
                <rect width="29" height="29" fill="white" transform="translate(-2 -2)" />
              </clipPath>
            </defs>
          </svg>

        </button>
      </div>
      {/* <a onClick={showFilterHandler} className="filter">Filter</a> */}
      {selectedMovieState.movie && !error && (
        <Result
          movie={selectedMovieState.movie}
          runtime={selectedMovieState.runtime}
          trailer={selectedMovieState.trailer}
        />
      )}
      {error && <p className="mt-5">{error}</p>}
    </div>
  );
};

export default App;
