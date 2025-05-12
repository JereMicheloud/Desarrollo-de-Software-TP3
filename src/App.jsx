import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import ArtistDetail from './pages/ArtistDetail';
import {FavoritesProvider} from './contexts/FavoritesContext';

function App() {
  return (
      <FavoritesProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artist/:id" element={<ArtistDetail />} />
          </Routes>
      </FavoritesProvider>
  );
}

export default App;
