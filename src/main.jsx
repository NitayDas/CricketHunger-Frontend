import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Pages/Home/Home';
import ErrorPage from './Pages/ErrorPage/ErrorPage';

import Root from './Pages/Root/Root';
import DetailsPage from './Pages/DetailsPage/DetailsPage';
import MatchesContainer from './Components/MatchesContainer/MatchesContainer.jsx';
import Matches from './Pages/Matches/Matches.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [

        {
          path: "/",
          element:<Home></Home>,

        },

        {
          path: "matches/",
          element:<Matches></Matches>,
  
        },

        {
          path: "/details/:match_id",
          element:<DetailsPage></DetailsPage>,
        },
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router} />
     {/* <App /> */}
  </React.StrictMode>,
)
