import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import Home from "./components/home";
import Movies from "./components/movies";
import Genres from "./components/genres";
import EditMovie from "./components/editMovie";
import ManageCatalog from "./components/ManageCatalog";
import Login from "./components/Login";
import GraphQL from "./components/GraphQL";
import Movie from "./components/movie";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {index: true, element:  <Home/>},
            {path: '/movies', element: <Movies/>},
            {path: '/movies/:id', element: <Movie/>},
            {path: '/genres', element: <Genres/>},
            {path: '/admin/movie/0', element: <EditMovie/>},
            {path: '/manage-catalog', element: <ManageCatalog/>},
            {path: '/graphql', element: <GraphQL/>},
            {path: '/login', element: <Login/>},


        ]
    },

])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

