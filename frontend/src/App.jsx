import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import PrivateRoute from './auth/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SplitPage from './pages/SplitPage';

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/split" element={<SplitPage />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
