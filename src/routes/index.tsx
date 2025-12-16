import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LaunchTokenPage from "../pages/LaunchTokenPage";
import TokenPage from "../pages/TokenPage";
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/launch-token" element={<LaunchTokenPage />} />
        <Route path="/token/:contractAddress" element={<TokenPage />} />
      </Routes>
    </BrowserRouter>
  );
}

