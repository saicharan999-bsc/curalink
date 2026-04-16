import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import "./styles/global.css";

export default function App() {
  return (
    <div className="shell">
      <div className="shell-bg shell-bg-left" aria-hidden="true" />
      <div className="shell-bg shell-bg-right" aria-hidden="true" />
      <Navbar />
      <Home />
    </div>
  );
}
