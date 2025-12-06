import { useEffect, useState } from "react";
import { endpoints } from "@/config";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  is_subscribed: boolean;
}

const AdminDashboard = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('alphaedge_session');
            const response = await fetch(endpoints.admin.users, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                toast.error("Failed to fetch users");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching users");
        } finally {
            setLoading(false);
        }
    };

    const toggleSubscription = async (userId: number, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('alphaedge_session');
            const response = await fetch(endpoints.admin.toggleStatus(userId.toString()), {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
                if (updatedUser.is_subscribed) {
                    toast.success(`Successfully enabled user to use my account details with live features.`);
                } else {
                    toast.info(`Privileges revoked for user.`);
                }
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating status");
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (currentUser?.role !== 'ADMIN_USER') {
        return <div className="p-8 text-center text-red-500">Access Denied</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN_USER' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_subscribed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.is_subscribed ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Button 
                                            onClick={() => toggleSubscription(user.id, user.is_subscribed)}
                                            variant={user.is_subscribed ? "destructive" : "default"}
                                            size="sm"
                                        >
                                            {user.is_subscribed ? "Disable" : "Enable"}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
