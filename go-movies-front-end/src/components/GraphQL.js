import {useEffect, useState} from "react";
import Input from "./form/input";
import {Link} from "react-router-dom";

const GraphQL = () => {
    // set up stateful values for the component
    const [movies , setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [fullList, setFullList] = useState([]);

    // perform a search
    const performSearch = () => {

            const payload = `
            {
                search(titleContains: "${searchTerm}") {
                    id
                    title
                    release_date
                    mpaa_rating
            }
            }`

            const headers = new Headers();
            headers.append('Content-Type', 'application/graphql');

            const requestOptions = {
                        method: 'POST',
                        headers: headers,
                        body: payload,
            }

            fetch(`/graph`, requestOptions)
                .then((response) => response.json())
                .then(data => {
                    let theList = Object.values(data.data.search);
                    setMovies(theList);

                })
                .catch((error) => {
                    console.log(error);
                })
    };

    const handleChange = (event) => {
        event.preventDefault();

        let value = event.target.value;
        setSearchTerm(value);

        if (value.length > 2) {
            performSearch();

        }   else {
            setMovies(fullList);
        }
    };

    // useEffect to perform the search
    useEffect(() => {
        const payload = `
        {
            list{
                id
                title
                release_date
                mpaa_rating
           }
        }`

        const headers = new Headers();
        headers.append('Content-Type', 'application/graphql');

        const requestOptions = {
                    method: 'POST',
                    headers: headers,
                    body: payload,
        }

        fetch(`/graph`, requestOptions)
            .then((response) => response.json())
            .then(data => {
                let theList = Object.values(data.data.list);
                setMovies(theList);
                setFullList(theList);

            })
            .catch((error) => {
                console.log(error);
            })

    }, []);


    return (
        <>
            <div className="text-center">
                <h2>GraphQL</h2>
                <hr/>

                <form onSubmit={handleChange}>
                    <Input
                        title={"Search"}
                        type={"search"}
                        name={"search"}
                        value={searchTerm}
                        className={"form-control"}
                        onChange={handleChange}
                    />
                </form>

                {movies ? (

                    <table className={"table table-striped table-hover"}>
                        <thead>
                        <tr>
                            <th>Movie</th>
                            <th>Release Date</th>
                            <th>Rating</th>
                        </tr>
                        </thead>
                        <tbody>
                        {movies.map((movie) => (
                            <tr key={movie.id}>
                                <td>
                                    <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
                                </td>
                                <td>{new Date(movie.release_date).toLocaleDateString()}</td>
                                <td>{movie.mpaa_rating}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No movies found so far</p>
                )}
            </div>
        </>
    )
}

export default GraphQL