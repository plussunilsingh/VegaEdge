import { useEffect, useState } from "react";
import { endpoints } from "@/config";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
    const queryClient = useQueryClient();

    const fetchUsers = async () => {
        const token = localStorage.getItem('alphaedge_session');
        const response = await fetch(endpoints.admin.users, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        return response.json();
    };

    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        staleTime: 60000, // Cache for 1 minute
    });

    const toggleMutation = useMutation({
        mutationFn: async ({ userId, currentStatus }: { userId: number, currentStatus: boolean }) => {
            const token = localStorage.getItem('alphaedge_session');
            const response = await fetch(endpoints.admin.toggleStatus(userId.toString()), {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to update status");
            }
            return response.json();
        },
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['users'], (oldUsers: User[] | undefined) => {
                return oldUsers ? oldUsers.map(u => u.id === updatedUser.id ? updatedUser : u) : [];
            });
            if (updatedUser.is_subscribed) {
                toast.success(`Successfully enabled user.`);
            } else {
                toast.info(`Privileges revoked for user.`);
            }
        },
        onError: () => {
            toast.error("Error updating status");
        }
    });

    if (currentUser?.role !== 'ADMIN_USER') {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <AuthenticatedNavbar />
                <div className="flex-1 flex items-center justify-center text-red-500">
                    Access Denied
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <AuthenticatedNavbar />
            <div className="flex-1 container mx-auto py-10 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}>
                        Refresh List
                    </Button>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500 animate-pulse">Loading users...</div>
                    ) : isError ? (
                        <div className="p-8 text-center text-red-500">Error loading users.</div>
                    ) : (
                        <div className="overflow-x-auto">
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
                                    {users.map((user: User) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
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
                                                    onClick={() => toggleMutation.mutate({ userId: user.id, currentStatus: user.is_subscribed })}
                                                    disabled={toggleMutation.isPending}
                                                    variant={user.is_subscribed ? "destructive" : "default"}
                                                    size="sm"
                                                    className="transition-all active:scale-95"
                                                >
                                                    {user.is_subscribed ? "Disable" : "Enable"}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
