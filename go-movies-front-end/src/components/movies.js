import react, {useEffect} from "react";
import {Link} from "react-router-dom";

const Movies = () => {
    const [movies, setMovies] = react.useState([])

    useEffect(() => {
        let moviesList = [
            {
                id: 1,
                title: "The Shawshank Redemption",
                release_date: "1994-09-23",
                runtime: 142,
                mpaa_rating: "R",
                description: "Synopsis. In 1947, Andy Dufresne (Tim Robbins), a banker in Maine, is convicted of murdering his wife and her lover, a golf pro. Since the state of Maine has no death penalty, he is given two consecutive life sentences and sent to the notoriously harsh Shawshank Prison.\n",

            },
            {
                id: 1,
                title: "Titanic",
                release_date: "1997-11-18",
                runtime: 194,
                mpaa_rating: "PG-13",
                description: "The movie is about the 1912 sinking of the RMS Titanic. It stars Kate Winslet and Leonardo DiCaprio. The two play characters who are of different social classes. They fall in love after meeting aboard the ship, but it was not good for a rich girl to fall in love with a poor boy in 1912.\n",

            },
        ];
        setMovies(moviesList);

    }, []);


    return (
        <>
            <div className="text-center">
                <h2>Movies</h2>
                <hr/>
                <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Release Date</th>
                        <th>Runtime</th>
                        <th>MPAA Rating</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {movies.map((movie) => (
                        <tr key={movie.id}>
                            <td>
                                <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
                            </td>
                            <td>{movie.release_date}</td>
                            <td>{movie.runtime}</td>
                            <td>{movie.mpaa_rating}</td>
                            <td>{movie.description}</td>
                        </tr>
                    ))}

                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Movies