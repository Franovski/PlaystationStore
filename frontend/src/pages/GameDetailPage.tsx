import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from '../layouts/MainLayout';
import { RootState } from '../app/store';
import { gameDetailsApi } from '../api/gameDetailsApi';
import { ordersApi, CreateOrderPayload } from '../api/ordersApi';
import { reviewsApi } from '../api/reviewsApi';
import { wishlistApi } from '../api/wishlistApi';
import { GameDetails, Review } from '../types';

const formatPrice = (value: number | string | undefined | null) => `$${Number(value ?? 0).toFixed(2)}`;
const formatDate = (value: string | undefined | null) => (value ? String(value).slice(0, 10) : 'N/A');
const getErrorMessage = (err: unknown) =>
  err && typeof err === 'object' && 'message' in err ? String((err as { message?: string }).message) : 'Request failed';

const GameDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [details, setDetails] = useState<GameDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<CreateOrderPayload['paymentMethod']>('wallet');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const currentUserReview = useMemo(
    () => details?.reviews.find((review) => review.userId === user?.userId) ?? null,
    [details?.reviews, user?.userId],
  );

  const loadDetails = useCallback(async () => {
    if (!id) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await gameDetailsApi.getDetails(id);
      setDetails(result);
      const ownReview = result.reviews.find((review) => review.userId === user?.userId);
      if (ownReview) {
        setRating(ownReview.rating);
        setComment(ownReview.comment ?? '');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [id, user?.userId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }

    return true;
  };

  const runAction = async (key: string, action: () => Promise<void>) => {
    if (!requireAuth()) {
      return;
    }

    setActionLoading(key);
    setError(null);
    setMessage(null);

    try {
      await action();
      await loadDetails();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handlePurchase = (itemType: 'game' | 'dlc' | 'edition', itemId: number | string) => {
    runAction(`buy-${itemType}-${itemId}`, async () => {
      const order = await ordersApi.create({
        paymentMethod,
        items: [{ itemType, itemId }],
      });
      setMessage(`Order #${order.orderId} completed for ${formatPrice(order.totalPrice)}.`);
    });
  };

  const handleWishlist = () => {
    if (!details) {
      return;
    }

    runAction('wishlist-add', async () => {
      await wishlistApi.add(details.game.gameId);
      setMessage('Game added to wishlist.');
    });
  };

  const handleSaveReview = () => {
    if (!details) {
      return;
    }

    runAction('review-save', async () => {
      if (currentUserReview) {
        await reviewsApi.update(currentUserReview.reviewId, { rating, comment });
        setMessage('Review updated.');
      } else {
        await reviewsApi.create({ gameId: details.game.gameId, rating, comment });
        setMessage('Review created.');
      }
    });
  };

  const handleDeleteReview = (review: Review) => {
    runAction(`review-delete-${review.reviewId}`, async () => {
      await reviewsApi.remove(review.reviewId);
      setMessage('Review deleted.');
      setComment('');
      setRating(5);
    });
  };

  const renderBuyButton = (itemType: 'game' | 'dlc' | 'edition', itemId: number | string) => {
    const key = `buy-${itemType}-${itemId}`;
    return (
      <button
        type="button"
        onClick={() => handlePurchase(itemType, itemId)}
        disabled={actionLoading === key}
        className="bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-gray-200 disabled:opacity-60"
      >
        {actionLoading === key ? 'Buying...' : 'Buy'}
      </button>
    );
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center p-16">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent" />
        </div>
      </MainLayout>
    );
  }

  if (!details) {
    return (
      <MainLayout>
        <div className="p-8">
          <Link to="/" className="text-blue-400 hover:text-blue-300">Back to store</Link>
          <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded mt-5">
            {error || 'Game not found.'}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-8 space-y-8">
        <Link to="/" className="text-blue-400 hover:text-blue-300">Back to store</Link>

        {message && <div className="bg-green-500/10 border border-green-500 text-green-300 p-4 rounded">{message}</div>}
        {error && <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded">{error}</div>}

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div>
            <div className="h-72 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-center px-6 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-white">{details.game.title}</h1>
                <p className="text-gray-400 mt-2">{details.game.developer || 'Unknown Developer'}</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">{details.game.description || 'No description available.'}</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {details.platforms.map((platform) => (
                <span key={platform.platformId} className="bg-gray-800 border border-gray-700 px-3 py-1 rounded text-sm">
                  {platform.platformName.toUpperCase()}
                </span>
              ))}
              {details.categories.map((category) => (
                <span key={category.categoryId} className="bg-gray-800 border border-gray-700 px-3 py-1 rounded text-sm">
                  {category.categoryName}
                </span>
              ))}
            </div>
          </div>

          <aside className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-fit">
            <p className="text-sm text-gray-400">Released {formatDate(details.game.releaseDate)}</p>
            <div className="flex items-center gap-2 mt-4">
              {details.activeDiscountPercentage ? (
                <>
                  <span className="text-gray-500 line-through">{formatPrice(details.game.basePrice)}</span>
                  <span className="text-3xl font-bold text-white">{formatPrice(details.currentPrice)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-white">{formatPrice(details.currentPrice)}</span>
              )}
            </div>
            {details.activeDiscountPercentage && (
              <p className="text-blue-300 text-sm mt-2">
                {Number(details.activeDiscountPercentage).toFixed(0)}% active discount applied
              </p>
            )}
            <select
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value as CreateOrderPayload['paymentMethod'])}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-3 text-white mt-6"
            >
              <option value="wallet">Wallet</option>
              <option value="card">Card</option>
            </select>
            <div className="flex flex-wrap gap-3 mt-4">
              {renderBuyButton('game', details.game.gameId)}
              <button
                type="button"
                onClick={handleWishlist}
                disabled={actionLoading === 'wishlist-add'}
                className="bg-blue-600 px-5 py-2 rounded-full font-bold hover:bg-blue-700 disabled:opacity-60"
              >
                {actionLoading === 'wishlist-add' ? 'Saving...' : 'Wishlist'}
              </button>
            </div>
          </aside>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Editions</h2>
          {details.editions.length === 0 ? (
            <p className="text-gray-400 bg-gray-800 border border-gray-700 rounded-lg p-5">No editions listed.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {details.editions.map((edition) => (
                <div key={edition.editionId} className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white">{edition.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{edition.includes || 'No included content notes.'}</p>
                    </div>
                    <span className="font-bold text-white">{formatPrice(edition.price)}</span>
                  </div>
                  <div className="mt-4">{renderBuyButton('edition', edition.editionId)}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">DLC</h2>
          {details.dlcs.length === 0 ? (
            <p className="text-gray-400 bg-gray-800 border border-gray-700 rounded-lg p-5">No DLC listed.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {details.dlcs.map((dlc) => (
                <div key={dlc.dlcId} className="bg-gray-800 border border-gray-700 rounded-lg p-5">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white">{dlc.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">Release {formatDate(dlc.releaseDate)}</p>
                    </div>
                    <span className="font-bold text-white">{formatPrice(dlc.price)}</span>
                  </div>
                  <div className="mt-4">{renderBuyButton('dlc', dlc.dlcId)}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-fit">
            <h2 className="text-2xl font-bold text-white mb-4">{currentUserReview ? 'Edit Review' : 'Write Review'}</h2>
            <label className="block text-sm text-gray-400 mb-2" htmlFor="rating">Rating</label>
            <select
              id="rating"
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-3 text-white mb-4"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <label className="block text-sm text-gray-400 mb-2" htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="w-full min-h-32 bg-gray-900 border border-gray-700 rounded px-3 py-3 text-white"
              placeholder="Share your thoughts"
            />
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleSaveReview}
                disabled={actionLoading === 'review-save'}
                className="bg-blue-600 px-5 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-60"
              >
                {actionLoading === 'review-save' ? 'Saving...' : 'Save Review'}
              </button>
              {currentUserReview && (
                <button
                  type="button"
                  onClick={() => handleDeleteReview(currentUserReview)}
                  className="bg-red-600 px-5 py-2 rounded font-bold hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Reviews</h2>
            {details.reviews.length === 0 ? (
              <p className="text-gray-400">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {details.reviews.map((review) => (
                  <div key={review.reviewId} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-white">{review.user?.username || 'Player'}</h3>
                        <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                      </div>
                      <span className="font-bold text-blue-300">{review.rating}/5</span>
                    </div>
                    {review.comment && <p className="text-gray-300 mt-3">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default GameDetailPage;
