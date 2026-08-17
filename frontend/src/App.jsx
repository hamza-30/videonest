import { createBrowserRouter } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Channel from "./pages/Channel";
import Playlists from "./pages/Playlists";
import PlaylistDetails from "./pages/PlaylistDetails";
import ChannelTweets from "./pages/ChannelTweets";
import Following from "./pages/Following";
import EditProfile from "./pages/EditProfile";
import EditChannel from "./pages/EditChannel";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import Layout from "./components/Layout";

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
            path: "channel/:userId/playlists",
            element: <Playlists />,
          },
          {
            path: "channel/:playlistId/playlist",
            element: <PlaylistDetails />,
          },
          {
            path: "channel/:userId/tweets",
            element: <ChannelTweets />,
          },
          {
            path: "subscriptions/:subscriberId",
            element: <Following />,
          },
          {
            path: "edit-profile",
            element: <EditProfile />,
          },
          {
            path: "edit-channel",
            element: <EditChannel />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
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
