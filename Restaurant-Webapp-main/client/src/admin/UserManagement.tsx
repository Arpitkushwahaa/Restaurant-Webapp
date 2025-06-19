import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  _id: string;
  fullname: string;
  email: string;
  contact: number;
  admin: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { setAdmin, user: currentUser } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8085/api/v1/user/users', {
        withCredentials: true,
      });
      
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      await setAdmin(userId, isAdmin);
      // Update local state
      setUsers(users.map(u => 
        u._id === userId ? { ...u, admin: isAdmin } : u
      ));
    } catch (error) {
      console.error('Failed to update admin status:', error);
    }
  };

  if (!currentUser?.admin) {
    return <div className="p-4">You don't have permission to access this page.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.fullname}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.admin ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button 
                        variant={user.admin ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleAdmin(user._id, !user.admin)}
                        disabled={currentUser._id === user._id} // Prevent changing own status
                      >
                        {user.admin ? 'Remove Admin' : 'Make Admin'}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 