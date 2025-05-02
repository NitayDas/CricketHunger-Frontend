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
import SignIn from './Pages/SignIn/SignIn.jsx';
import SignUp from './Pages/SignUp/SignUp.jsx';
import AuthProvider from './Provider/AuthProvider.jsx';
import Root from './Pages/Root/Root';
import DetailsPage from './Pages/DetailsPage/DetailsPage';
import Matches from './Pages/Matches/Matches.jsx';
// import Signin from './Pages/Authentication/Signin.jsx';
// import Signup from './Pages/Authentication/Signup.jsx'
// import { Authprovider } from './Pages/Authentication/Authprovider.jsx';
import Series from './Pages/Series/Series.jsx';
import SeriesMatches from './Pages/Series/SeriesMatches.jsx';
import NewsDetails from './Components/NewsSection/NewsDetails.jsx';
import Contact from './Pages/Contact/Contact.jsx';
import About from './Pages/About/About.jsx';



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
          path: "series/",
          element:<Series></Series>,
  
        },

        {
          path:"/seriesmatches/:seriesId",
          element:<SeriesMatches></SeriesMatches>,
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

        {
          path: "/news/:id",
          element: <NewsDetails></NewsDetails>,
        },

        
        {
          path: "/contact",
          element: <Contact></Contact>,
        },
      
        {
          path: "/about",
          element: <About></About>,
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
  <AuthProvider>
<QueryClientProvider client={queryClient}>
<RouterProvider router={router} />
</QueryClientProvider>
</AuthProvider>
  </React.StrictMode>,
 
);