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
          <h1 className="text-4xl md:text-5xl font-bold text-white text-shadow-sm mb-4">
            The World of PlayStation
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the latest games, browse collections, and get incredible deals directly from the PlayStation Store.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-3 mb-6">
          Trending Games
        </h2>

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
            <div
              key={game.gameId}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2 hover:shadow-blue-500/10 border border-gray-700 flex flex-col"
            >
              <div className="h-64 bg-gray-700 flex items-center justify-center px-4 text-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">{game.title}</h3>
                  {game.ageRating && (
                    <p className="text-sm text-gray-300 mt-2">Age Rating: {game.ageRating}</p>
                  )}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3
                  className="text-lg font-bold text-gray-100 line-clamp-1"
                  title={game.title}
                >
                  {game.title}
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  {game.developer || 'Unknown Developer'}
                </p>

                {game.publisher && (
                  <p className="text-gray-500 text-sm mt-1">
                    Publisher: {game.publisher}
                  </p>
                )}

                {game.releaseDate && (
                  <p className="text-gray-500 text-sm mt-1">
                    Release Date: {new Date(game.releaseDate).toLocaleDateString()}
                  </p>
                )}

                {game.description && (
                  <p className="text-gray-400 text-sm mt-3 line-clamp-3">
                    {game.description}
                  </p>
                )}

                <div className="mt-4 flex justify-between items-center mt-auto pt-4">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-white">
                      ${Number(game.basePrice).toFixed(2)}
                    </span>
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