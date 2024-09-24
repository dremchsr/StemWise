import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import usePopularMovies from "../hooks/usePopularMovies";
import useTopRatedMovies from "../hooks/useTopRatedMovies";
import useUpcomingMovies from "../hooks/useUpcomingMovies";
import Header from "./Header";
import MainContainer from "./MainContainer"
import SecondaryContainer from "./SecondaryContainer"
const Browse = () => {
    useNowPlayingMovies();
    usePopularMovies();
    useUpcomingMovies();
    useTopRatedMovies();

    return (
        <div>
            <Header />
            <MainContainer />
            <SecondaryContainer />
            {/*
            
                  main container
                   - videoBackground
                   - videoTitle
                  secondary container
                   - movieList*n
                     - cards*n 
            
            */}
        </div>
    );
};
export default Browse;