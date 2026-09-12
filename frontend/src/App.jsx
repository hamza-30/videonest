import { createBrowserRouter } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Channel from "./pages/Channel";
import PlaylistDetails from "./pages/PlaylistDetails";
import LikedVideos from "./pages/LikedVideos";
import History from "./pages/History";
import MyContent from "./pages/MyContent";
import Collections from "./pages/Collections";
import Subscribers from "./pages/Subscribers";
import EditChannel from "./pages/EditChannel";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import Layout from "./components/Layout";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "watch/:videoId",
            element: <Watch />,
          },
          {
            path: "channel/:username",
            element: <Channel />,
          },
          {
            path: "channel/:playlistId/playlist",
            element: <PlaylistDetails />,
          },
          {
            path: "liked-videos",
            element: <LikedVideos />,
          },
          {
            path: "history",
            element: <History />,
          },
          {
            path: "my-content",
            element: <MyContent />,
          },
          {
            path: "collections",
            element: <Collections />,
          },
          {
            path: "subscribers",
            element: <Subscribers />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "edit-channel",
            element: <EditChannel />,
          },
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
        ],
      },
    ],
  },
]);
