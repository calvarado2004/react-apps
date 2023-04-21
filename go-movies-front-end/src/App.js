import Home from './components/home'
import {Link, Outlet, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Alert from "./components/alert";

function App() {

  const [jwtToken, setJwtToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");

  const navigate = useNavigate();

  const logOut = () => {
    setJwtToken("");
    setAlertClassName("alert-success");
    setAlertMessage("You have been logged out.");
    navigate("/login");
  };

  useEffect(() => {
      if (jwtToken !== "") {
          const requestOptions = {
                method: 'GET',
                credentials: 'include',

          };

          fetch('/refresh', requestOptions)
                .then((response) => response.json())
                .then(data => {
                    if (data.access_token) {
                        setJwtToken(data.access_token);
                    }
                })
                .catch((error) => {
                    console.log("user not logged in", error);
                })
      }
  }, [jwtToken]);

  return (
    <div className="container">

        <div className="row">
            <div className="col-12">
                <h1 className="mt-3">Go, watch a movie!</h1>
            </div>
            <div className="col-12 text-end">
                {jwtToken === ""
                    ? <Link to="/login"><span className="badge bg-success">Login</span> </Link>
                    : <Link to="#!" onClick={logOut}><span className="badge bg-danger">Logout</span> </Link>}
            </div>
            <hr className="mb-3"/>
        </div>

        <div className="row">
            <div className="col-md-2">
                <nav>
                    <div className="list-group">
                        <Link to="/" className="list-group-item list-group-item-action">Home</Link>
                        <Link to="/movies" className="list-group-item list-group-item-action">Movies</Link>
                        <Link to="/genres" className="list-group-item list-group-item-action">Genres</Link>
                        {jwtToken !== "" &&
                            <>
                            <Link to="/admin/movie/0" className="list-group-item list-group-item-action">Add Movie</Link>
                            <Link to="/manage-catalog" className="list-group-item list-group-item-action">Manage Catalog</Link>
                            <Link to="/graphql" className="list-group-item list-group-item-action">GraphQL</Link>
                            </>
                        }
                    </div>
                </nav>
            </div>
            <div className="col-md-10">
                <Alert message={alertMessage} className={alertClassName}/>
                <Outlet context={{
                    jwtToken: jwtToken,
                    setJwtToken: setJwtToken,
                    setAlertMessage: setAlertMessage,
                    setAlertClassName: setAlertClassName
                }}/>
            </div>
        </div>

    </div>
  );
}

export default App;
