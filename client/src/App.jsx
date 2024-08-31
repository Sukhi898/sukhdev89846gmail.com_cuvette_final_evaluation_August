import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AdminLayout from "./pages/Admin";
import Analytics from "./pages/Admin/Analytics";
import Dashboard from "./pages/Admin/Dashboard";
import Auth from "./pages/Auth";
import UserLayout from "./pages/User";
import Poll from "./pages/User/Poll";
import Quiz from "./pages/User/Quiz";
import QuizResults from "./pages/User/Quiz/QuizResults";
import PollResults from "./pages/User/Poll/PollResults";
import QuizAnalysis from "./pages/Admin/QuizAnalysis";
import PollAnalysis from "./pages/Admin/PollAnalysis";
import AuthProvider from "./store/authContext";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "",

        element: (
          <AuthProvider>
            <AdminLayout />
          </AuthProvider>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: "analytics", element: <Analytics /> },
          { path: "poll/:pollId", element: <PollAnalysis /> },
          { path: "quiz/:quizId", element: <QuizAnalysis /> },
        ],
      },
      {
        path: "https://quizziee-app.netlify.app/auth",
        element: (
          <AuthProvider>
            <Auth />
          </AuthProvider>
        ),
      },
      {
        path: "user",
        element: <UserLayout />,
        children: [
          {
            path: "quiz",
            children: [
              { path: ":quizId", element: <Quiz /> },
              { path: "results", element: <QuizResults /> },
            ],
          },
          {
            path: "poll",
            children: [
              { path: ":pollId", element: <Poll /> },
              { path: "results", element: <PollResults /> },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <p>Route not found</p>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
