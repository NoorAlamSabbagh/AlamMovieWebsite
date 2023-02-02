// context API
// useContext hooks

//context(warehouse)
//Provider(delivery boy)
//consumer(useContext())

import React, { useContext, useEffect, useState } from "react";

export const API_URL = `http://www.omdbapi.com/?i=tt3896198&apikey=${process.env.REACT_APP_API_KEY}`;

const AppContext = React.createContext(); //context create kiya

const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [movie, setMovie] = useState([]);
  const [isError, setIsError] = useState({ show: "false", msg: "" });
  const [query, setQuery] = useState("Wanted");

  //fetch kiya api ko ab isko movies.js file me pass karna ha
  const getMovies = async (url) => {
    setIsLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      if (data.Response === "True") {
        setIsLoading(false);
        setIsError({
          show: false,
          msg: "",
        });
        setMovie(data.Search);
      } else {
        setIsError({
          show: true,
          msg: data.Error,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //debounce
  useEffect(() => {
    let timerOut = setTimeout(() => {
      getMovies(`${API_URL}&s=${query}`);
    }, 1000);

    return () => clearTimeout(timerOut);
  }, [query]);

  //WE need to create provider

  return (
    <AppContext.Provider value={{ isLoading, isError, movie, query, setQuery }}>
      {children}
    </AppContext.Provider>
  );
};

//global custom hooks
const useGlobalContext = () => {
  return useContext(AppContext);
};
export { AppContext, AppProvider, useGlobalContext };
