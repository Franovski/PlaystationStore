import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { CreateOrderPayload } from '../../orders/services/ordersApi';
import { GameDetails, Order, Review, UserLibrary, Wishlist } from '../../../types';
import {
  addDashboardWalletFunds,
  addDashboardWishlistItem,
  deleteDashboardReview,
  fetchDashboardData,
  purchaseDashboardItem,
  removeDashboardWishlistItem,
  saveDashboardReview,
  setDashboardError,
} from '../../../store/slices/dashboardSlice';

type StoreTab = 'overview' | 'browse' | 'wishlist' | 'library' | 'orders' | 'wallet' | 'reviews';

const storeTabs: Array<{ id: StoreTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'browse', label: 'Browse' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'library', label: 'Library' },
  { id: 'orders', label: 'Orders' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'reviews', label: 'Reviews' },
];

const formatPrice = (value: number | string | undefined | null) => `$${Number(value ?? 0).toFixed(2)}`;
const formatDate = (value: string | undefined | null) => (value ? String(value).slice(0, 10) : 'N/A');

type AdminStoreModePanelProps = {
  onBackToAdmin: () => void;
};

const AdminStoreModePanel: React.FC<AdminStoreModePanelProps> = ({ onBackToAdmin }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { dashboard, catalog, isLoading, actionLoading, error, message } = useAppSelector((state) => state.dashboard);
  const [activeTab, setActiveTab] = useState<StoreTab>('overview');
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [walletAmount, setWalletAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<CreateOrderPayload['paymentMethod']>('wallet');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedGame) {
      return;
    }

    const updatedSelection = catalog.find(
      (entry) => Number(entry.game.gameId) === Number(selectedGame.game.gameId),
    );

    if (updatedSelection) {
      setSelectedGame(updatedSelection);
    }
  }, [catalog, selectedGame?.game.gameId]);

  const wishlistGameIds = useMemo(
    () => new Set((dashboard?.wishlist ?? []).map((item) => Number(item.gameId))),
    [dashboard?.wishlist],
  );

  const filteredCatalog = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return catalog.filter((entry) => {
      const title = entry.game?.title?.toLowerCase() || '';
      const developer = entry.game?.developer?.toLowerCase() || '';
      return title.includes(normalized) || developer.includes(normalized);
    });
  }, [catalog, searchTerm]);

  const currentUserReview = useMemo(
    () => selectedGame?.reviews.find((review) => review.userId === user?.userId) ?? null,
    [selectedGame?.reviews, user?.userId],
  );

  const myReviews = useMemo(
    () =>
      catalog.flatMap((entry) =>
        (entry.reviews ?? [])
          .filter((review) => review.userId === user?.userId)
          .map((review) => ({ review, game: entry.game })),
      ),
    [catalog, user?.userId],
  );

  const itemName = (itemType: string, itemId: number | string) => {
    const numericId = Number(itemId);

    if (itemType === 'game') {
      return catalog.find((entry) => Number(entry.game?.gameId) === numericId)?.game?.title ?? `Game #${itemId}`;
    }

    if (itemType === 'dlc') {
      return catalog.flatMap((entry) => entry.dlcs ?? []).find((dlc) => Number(dlc.dlcId) === numericId)?.name ?? `DLC #${itemId}`;
    }

    if (itemType === 'edition') {
      return catalog.flatMap((entry) => entry.editions ?? []).find((edition) => Number(edition.editionId) === numericId)?.name ?? `Edition #${itemId}`;
    }

    return `${itemType} #${itemId}`;
  };

  const isOwned = (itemType: string, itemId: number | string) =>
    Boolean(
      (dashboard?.library ?? []).some(
        (item) => item.itemType === itemType && Number(item.itemId) === Number(itemId),
      ),
    );

  const openDetails = (details: GameDetails) => {
    const ownReview = details.reviews.find((review) => review.userId === user?.userId);
    setSelectedGame(details);
    setRating(ownReview?.rating ?? 5);
    setComment(ownReview?.comment ?? '');
  };

  const handlePurchase = (itemType: 'game' | 'dlc' | 'edition', itemId: number | string) => {
    if (isOwned(itemType, itemId)) {
      dispatch(setDashboardError(`You already own this ${itemType}.`));
      return;
    }

    dispatch(
      purchaseDashboardItem({
        actionKey: `buy-${itemType}-${itemId}`,
        paymentMethod,
        itemType,
        itemId,
      }),
    );
  };

  const handleAddWishlist = (gameId: number | string) => {
    dispatch(addDashboardWishlistItem({ actionKey: `wishlist-add-${gameId}`, gameId }));
  };

  const handleRemoveWishlist = (gameId: number | string) => {
    dispatch(removeDashboardWishlistItem({ actionKey: `wishlist-remove-${gameId}`, gameId }));
  };

  const handleAddFunds = async () => {
    const amount = Number(walletAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      dispatch(setDashboardError('Enter a wallet amount greater than zero.'));
      return;
    }

    const result = await dispatch(addDashboardWalletFunds({ actionKey: 'wallet-add-funds', amount }));

    if (addDashboardWalletFunds.fulfilled.match(result)) {
      setWalletAmount('');
    }
  };

  const handleSaveReview = () => {
    if (!selectedGame) return;

    dispatch(
      saveDashboardReview({
        actionKey: `review-save-${selectedGame.game.gameId}`,
        gameId: selectedGame.game.gameId,
        rating,
        comment,
        currentReviewId: currentUserReview?.reviewId ?? null,
      }),
    );
  };

  const handleDeleteReview = async (review: Review) => {
    const result = await dispatch(
      deleteDashboardReview({
        actionKey: `review-delete-${review.reviewId}`,
        reviewId: review.reviewId,
      }),
    );

    if (deleteDashboardReview.fulfilled.match(result)) {
      setComment('');
      setRating(5);
      setSelectedGame(null);
    }
  };

  const renderSummaryCard = (label: string, value: string | number, tab: StoreTab) => (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-left hover:border-blue-500 hover:bg-gray-750 transition-colors"
    >
      <span className="block text-sm text-gray-400 uppercase font-bold tracking-wider">{label}</span>
      <span className="block text-3xl font-black text-white mt-2">{value}</span>
    </button>
  );

  const renderPurchaseButton = (itemType: 'game' | 'dlc' | 'edition', itemId: number | string) => {
    const key = `buy-${itemType}-${itemId}`;

    if (isOwned(itemType, itemId)) {
      return <span className="text-sm font-bold text-green-400">Owned</span>;
    }

    return (
      <button
        type="button"
        onClick={() => handlePurchase(itemType, itemId)}
        disabled={actionLoading === key}
        className="bg-white text-black px-4 py-2 rounded-lg text-sm font-black hover:bg-gray-200 disabled:opacity-60"
      >
        {actionLoading === key ? 'Buying...' : 'Buy'}
      </button>
    );
  };

  const renderGameCard = (detail: GameDetails) => {
    const game = detail.game;
    const inWishlist = wishlistGameIds.has(Number(game.gameId));

    return (
      <div key={game.gameId} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden flex flex-col">
        <div className="h-44 bg-gray-700 flex items-center justify-center px-4 text-center">
          <div>
            <h3 className="text-2xl font-black text-white">{game.title}</h3>
            <p className="text-sm text-gray-300 mt-2">{game.ageRating || 'Rating pending'}</p>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <p className="text-sm text-gray-400">{game.developer || 'Unknown Developer'}</p>
          <p className="text-sm text-gray-500 mt-1">{formatDate(game.releaseDate)}</p>
          {game.description && <p className="text-sm text-gray-400 mt-3 line-clamp-3">{game.description}</p>}
          <div className="flex items-center gap-2 mt-4">
            {detail.activeDiscountPercentage ? (
              <>
                <span className="text-gray-500 line-through">{formatPrice(game.basePrice)}</span>
                <span className="text-xl font-black text-white">{formatPrice(detail.currentPrice)}</span>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                  -{Number(detail.activeDiscountPercentage).toFixed(0)}%
                </span>
              </>
            ) : (
              <span className="text-xl font-black text-white">{formatPrice(detail.currentPrice)}</span>
            )}
          </div>
          <div className="mt-auto pt-5 flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => openDetails(detail)}
              className="bg-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-600"
            >
              Details
            </button>
            {inWishlist ? (
              <button
                type="button"
                onClick={() => handleRemoveWishlist(game.gameId)}
                className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700"
              >
                Saved
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleAddWishlist(game.gameId)}
                className="bg-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-600"
              >
                Wishlist
              </button>
            )}
            {renderPurchaseButton('game', game.gameId)}
          </div>
        </div>
      </div>
    );
  };

  const renderWishlistRow = (item: Wishlist) => (
    <div key={item.wishlistId} className="flex items-center justify-between gap-4 border-b border-gray-700 py-4 last:border-b-0">
      <div>
        <h3 className="font-bold text-white">{item.game?.title ?? `Game #${item.gameId}`}</h3>
        <p className="text-sm text-gray-400">Added {formatDate(item.addedAt)}</p>
      </div>
      <button
        type="button"
        onClick={() => handleRemoveWishlist(item.gameId)}
        className="bg-red-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-700"
      >
        Remove
      </button>
    </div>
  );

  const renderLibraryRow = (item: UserLibrary) => (
    <div key={item.libraryId} className="flex items-center justify-between gap-4 border-b border-gray-700 py-4 last:border-b-0">
      <div>
        <h3 className="font-bold text-white">{itemName(item.itemType, item.itemId)}</h3>
        <p className="text-sm text-gray-400">
          {item.itemType.toUpperCase()} purchased {formatDate(item.purchaseDate)}
        </p>
      </div>
      <span className="text-sm font-bold text-green-400">Owned</span>
    </div>
  );

  const renderOrderRow = (order: Order) => (
    <div key={order.orderId} className="border-b border-gray-700 py-4 last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white">Order #{order.orderId}</h3>
          <p className="text-sm text-gray-400">
            {formatDate(order.orderDate)} / {order.paymentMethod} / {order.status}
          </p>
        </div>
        <span className="text-lg font-black text-white">{formatPrice(order.totalPrice)}</span>
      </div>
      <div className="mt-3 space-y-2">
        {(order.items ?? []).map((item) => (
          <div key={item.orderItemId} className="flex justify-between text-sm text-gray-300">
            <span>{itemName(item.itemType, item.itemId)}</span>
            <span>{formatPrice(item.price)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {renderSummaryCard('Wallet', formatPrice(dashboard?.walletBalance), 'wallet')}
        {renderSummaryCard('Wishlist', dashboard?.wishlistCount ?? 0, 'wishlist')}
        {renderSummaryCard('Library', dashboard?.libraryCount ?? 0, 'library')}
        {renderSummaryCard('Orders', dashboard?.orderCount ?? 0, 'orders')}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-black text-white mb-4">Recent Orders</h2>
          {(dashboard?.orders ?? []).slice(0, 3).map(renderOrderRow)}
          {(dashboard?.orders ?? []).length === 0 && <p className="text-gray-400">No orders yet.</p>}
        </section>
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-black text-white mb-4">Wishlist</h2>
          {(dashboard?.wishlist ?? []).slice(0, 3).map(renderWishlistRow)}
          {(dashboard?.wishlist ?? []).length === 0 && <p className="text-gray-400">No wishlist items yet.</p>}
        </section>
      </div>
    </div>
  );

  const renderBrowse = () => (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-800 p-4 rounded-xl border border-gray-700">
        <div className="relative w-full sm:w-96">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search games..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={paymentMethod}
          onChange={(event) => setPaymentMethod(event.target.value as CreateOrderPayload['paymentMethod'])}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-3 text-white"
        >
          <option value="wallet">Wallet</option>
          <option value="card">Card</option>
        </select>
      </div>
      {filteredCatalog.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center text-gray-400">
          No games match this search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCatalog.map(renderGameCard)}
        </div>
      )}
    </div>
  );

  const renderWallet = () => (
    <section className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-2xl">
      <h2 className="text-2xl font-black text-white mb-2">Wallet</h2>
      <p className="text-4xl font-black text-white mb-6">{formatPrice(dashboard?.walletBalance)}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={walletAmount}
          onChange={(event) => setWalletAmount(event.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white flex-1"
          placeholder="Amount"
        />
        <button
          type="button"
          onClick={handleAddFunds}
          disabled={actionLoading === 'wallet-add-funds'}
          className="bg-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-60"
        >
          {actionLoading === 'wallet-add-funds' ? 'Adding...' : 'Add Funds'}
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-4">Updated {formatDate(dashboard?.wallet?.updatedAt)}</p>
    </section>
  );

  const renderReviews = () => (
    <section className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-black text-white mb-4">My Reviews</h2>
      {myReviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {myReviews.map(({ review, game }) => (
            <div key={review.reviewId} className="border-b border-gray-700 pb-4 last:border-b-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white">{game?.title ?? `Game #${review.gameId}`}</h3>
                  <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                </div>
                <span className="font-black text-blue-300">{review.rating}/5</span>
              </div>
              {review.comment && <p className="text-gray-300 mt-3">{review.comment}</p>}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const details = catalog.find((entry) => Number(entry.game.gameId) === Number(review.gameId));
                    if (details) openDetails(details);
                  }}
                  className="bg-gray-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-600"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteReview(review)}
                  className="bg-red-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  const renderActiveTab = () => {
    if (activeTab === 'overview') return renderOverview();
    if (activeTab === 'browse') return renderBrowse();
    if (activeTab === 'wishlist') {
      return (
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-2xl font-black text-white mb-4">Wishlist</h2>
          {(dashboard?.wishlist ?? []).length === 0 ? <p className="text-gray-400">No wishlist items yet.</p> : dashboard?.wishlist.map(renderWishlistRow)}
        </section>
      );
    }
    if (activeTab === 'library') {
      return (
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-2xl font-black text-white mb-4">Library</h2>
          {(dashboard?.library ?? []).length === 0 ? <p className="text-gray-400">No owned items yet.</p> : dashboard?.library.map(renderLibraryRow)}
        </section>
      );
    }
    if (activeTab === 'orders') {
      return (
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-2xl font-black text-white mb-4">Orders</h2>
          {(dashboard?.orders ?? []).length === 0 ? <p className="text-gray-400">No orders yet.</p> : dashboard?.orders.map(renderOrderRow)}
        </section>
      );
    }
    if (activeTab === 'wallet') return renderWallet();
    return renderReviews();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Store Mode</h2>
          <p className="text-gray-400 mt-1">Browsing and purchases run as {user?.username || 'the signed-in admin'}.</p>
        </div>
        <button
          type="button"
          onClick={onBackToAdmin}
          className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-lg font-black text-white"
        >
          Admin Mode
        </button>
      </div>

      <div className="flex flex-wrap gap-2 bg-gray-800 border border-gray-700 rounded-xl p-2">
        {storeTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-black transition-colors ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message && <div className="bg-green-500/10 border border-green-500 text-green-300 p-4 rounded-lg">{message}</div>}
      {error && <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded-lg">{error}</div>}

      {isLoading ? (
        <div className="flex justify-center p-16">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent" />
        </div>
      ) : (
        renderActiveTab()
      )}

      {selectedGame && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-5 flex justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-white">{selectedGame.game.title}</h2>
                <p className="text-gray-400">{selectedGame.game.developer || 'Unknown Developer'} / {formatDate(selectedGame.game.releaseDate)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGame(null)}
                className="text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-700 p-2 rounded-lg h-fit"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                <div>
                  <p className="text-gray-300 leading-relaxed">{selectedGame.game.description || 'No description available.'}</p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {(selectedGame.platforms ?? []).map((platform) => (
                      <span key={platform.platformId} className="bg-gray-900 border border-gray-700 px-3 py-1 rounded-lg text-sm">
                        {platform.platformName.toUpperCase()}
                      </span>
                    ))}
                    {(selectedGame.categories ?? []).map((category) => (
                      <span key={category.categoryId} className="bg-gray-900 border border-gray-700 px-3 py-1 rounded-lg text-sm">
                        {category.categoryName}
                      </span>
                    ))}
                  </div>
                </div>
                <aside className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                  <p className="text-sm text-gray-400">Current Price</p>
                  <p className="text-3xl font-black text-white mt-2">{formatPrice(selectedGame.currentPrice)}</p>
                  {selectedGame.activeDiscountPercentage && (
                    <p className="text-blue-300 text-sm mt-2">
                      {Number(selectedGame.activeDiscountPercentage).toFixed(0)}% discount applied
                    </p>
                  )}
                  <div className="mt-5">{renderPurchaseButton('game', selectedGame.game.gameId)}</div>
                </aside>
              </div>

              <section>
                <h3 className="text-xl font-black text-white mb-3">Editions</h3>
                {(selectedGame.editions ?? []).length === 0 ? (
                  <p className="text-gray-400 bg-gray-900 border border-gray-700 rounded-xl p-4">No editions listed.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGame.editions.map((edition) => (
                      <div key={edition.editionId} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                        <div className="flex justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-white">{edition.name}</h4>
                            <p className="text-sm text-gray-400 mt-1">{edition.includes || 'No included content notes.'}</p>
                          </div>
                          <span className="font-black text-white">{formatPrice(edition.price)}</span>
                        </div>
                        <div className="mt-4">{renderPurchaseButton('edition', edition.editionId)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-xl font-black text-white mb-3">DLC</h3>
                {(selectedGame.dlcs ?? []).length === 0 ? (
                  <p className="text-gray-400 bg-gray-900 border border-gray-700 rounded-xl p-4">No DLC listed.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGame.dlcs.map((dlc) => (
                      <div key={dlc.dlcId} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                        <div className="flex justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-white">{dlc.name}</h4>
                            <p className="text-sm text-gray-400 mt-1">Release {formatDate(dlc.releaseDate)}</p>
                          </div>
                          <span className="font-black text-white">{formatPrice(dlc.price)}</span>
                        </div>
                        <div className="mt-4">{renderPurchaseButton('dlc', dlc.dlcId)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 h-fit">
                  <h3 className="text-xl font-black text-white mb-4">{currentUserReview ? 'Edit Review' : 'Write Review'}</h3>
                  <label className="block text-sm text-gray-400 mb-2" htmlFor="admin-store-rating">Rating</label>
                  <select
                    id="admin-store-rating"
                    value={rating}
                    onChange={(event) => setRating(Number(event.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white mb-4"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                  <label className="block text-sm text-gray-400 mb-2" htmlFor="admin-store-comment">Comment</label>
                  <textarea
                    id="admin-store-comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    className="w-full min-h-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white"
                    placeholder="Share your thoughts"
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={handleSaveReview}
                      disabled={actionLoading === `review-save-${selectedGame.game.gameId}`}
                      className="bg-blue-600 px-5 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-60"
                    >
                      Save
                    </button>
                    {currentUserReview && (
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(currentUserReview)}
                        className="bg-red-600 px-5 py-2 rounded-lg font-bold hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                  <h3 className="text-xl font-black text-white mb-4">Reviews</h3>
                  {(selectedGame.reviews ?? []).length === 0 ? (
                    <p className="text-gray-400">No reviews yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {selectedGame.reviews.map((review) => (
                        <div key={review.reviewId} className="border-b border-gray-700 pb-4 last:border-b-0">
                          <div className="flex justify-between gap-4">
                            <div>
                              <h4 className="font-bold text-white">{review.user?.username || 'Player'}</h4>
                              <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                            </div>
                            <span className="font-black text-blue-300">{review.rating}/5</span>
                          </div>
                          {review.comment && <p className="text-gray-300 mt-3">{review.comment}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStoreModePanel;
