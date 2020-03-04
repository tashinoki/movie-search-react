import React, { useState, useReducer, useEffect } from 'react';

import Header from "./Header";
import Search from "./Search";
import Movie from "./Movie";

import '../App.css';

const MOVIE_API_URL = "http://www.omdbapi.com/?s=man&apikey=cf1ba400";

const initialState = {
  laoding: true,
  movies: [],
  errorMessage: null
}

const reducer = (state, action) => {
  switch(action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        laoding: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIE_FAILURE":
      return {
        ...state,
        laoding: false,
        errorMessage: action.error
      };
      default:
        return state;
  }
}
function App() {

  const [state, dispatch] = useReducer(reducer, initialState);
  // const [loading, setLoading] = useState(true);
  // const [movies, setMovies] = useState([]);
  // const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetch(MOVIE_API_URL)
      .then(response => response.json())
      .then(jsonResponse => {
        // setMovies(jsonResponse.Search);
        // setLoading(false)

        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: jsonResponse.Search,
        })
      })
  }, []);

  const search = searchValue => {

    // setLoading(true);
    // setErrorMessage(null);

    dispatch({
      type: "SEARCH_MOVIES_REQUEST",
    })

    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=cf1ba400`)
      .then(response => response.json())
      .then(jsonResponse => {

        if (jsonResponse.Response === "True") {
          // setMovies(jsonResponse.Search);
          // setLoading(false);

          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search
          })
        } else {
          // setErrorMessage(jsonResponse.Error);
          // setLoading(false);
          dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            errorMessage: jsonResponse.Error
          })
        }
      })
  }

  const { movies, errorMessage, loading } = state;

  return (
    <div className="App">
      <Header text="HOOKED" />
      <Search search={search} />
      <p className="movies">Sharing a few of our favourite movies</p>
      <div className="movies">
        {loading && !errorMessage ? (
          <span>loading...</span>
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
