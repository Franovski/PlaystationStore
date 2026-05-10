import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../store/slices/authSlice';
import { CreateOrderPayload } from '../../orders/services/ordersApi';
import { GameDetails, Order, UserLibrary, Wishlist } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  addDashboardWalletFunds,
  addDashboardWishlistItem,
  fetchDashboardData,
  purchaseDashboardItem,
  removeDashboardWishlistItem,
} from '../../../store/slices/dashboardSlice';

type DashboardTab = 'overview' | 'browse' | 'wishlist' | 'library' | 'orders' | 'wallet';

const tabs: Array<{ id: DashboardTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'browse', label: 'Browse Games' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'library', label: 'Library' },
  { id: 'orders', label: 'Orders' },
  { id: 'wallet', label: 'Wallet' },
];

const formatPrice = (value: number | string | undefined | null) => `$${Number(value ?? 0).toFixed(2)}`;
const formatDate = (value: string | undefined | null) => (value ? String(value).slice(0, 10) : 'N/A');

const UserDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { dashboard, catalog, isLoading, actionLoading, error, message } = useAppSelector((state) => state.dashboard);

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [walletAmount, setWalletAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<CreateOrderPayload['paymentMethod']>('wallet');

  const wishlistGameIds = useMemo(
    () => new Set((dashboard?.wishlist ?? []).map((item) => Number(item.gameId))),
    [dashboard?.wishlist],
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const itemName = (itemType: string, itemId: number | string) => {
    const numericId = Number(itemId);

    if (itemType === 'game') {
      return catalog.find((entry) => Number(entry.game.gameId) === numericId)?.game.title ?? `Game #${itemId}`;
    }

    if (itemType === 'dlc') {
      return catalog.flatMap((entry) => entry.dlcs).find((dlc) => Number(dlc.dlcId) === numericId)?.name ?? `DLC #${itemId}`;
    }

    if (itemType === 'edition') {
      return catalog
        .flatMap((entry) => entry.editions)
        .find((edition) => Number(edition.editionId) === numericId)?.name ?? `Edition #${itemId}`;
    }

    return `${itemType} #${itemId}`;
  };

  const libraryItemName = (item: UserLibrary) => {
    const itemType = String(item.itemType || '').toLowerCase();
    const numericId = Number(item.itemId);

    if (itemType === 'game') {
      return item.game?.title
        || catalog.find((entry) => Number(entry.game.gameId) === numericId)?.game.title
        || 'Unknown Game';
    }

    if (itemType === 'dlc') {
      return item.dlc?.name
        || catalog.flatMap((entry) => entry.dlcs).find((dlc) => Number(dlc.dlcId) === numericId)?.name
        || 'Unknown DLC';
    }

    if (itemType === 'edition') {
      return item.edition?.name
        || catalog.flatMap((entry) => entry.editions).find((edition) => Number(edition.editionId) === numericId)?.name
        || 'Unknown Edition';
    }

    return 'Unknown Item';
  };

  const isOwned = (itemType: string, itemId: number | string) =>
    Boolean(
      dashboard?.library.some(
        (item) => item.itemType === itemType && Number(item.itemId) === Number(itemId),
      ),
    );

  const handlePurchase = (itemType: 'game' | 'dlc' | 'edition', itemId: number | string) => {
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
    const result = await dispatch(addDashboardWalletFunds({ actionKey: 'wallet-add-funds', amount }));

    if (addDashboardWalletFunds.fulfilled.match(result)) {
      setWalletAmount('');
    }
  };

  const renderSummaryCard = (label: string, value: string | number, tab: DashboardTab) => (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-left hover:border-blue-500 hover:bg-gray-750 transition-colors"
    >
      <span className="block text-sm text-gray-400">{label}</span>
      <span className="block text-3xl font-bold text-white mt-2">{value}</span>
    </button>
  );

  const renderPurchaseControls = (itemType: 'game' | 'dlc' | 'edition', itemId: number | string) => {
    const key = `buy-${itemType}-${itemId}`;

    if (isOwned(itemType, itemId)) {
      return <span className="text-sm font-bold text-green-400">Owned</span>;
    }

    return (
      <button
        type="button"
        disabled={actionLoading === key}
        onClick={() => handlePurchase(itemType, itemId)}
        className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 disabled:opacity-60"
      >
        {actionLoading === key ? 'Buying...' : 'Buy'}
      </button>
    );
  };

  const renderGameCard = (detail: GameDetails) => {
    const gameId = detail.game.gameId;
    const inWishlist = wishlistGameIds.has(Number(gameId));

    return (
      <div key={gameId} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden flex flex-col">
        <div className="h-44 bg-gray-700 flex items-center justify-center px-4 text-center">
          <div>
            <h3 className="text-2xl font-bold text-white">{detail.game.title}</h3>
            {detail.game.ageRating && <p className="text-sm text-gray-300 mt-2">{detail.game.ageRating}</p>}
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <p className="text-sm text-gray-400">{detail.game.developer || 'Unknown Developer'}</p>
          <p className="text-sm text-gray-500 mt-1">{formatDate(detail.game.releaseDate)}</p>
          {detail.game.description && (
            <p className="text-sm text-gray-400 mt-3 line-clamp-3">{detail.game.description}</p>
          )}
          <div className="flex items-center gap-2 mt-4">
            {detail.activeDiscountPercentage ? (
              <>
                <span className="text-gray-500 line-through">{formatPrice(detail.game.basePrice)}</span>
                <span className="text-xl font-bold text-white">{formatPrice(detail.currentPrice)}</span>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                  -{Number(detail.activeDiscountPercentage).toFixed(0)}%
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-white">{formatPrice(detail.currentPrice)}</span>
            )}
          </div>
          <div className="mt-auto pt-5 flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => navigate(`/games/${gameId}`)}
              className="bg-gray-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-600"
            >
              Details
            </button>
            {inWishlist ? (
              <button
                type="button"
                onClick={() => handleRemoveWishlist(gameId)}
                className="bg-blue-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700"
              >
                Saved
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleAddWishlist(gameId)}
                className="bg-gray-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-600"
              >
                Wishlist
              </button>
            )}
            {renderPurchaseControls('game', gameId)}
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {renderSummaryCard('Wallet', formatPrice(dashboard?.walletBalance), 'wallet')}
        {renderSummaryCard('Wishlist', dashboard?.wishlistCount ?? 0, 'wishlist')}
        {renderSummaryCard('Library', dashboard?.libraryCount ?? 0, 'library')}
        {renderSummaryCard('Orders', dashboard?.orderCount ?? 0, 'orders')}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Orders</h2>
          {(dashboard?.orders ?? []).slice(0, 3).map(renderOrderRow)}
          {dashboard?.orders.length === 0 && <p className="text-gray-400">No orders yet.</p>}
        </section>
        <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Wishlist</h2>
          {(dashboard?.wishlist ?? []).slice(0, 3).map(renderWishlistRow)}
          {dashboard?.wishlist.length === 0 && <p className="text-gray-400">No wishlist items yet.</p>}
        </section>
      </div>
    </div>
  );

  const renderBrowse = () => (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">Browse Games</h2>
        <select
          value={paymentMethod}
          onChange={(event) => setPaymentMethod(event.target.value as CreateOrderPayload['paymentMethod'])}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
        >
          <option value="wallet">Wallet</option>
          <option value="card">Card</option>
        </select>
      </div>
      {catalog.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center text-gray-400">
          No games available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {catalog.map(renderGameCard)}
        </div>
      )}
    </div>
  );

  const renderWishlistRow = (item: Wishlist) => (
    <div key={item.wishlistId} className="flex items-center justify-between gap-4 border-b border-gray-700 py-4 last:border-b-0">
      <div>
        <h3 className="font-bold text-white">{item.game?.title ?? `Game #${item.gameId}`}</h3>
        <p className="text-sm text-gray-400">Added {formatDate(item.addedAt)}</p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => navigate(`/games/${item.gameId}`)}
          className="bg-gray-700 px-3 py-2 rounded text-sm font-bold hover:bg-gray-600"
        >
          Details
        </button>
        <button
          type="button"
          onClick={() => handleRemoveWishlist(item.gameId)}
          className="bg-red-600 px-3 py-2 rounded text-sm font-bold hover:bg-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );

  const renderWishlist = () => (
    <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Wishlist</h2>
      {(dashboard?.wishlist ?? []).length === 0 ? <p className="text-gray-400">No wishlist items yet.</p> : dashboard?.wishlist.map(renderWishlistRow)}
    </section>
  );

  const renderLibraryRow = (item: UserLibrary) => (
    <div key={item.libraryId} className="flex items-center justify-between gap-4 border-b border-gray-700 py-4 last:border-b-0">
      <div>
        <h3 className="font-bold text-white">{libraryItemName(item)}</h3>
        <p className="text-sm text-gray-400">
          {item.itemType.toUpperCase()} purchased {formatDate(item.purchaseDate)}
        </p>
      </div>
      <span className="text-sm font-bold text-green-400">Owned</span>
    </div>
  );

  const renderLibrary = () => (
    <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Library</h2>
      {(dashboard?.library ?? []).length === 0 ? <p className="text-gray-400">No owned items yet.</p> : dashboard?.library.map(renderLibraryRow)}
    </section>
  );

  const renderOrderRow = (order: Order) => (
    <div key={order.orderId} className="border-b border-gray-700 py-4 last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white">Order #{order.orderId}</h3>
          <p className="text-sm text-gray-400">
            {formatDate(order.orderDate)} · {order.paymentMethod} · {order.status}
          </p>
        </div>
        <span className="text-lg font-bold text-white">{formatPrice(order.totalPrice)}</span>
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

  const renderOrders = () => (
    <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Order History</h2>
      {(dashboard?.orders ?? []).length === 0 ? <p className="text-gray-400">No orders yet.</p> : dashboard?.orders.map(renderOrderRow)}
    </section>
  );

  const renderWallet = () => (
    <section className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-2">Wallet</h2>
      <p className="text-4xl font-bold text-white mb-6">{formatPrice(dashboard?.walletBalance)}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={walletAmount}
          onChange={(event) => setWalletAmount(event.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white flex-1"
          placeholder="Amount"
        />
        <button
          type="button"
          onClick={handleAddFunds}
          disabled={actionLoading === 'wallet-add-funds'}
          className="bg-blue-600 px-6 py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-60"
        >
          {actionLoading === 'wallet-add-funds' ? 'Adding...' : 'Add Funds'}
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-4">Updated {formatDate(dashboard?.wallet?.updatedAt)}</p>
    </section>
  );

  const renderActiveTab = () => {
    if (activeTab === 'overview') return renderOverview();
    if (activeTab === 'browse') return renderBrowse();
    if (activeTab === 'wishlist') return renderWishlist();
    if (activeTab === 'library') return renderLibrary();
    if (activeTab === 'orders') return renderOrders();
    return renderWallet();
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-6 flex flex-col space-y-3 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-4 tracking-wider">My Store</h2>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`text-left w-full p-3 rounded transition-colors font-bold ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="mt-auto pt-8 space-y-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded font-bold"
          >
            Storefront
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 p-3 rounded font-bold"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.username || 'Player'}</h1>
            <p className="text-gray-400">Your games, wishlist, wallet, and orders are ready.</p>
          </div>
        </div>

        {message && <div className="bg-green-500/10 border border-green-500 text-green-300 p-4 rounded mb-5">{message}</div>}
        {error && <div className="bg-red-500/10 border border-red-500 text-red-300 p-4 rounded mb-5">{error}</div>}

        {isLoading ? (
          <div className="flex justify-center p-16">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent" />
          </div>
        ) : (
          renderActiveTab()
        )}
      </main>
    </div>
  );
};

export default UserDashboardPage;
