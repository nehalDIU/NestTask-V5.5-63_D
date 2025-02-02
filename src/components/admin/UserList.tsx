import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { User } from '../../types/auth';

interface UserListProps {
  users: User[];
  onDeleteUser: (userId: string) => void;
}

export function UserList({ users, onDeleteUser }: UserListProps) {
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      setDeletingUserId(selectedUser.id);
      await onDeleteUser(selectedUser.id);
    } finally {
      setDeletingUserId(null);
      setShowConfirmation(false);
      setSelectedUser(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Desktop view */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteClick(user)}
                      disabled={deletingUserId === user.id || user.role === 'admin'}
                      className={`text-red-600 hover:text-red-900 transition-colors ${
                        deletingUserId === user.id ? 'opacity-50 cursor-not-allowed' : ''
                      } ${user.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        <div className="block md:hidden">
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div key={user.id} className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{user.email}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(user)}
                    disabled={deletingUserId === user.id || user.role === 'admin'}
                    className={`text-red-600 hover:text-red-900 text-sm ${
                      deletingUserId === user.id ? 'opacity-50 cursor-not-allowed' : ''
                    } ${user.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                  <span className="text-xs text-gray-500">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedUser && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowConfirmation(false)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-xl z-50 w-full max-w-md">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Confirm User Deletion</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the user <span className="font-medium text-gray-900">{selectedUser.email}</span>? 
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingUserId === selectedUser.id}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${
                  deletingUserId === selectedUser.id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {deletingUserId === selectedUser.id ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}