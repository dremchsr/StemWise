import React, { useRef, useState } from "react";
import lang from "../utilis/languageConstants";
import { useDispatch, useSelector } from "react-redux";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY, API_OPTIONS } from "../utilis/constants";
import { addGptMovieResult } from "../utilis/gptSlice";

const GptSearchBar = () => {
    const dispatch = useDispatch();
    const searchText = useRef(null);
    const [response, setResponse] = useState("");
    const langkey = useSelector((store) => store.config.lang);

    // Safely access searchText.current and its value
    const searchMovieTMDB = async (movie) => {

        const data = await fetch('https://api.themoviedb.org/3/search/movie?query=%20The%' + movie + '&include_adult=false&language=en-US&page=1', API_OPTIONS)
        const json = await data.json();
        console.log(json)
        return json.results;
    }
    const genAI = new GoogleGenerativeAI(API_KEY);

    /*async function aiRun(query) {
        setResponse("");

    };*/
    const handleGptSearchClick = async () => {
        if (!searchText.current.value) {
            console.error("Search input is empty.");
            return;
        }
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const gptQuery =
            "Act as a Movie Recommendation system and suggest some movies for the query : " +
            searchText.current.value +
            ". only give me names of 10 movies, comma seperated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";

        const result = await model.generateContent(gptQuery);
        const text = await result.response.text();
        const gptMovies = text.split(",");
        console.log(gptMovies);
        // setResponse(gptMovies);
        const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));
        const tmdbResult = await Promise.all(promiseArray);
        console.log(tmdbResult);
        if (tmdbResult.length === 0) {
            console.warn("No movie results found.");
        } else {
            dispatch(addGptMovieResult({ movieName: gptMovies, movieResults: tmdbResult }));
        }
    };
    return (
        <div className="pt-[10%] flex justify-center">
            <form
                className="bg-black w-1/2 grid grid-cols-12"
                onSubmit={(e) => e.preventDefault()}
            >
                <input
                    ref={searchText}
                    type="text"
                    className="p-4 m-3 bg-gray-600 rounded-sm col-span-9"
                    placeholder={lang[langkey].gptSearchPlaceholder}
                />
                <button
                    className="py-0 px-4 ml-0 m-3 rounded-sm bg-red-600 text-white col-span-3"
                    onClick={handleGptSearchClick}
                >
                    {lang[langkey].Search}
                </button>
            </form>
        </div>
    );
};

export default GptSearchBar;
