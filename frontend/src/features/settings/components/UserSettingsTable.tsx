import React from 'react';
import { User } from '../../../types';
import { UpdateUserSettingsPayload } from '../services/settingsApi';
import UserSettingsRow from './UserSettingsRow';

type UserSettingsTableProps = {
  users: User[];
  currentUserId?: string;
  updatingUserId: string | null;
  onUpdate: (userId: string, changes: UpdateUserSettingsPayload) => void;
};

const UserSettingsTable: React.FC<UserSettingsTableProps> = ({
  users,
  currentUserId,
  updatingUserId,
  onUpdate,
}) => {
  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-800 px-6 py-12 text-center text-gray-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900 text-xs font-bold uppercase tracking-wider text-gray-400">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Email Verified</th>
              <th className="px-6 py-4">2FA</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Settings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => (
              <UserSettingsRow
                key={user.userId}
                user={user}
                currentUserId={currentUserId}
                isUpdating={updatingUserId === user.userId}
                onUpdate={onUpdate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserSettingsTable;
