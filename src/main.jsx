import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './Pages/Home/Home';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import SignUp from './Pages/SignUp/SignUp.jsx';
import Root from './Pages/Root/Root';
import DetailsPage from './Pages/DetailsPage/DetailsPage';
import Matches from './Pages/Matches/Matches.jsx';
import SignIn from './Pages/SignIn/SignIn.jsx';

const queryClient = new QueryClient();

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

        {
          path: "signin/",
          element:<SignIn></SignIn>,
        },

        {
          path: "signup/",
          element:<SignUp></SignUp>,
        },
      
    ],
  },
]);

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//      <RouterProvider router={router} />
//      {/* <App /> */}
//   </React.StrictMode>,
// )

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}> {/* Wrap RouterProvider with QueryClientProvider */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);