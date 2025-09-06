import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import BasicQuery from "./pages/BasicQuery";
// import Mutations from "./pages/Mutations";
// import Pagination from "./pages/Pagination";
import "./App.css";

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
              <Link to="/pagination">Pagination</Link>
            </li>
          </ul>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/basic-query" element={<BasicQuery />} />
            {/* <Route path="/mutations" element={<Mutations />} />
            <Route path="/pagination" element={<Pagination />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
