import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {FavoritesProvider} from './contexts/FavoritesContext';
import Login from './pages/Login';
import Home from './pages/Home';
import ArtistDetail from './pages/ArtistDetail';
import AlbumDetail from "./pages/AlbumDetail";
import FavoriteSongs from './pages/FavoriteSongs';

function App() {
  return (
      <FavoritesProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/artist/:artistid" element={<ArtistDetail />} />
            <Route path="/artist/album/:albumId" element={<AlbumDetail />} />
            <Route path="/artist/album/favoritos" element={<FavoriteSongs />} />
          </Routes>
      </FavoritesProvider>
  );
}

export default App;
