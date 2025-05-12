import {createContext, useState} from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({children}) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (artist) => {
    if (!favorites.some((fav) => fav.id === artist.id)) {
      setFavorites((prevFavorites) => [...prevFavorites, artist]);
    }
  };

  return (
    <FavoritesContext.Provider value={{favorites, addFavorite}}>
      {children}
    </FavoritesContext.Provider>
  );
}
