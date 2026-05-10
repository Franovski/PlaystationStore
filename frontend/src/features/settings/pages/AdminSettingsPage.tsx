import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, RefreshCw, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  clearSettingsStatus,
  fetchAdminUsers,
  updateUserSettings,
} from '../../../store/slices/settingsSlice';
import UserSettingsTable from '../components/UserSettingsTable';
import { UpdateUserSettingsPayload } from '../services/settingsApi';

const AdminSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const {
    users,
    isLoading,
    isUpdating,
    updatingUserId,
    error,
    successMessage,
  } = useAppSelector((state) => state.settings);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAdminUsers());

    return () => {
      dispatch(clearSettingsStatus());
    };
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return users;

    return users.filter((user) => {
      const name = `${user.username || ''} ${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();
      const role = (user.role || '').toLowerCase();

      return name.includes(normalized) || email.includes(normalized) || role.includes(normalized);
    });
  }, [searchTerm, users]);

  const handleUpdate = (userId: string, changes: UpdateUserSettingsPayload) => {
    dispatch(updateUserSettings({ userId, changes }));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100">
      <div className="border-b border-gray-800 bg-[#0f172a]/95 px-6 py-6 shadow-sm backdrop-blur lg:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm font-bold text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Admin Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">Settings</h1>
                <p className="mt-1 font-medium text-gray-400">
                  Manage user roles, email verification, and 2FA status.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => dispatch(fetchAdminUsers())}
            disabled={isLoading || isUpdating}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-900/30 transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <main className="p-6 lg:p-10">
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-shadow focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-96"
          />
          <div className="text-sm font-semibold text-gray-400">
            {filteredUsers.length} of {users.length} users
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-500 bg-green-500/10 p-4 font-medium text-green-300">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 p-4 font-medium text-red-300">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-4">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500"></div>
            <p className="font-medium tracking-wider text-gray-400">Loading user settings...</p>
          </div>
        ) : (
          <UserSettingsTable
            users={filteredUsers}
            currentUserId={currentUser?.userId}
            updatingUserId={updatingUserId}
            onUpdate={handleUpdate}
          />
        )}
      </main>
    </div>
  );
};

export default AdminSettingsPage;
