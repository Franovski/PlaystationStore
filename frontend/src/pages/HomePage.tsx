import React, { useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { fetchGames } from '../features/games/gamesSlice';
import { Game } from '../types';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading, error } = useSelector((state: RootState) => state.games);

  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="p-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-shadow-sm mb-4">The World of PlayStation</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Discover the latest games, browse collections, and get incredible deals directly from the PlayStation Store.</p>
        </div>
        
        <h2 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-3 mb-6">Trending Games</h2>
        
        {isLoading && (
          <div className="flex justify-center p-12">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 bg-red-100 bg-opacity-10 p-4 rounded border border-red-500">
            {error}
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="text-gray-400 bg-gray-800 p-8 text-center rounded border border-gray-700">
            No games currently found in the database. Add some via the Admin Dashboard.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((game: Game) => (
            <div key={game.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2 hover:shadow-blue-500/10 cursor-pointer border border-gray-700 flex flex-col">
              <div className="h-64 bg-gray-700 relative overflow-hidden group">
                {game.coverImage ? (
                  <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                )}
                {game.discountPrice && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-black px-2 py-1 rounded shadow-md">
                     SALE
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded border border-gray-600">PS5</div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-100 line-clamp-1" title={game.title}>{game.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{game.developer || 'Unknown Developer'}</p>
                <div className="mt-4 flex justify-between items-center mt-auto pt-4">
                  <div className="flex flex-col">
                    {game.discountPrice ? (
                      <>
                        <span className="text-sm font-medium text-gray-400 line-through">${game.price}</span>
                        <span className="text-xl font-bold text-yellow-500">${game.discountPrice}</span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-white">${game.price || 'Free'}</span>
                    )}
                  </div>
                  <button className="bg-white text-black px-4 py-2 font-bold rounded-full hover:bg-gray-200 transition-colors shadow-md">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;