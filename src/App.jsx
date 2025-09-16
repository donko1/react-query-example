import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import BasicQuery from "./pages/BasicQuery";
import UseQueryForDiffKeys from "./pages/useQueryForDiffKeys";
import MutationExample from "./pages/Mutations";
import "./App.css";
import NetworkMode from "./pages/NetworkMode";
import DogBreeds from "./pages/IsFetchingOrIsLoading";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <h2>React Query Examples</h2>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/basic-query">Basic Query</Link>
            </li>
            <li>
              <Link to="/mutations">Mutations</Link>
            </li>
            <li>
              <Link to="/useQueryForDiffKeys">useQuery for different keys</Link>
            </li>
            <li>
              <Link to="/NetworkMode">NetworkMode</Link>
            </li>
            <li>
              <Link to="/IsFetchingOrIsLoading">Is fetching or is loading</Link>
            </li>
          </ul>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/basic-query" element={<BasicQuery />} />
            <Route path="/Mutations" element={<MutationExample />} />
            <Route
              path="/useQueryForDiffKeys"
              element={<UseQueryForDiffKeys />}
            />
            <Route path="/NetworkMode" element={<NetworkMode />} />
            <Route path="/IsFetchingOrIsLoading" element={<DogBreeds />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
