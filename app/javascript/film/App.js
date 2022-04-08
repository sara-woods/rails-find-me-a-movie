// import { data } from "jquery";
import React, { useState, useEffect, useReducer } from "react";
import Form from "./components/Form/Form";
import Result from "./components/Result/Result";

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

  const getPopular = async () => {
    setError(null);
    try {
      const response = await fetch("/api/v1/popular");

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movie) => {
        const title = movie.title || movie.original_title || movie.original_name;
        return {
          id: movie.id,
          title: title,
          description: movie.overview,
          rating: movie.vote_average,
          genres: movie.genre_ids,
          length: null,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          year: movie.release_date,
        };
      });

      chooseMovie(transformedMovies);
    } catch (errorThrown) {
      setError(errorThrown.message);
    }
  };

  // When user first lands on page, populate page with a popular movie
  useEffect(() => {
    getPopular();
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
      <h1>WHAT MOVIE?</h1>
      <div className="subheader">
        <p>Don’t know what to watch? Get a movie suggested!</p>
      </div>
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
          className="btn btn-primary mt-5 mb-3"
        >
          Generate
        </button>
        {/* <button
          onClick={showFilterHandler}
          className="btn btn-outline-primary mt-3"
        >
          <span>Filter</span>
        </button> */}
      </div>
      <a onClick={showFilterHandler} className="filter">Filter</a>
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
