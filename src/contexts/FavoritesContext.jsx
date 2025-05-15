import {createContext, useState} from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({children}) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (artist) => {
    if (!favorites.some((fav) => fav.id === artist.id)) {
      setFavorites((prevFavorites) => [...prevFavorites, artist]);
    }
  };

  const removeFavorite = (artistId) => {
    setFavorites((prevFavorites) => prevFavorites.filter(fav => fav.id !== artistId));
  };

  return (
    <FavoritesContext.Provider value={{favorites, addFavorite, removeFavorite}}>
      {children}
    </FavoritesContext.Provider>
  );
}
