import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import SpotsListPage from "./components/SpotsListPage";
import * as sessionActions from './store/session';
import SpotDetailsPage from "./components/SpotDetailsPage";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotsListPage />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetailsPage />
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
