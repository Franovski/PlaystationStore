import React, { useState } from 'react';
import { CheckCircle, ShieldOff, XCircle, Settings, Save } from 'lucide-react';
import { Role, User } from '../../../types';
import { UpdateUserSettingsPayload } from '../services/settingsApi';

type UserSettingsRowProps = {
  user: User;
  currentUserId?: string;
  isUpdating: boolean;
  onUpdate: (userId: string, changes: UpdateUserSettingsPayload) => void;
};

const formatDate = (value?: string | null) => (value ? String(value).slice(0, 10) : 'N/A');

const UserSettingsRow: React.FC<UserSettingsRowProps> = ({
  user,
  currentUserId,
  isUpdating,
  onUpdate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [sensitiveFields, setSensitiveFields] = useState({
    password: '',
    totpSecret: user.totpSecret || '',
    refreshToken: user.refreshToken || '',
    passwordResetToken: user.passwordResetToken || '',
    passwordResetMethod: user.passwordResetMethod || '',
    passwordResetAttempts: user.passwordResetAttempts ?? 0,
  });

  const isCurrentUser = currentUserId === user.userId;
  const displayName = user.username || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

  const handleSaveSensitive = () => {
    onUpdate(user.userId, {
      ...(sensitiveFields.password ? { password: sensitiveFields.password } : {}),
      ...(sensitiveFields.totpSecret !== user.totpSecret ? { totpSecret: sensitiveFields.totpSecret || null } : {}),
      ...(sensitiveFields.refreshToken !== user.refreshToken ? { refreshToken: sensitiveFields.refreshToken || null } : {}),
      ...(sensitiveFields.passwordResetToken !== user.passwordResetToken ? { passwordResetToken: sensitiveFields.passwordResetToken || null } : {}),
      ...(sensitiveFields.passwordResetMethod !== user.passwordResetMethod ? { passwordResetMethod: sensitiveFields.passwordResetMethod || null } : {}),
      ...(sensitiveFields.passwordResetAttempts !== user.passwordResetAttempts ? { passwordResetAttempts: Number(sensitiveFields.passwordResetAttempts) } : {}),
    });
    setSensitiveFields(prev => ({ ...prev, password: '' })); // clear password after save
  };

  return (
    <>
      <tr className="transition-colors hover:bg-gray-750">
        <td className="px-6 py-4">
          <div className="flex flex-col">
            <span className="font-bold text-white">{displayName}</span>
            <span className="text-xs text-gray-400">{user.email}</span>
          </div>
        </td>
        <td className="px-6 py-4 font-mono text-xs text-gray-500">{user.userId}</td>
        <td className="px-6 py-4">
          <select
            value={user.role}
            disabled={isUpdating || isCurrentUser}
            onChange={(event) => onUpdate(user.userId, { role: event.target.value as Role })}
            className="min-w-40 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 font-bold uppercase text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Role for ${displayName}`}
          >
            <option value="admin">Admin</option>
            <option value="playstation_user">PlayStation User</option>
          </select>
          {isCurrentUser && (
            <div className="mt-1 text-xs font-semibold text-gray-500">Current admin</div>
          )}
        </td>
        <td className="px-6 py-4">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              onUpdate(user.userId, {
                isEmailVerified: !Boolean(user.isEmailVerified),
              })
            }
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              user.isEmailVerified
                ? 'border-emerald-800/60 bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50'
                : 'border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {user.isEmailVerified ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {user.isEmailVerified ? 'Verified' : 'Unverified'}
          </button>
        </td>
        <td className="px-6 py-4">
          {user.isTotpEnabled ? (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onUpdate(user.userId, { isTotpEnabled: false })}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-800/60 bg-amber-900/30 px-3 py-2 font-bold text-amber-300 transition-colors hover:bg-amber-900/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShieldOff className="h-4 w-4" />
              Disable
            </button>
          ) : (
            <span className="inline-flex rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 font-bold text-gray-400">
              Disabled
            </span>
          )}
        </td>
        <td className="px-6 py-4 text-gray-400">{formatDate(user.createdAt)}</td>
        <td className="px-6 py-4 text-right">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-500"
          >
            <Settings className="h-4 w-4" />
            All Fields
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-gray-800/50">
          <td colSpan={7} className="border-t border-gray-700 px-6 py-6">
            <div className="mx-auto flex max-w-4xl flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Sensitive Admin Settings
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400">New Password (leave blank to keep)</label>
                  <input
                    type="password"
                    value={sensitiveFields.password}
                    onChange={(e) => setSensitiveFields({ ...sensitiveFields, password: e.target.value })}
                    className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400">TOTP Secret</label>
                  <input
                    type="text"
                    value={sensitiveFields.totpSecret}
                    onChange={(e) => setSensitiveFields({ ...sensitiveFields, totpSecret: e.target.value })}
                    className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    placeholder="TOTP Secret"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400">Refresh Token</label>
                  <input
                    type="text"
                    value={sensitiveFields.refreshToken}
                    onChange={(e) => setSensitiveFields({ ...sensitiveFields, refreshToken: e.target.value })}
                    className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400">Password Reset Token</label>
                  <input
                    type="text"
                    value={sensitiveFields.passwordResetToken}
                    onChange={(e) => setSensitiveFields({ ...sensitiveFields, passwordResetToken: e.target.value })}
                    className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400">Reset Method ('link' or 'otp')</label>
                  <input
                    type="text"
                    value={sensitiveFields.passwordResetMethod}
                    onChange={(e) => setSensitiveFields({ ...sensitiveFields, passwordResetMethod: e.target.value })}
                    className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400">Reset Attempts</label>
                  <input
                    type="number"
                    value={sensitiveFields.passwordResetAttempts}
                    onChange={(e) => setSensitiveFields({ ...sensitiveFields, passwordResetAttempts: Number(e.target.value) })}
                    className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleSaveSensitive}
                  className="inline-flex items-center gap-2 rounded bg-emerald-600 px-4 py-2 font-bold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isUpdating ? 'Saving...' : 'Save Sensitive Fields'}
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default UserSettingsRow;
