import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const Movie = () => {
    const [movie, setMovie] = useState({})

    let {id} = useParams();

    useEffect(() => {
        let myMovie = {
            id: 1,
            title: "The Shawshank Redemption",
            release_date: "1994-09-23",
            runtime: 142,
            mpaa_rating: "R",
            description: "Synopsis. In 1947, Andy Dufresne (Tim Robbins), a banker in Maine, is convicted of murdering his wife and her lover, a golf pro. Since the state of Maine has no death penalty, he is given two consecutive life sentences and sent to the notoriously harsh Shawshank Prison.\n",

        };
        setMovie(myMovie);
    }, [id]);

    return (
        <>
            <div className="text-center">
                <h2>Movie: {movie.title}</h2>
                <small><em>Release Date: {movie.release_date}, {movie.runtime} minutes, Rated: {movie.mpaa_rating} </em></small>
                <hr/>
                <p>{movie.description}</p>

            </div>
        </>
    )
}

export default Movie