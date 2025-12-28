import { useEffect, useState } from "react";
import { endpoints } from "@/config";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Key, RefreshCw, CheckCircle, Search, ChevronLeft, ChevronRight, Hash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  is_subscribed: boolean;
  email_sent: boolean;
  profile_image?: string;
}

const ITEMS_PER_PAGE = 10;

const AdminDashboard = () => {
    const { user: currentUser, token, isSessionExpired, validateSession, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    // Immediate dead-end for unauthorized or expired sessions
    if (!isAuthenticated || currentUser?.role !== 'ADMIN_USER') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-4 max-w-md bg-card p-8 rounded-xl border shadow-2xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Access Restricted</h2>
                    <p className="text-muted-foreground">
                        {isSessionExpired 
                            ? "Your session has expired for security. Please re-login to access the administrative console." 
                            : "You do not have the required permissions to view this secure page."}
                    </p>
                    <Button onClick={() => window.location.href = '/login'} className="w-full">
                        Return to Login
                    </Button>
                </div>
            </div>
        );
    }

    // --- State for Upstox Token ---
    const [manualToken, setManualToken] = useState("");
    const [isSavingToken, setIsSavingToken] = useState(false);
    const [isCoolingDown, setIsCoolingDown] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);

    // --- State for User Table ---
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // --- Queries & Mutations ---
    const fetchUsers = async () => {
        const response = await fetch(endpoints.admin.users, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        return response.json();
    };

    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        staleTime: 60000, 
    });

    const toggleMutation = useMutation({
        mutationFn: async ({ userId, currentStatus }: { userId: number, currentStatus: boolean }) => {
            const response = await fetch(endpoints.admin.toggleStatus(userId.toString()), {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to update status");
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
        onError: () => toast.error("Error updating status")
    });

    const refreshCacheMutation = useMutation({
        mutationFn: async () => {
             const response = await fetch(endpoints.market.refreshCache, {
                 method: 'POST',
                 headers: { 'Authorization': `Bearer ${token}` }
             });
             if (!response.ok) throw new Error("Failed to refresh cache");
             return response.json(); 
        },
        onSuccess: () => toast.success("Market Cache Refreshed Successfully"),
        onError: () => toast.error("Failed to refresh cache")
    });

    const syncExpiriesMutation = useMutation({
        mutationFn: async () => {
             const response = await fetch(endpoints.market.syncExpiries, {
                 method: 'POST',
                 headers: { 'Authorization': `Bearer ${token}` }
             });
             if (!response.ok) throw new Error("Failed to sync expiries");
             return response.json(); 
        },
        onSuccess: (data) => toast.success(`Synced Expiries: ${Object.keys(data.data || {}).length} indices updated`),
        onError: () => toast.error("Failed to sync expiries")
    });

    // --- Upstox Handlers ---
    const handleManualTokenSave = async () => {
        if (!validateSession()) return;
        if (!manualToken.trim()) return toast.error("Please enter an access token.");
        setIsSavingToken(true);
        try {
            const response = await fetch(endpoints.auth.saveToken, { 
                  method: "POST",
                  headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                  body: JSON.stringify({ access_token: manualToken.trim() })
            });

             if (!response.ok) throw new Error("Failed to save token");
             toast.success("Token saved successfully!");
             setManualToken("");
        } catch (e) {
            toast.error("Could not save token.");
        } finally {
            setIsSavingToken(false);
        }
    };

    const handleAutoGenerateToken = async () => {
        if (!validateSession()) return;
        try {
             // Assuming endpoint layout follows auth pattern
             const baseUrl = endpoints.auth.login.replace('/login', ''); // base auth url
             const resp = await fetch(`${baseUrl}/upstox-login-url`, { method: 'GET' });
             if (!resp.ok) throw new Error(`Status ${resp.status}`);
             const data = await resp.json();
             
             if (data.url) {
                 const width = 600;
                 const height = 700;
                 const popup = window.open(data.url, "UpstoxLogin", `width=${width},height=${height},top=100,left=100`);
                 if (!popup) return toast.error("Popup Blocked");

                 const handleMessage = (event: MessageEvent) => {
                     if (event.data?.type === "UPSTOX_SUCCESS") {
                         toast.success(event.data.message || "Token generated!");
                         startCooldown(15);
                         window.removeEventListener("message", handleMessage);
                     }
                 };
                 window.addEventListener("message", handleMessage);
             }
        } catch (e) {
            toast.error("Connection Failed");
        }
    };

    const startCooldown = (seconds: number) => {
        setIsCoolingDown(true);
        setCooldownTime(seconds);
        const interval = setInterval(() => {
            setCooldownTime(prev => {
                if (prev <= 1) { clearInterval(interval); setIsCoolingDown(false); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    // --- Filter & Pagination Logic ---
    const filteredUsers = users.filter((u: User) => 
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1); // Reset to page 1 on search
    }, [searchTerm]);


    // (Old check removed, consolidated at top)

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto py-8 px-4 space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-[#00bcd4]">
                             <ShieldCheck className="w-6 h-6 text-[#00bcd4]" /> Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground text-[11px] mt-1">Manage users, tokens, and system configuration.</p>
                    </div>
                </div>

                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="users">User Management</TabsTrigger>
                        <TabsTrigger value="system">System & Tokens</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users">
                        <Card>
                            <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-xl">Users ({filteredUsers.length})</CardTitle>
                                <div className="flex space-x-2 w-full md:w-auto">
                                    <div className="relative w-full md:w-64">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            placeholder="Search users..." 
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}>
                                        <RefreshCw className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {isLoading ? (
                                    <div className="p-8 text-center text-gray-500 animate-pulse">Loading users...</div>
                                ) : isError ? (
                                    <div className="p-8 text-center text-red-500">Error loading users.</div>
                                ) : (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                                                    <tr>
                                                        <th className="px-6 py-3">User</th>
                                                        <th className="px-6 py-3">Role</th>
                                                        <th className="px-6 py-3 text-center">Status</th>
                                                        <th className="px-6 py-3 text-center">Subscribed</th>
                                                        <th className="px-6 py-3 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border">
                                                    {paginatedUsers.map((u: User) => (
                                                        <tr key={u.id} className="hover:bg-muted/30">
                                                            <td className="px-6 py-3">
                                                                <div className="flex items-center gap-3">
                                                                    {u.profile_image ? (
                                                                        <img 
                                                                          src={u.profile_image.startsWith('http') ? u.profile_image : `${endpoints.auth.login.replace('/auth/login', '')}/${u.profile_image}`} 
                                                                          alt="" 
                                                                          className="w-8 h-8 rounded-full object-cover border border-border" 
                                                                          onError={(e) => e.currentTarget.src = "/img/default_user.png"}
                                                                        />
                                                                    ) : (
                                                                        <img 
                                                                          src="/img/default_user.png" 
                                                                          alt="" 
                                                                          className="w-8 h-8 rounded-full object-cover border border-border" 
                                                                        />
                                                                    )}
                                                                    <div>
                                                                        <div className="font-medium text-foreground">{u.username}</div>
                                                                        <div className="text-muted-foreground text-xs">{u.email}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-3">
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${u.role === 'ADMIN_USER' ? 'bg-purple-500/10 text-purple-500' : 'bg-muted text-muted-foreground'}`}>
                                                                    {u.role}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-3 text-center">
                                                                 {u.email_sent ? (
                                                                     <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                                                                 ) : (
                                                                     <div className="w-2 h-2 rounded-full bg-muted mx-auto" />
                                                                 )}
                                                            </td>
                                                            <td className="px-6 py-3 text-center">
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${u.is_subscribed ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                                    {u.is_subscribed ? 'Yes' : 'No'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-3 text-right">
                                                                <Button 
                                                                    onClick={() => toggleMutation.mutate({ userId: u.id, currentStatus: u.is_subscribed })}
                                                                    disabled={toggleMutation.isPending}
                                                                    variant={u.is_subscribed ? "destructive" : "default"}
                                                                    size="sm"
                                                                    className="h-7 text-xs"
                                                                >
                                                                    {u.is_subscribed ? "Revoke" : "Approve"}
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        
                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-end p-4 gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                    disabled={currentPage === 1}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <span className="text-sm text-muted-foreground">
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="system" className="space-y-6">
                         {/* Cache Control */}
                         <Card>
                             <CardHeader>
                                 <CardTitle className="text-base flex items-center gap-2">
                                     <Hash className="w-4 h-4 text-orange-500" /> System Cache
                                 </CardTitle>
                                 <CardDescription className="text-xs">
                                     Force refresh the market data cache if charts are not updating.
                                 </CardDescription>
                             </CardHeader>
                             <CardContent>
                                  <Button 
                                     variant="destructive"
                                     onClick={() => refreshCacheMutation.mutate()} 
                                     disabled={refreshCacheMutation.isPending}
                                     size="sm"
                                 >
                                     <RefreshCw className={`w-4 h-4 mr-2 ${refreshCacheMutation.isPending ? 'animate-spin' : ''}`} />
                                     {refreshCacheMutation.isPending ? "Refreshing..." : "Purge & Refresh Cache"}
                                 </Button>
                             </CardContent>
                         </Card>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             
                             {/* Sync Expiries */}
                             <Card>
                                 <CardHeader className="pb-3">
                                     <CardTitle className="text-base flex items-center gap-2">
                                         <RefreshCw className="w-4 h-4 text-purple-500" /> Sync Expiries
                                     </CardTitle>
                                     <CardDescription className="text-xs">
                                         Fetch latest contract expiries from Upstox to DB.
                                         (Runs daily at 08:30 AM automatically)
                                     </CardDescription>
                                 </CardHeader>
                                 <CardContent>
                                      <Button 
                                         variant="outline"
                                         onClick={() => syncExpiriesMutation.mutate()} 
                                         disabled={syncExpiriesMutation.isPending}
                                         size="sm"
                                         className="w-full"
                                     >
                                         {syncExpiriesMutation.isPending ? "Syncing..." : "Sync Now"}
                                     </Button>
                                 </CardContent>
                             </Card>

                             {/* Auto Token */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <RefreshCw className="w-4 h-4 text-green-600" /> Auto Generate Token
                                    </CardTitle>
                                    <CardDescription className="text-xs">Login to Upstox to refresh access token.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                     <Button 
                                        onClick={handleAutoGenerateToken} 
                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        disabled={isCoolingDown}
                                        size="sm"
                                    >
                                        {isCoolingDown ? `Wait ${cooldownTime}s` : "Generate New Token"}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Manual Token */}
                            <Card>
                                <CardHeader className="pb-3">
                                     <CardTitle className="text-base flex items-center gap-2">
                                        <Key className="w-4 h-4 text-blue-600" /> Manual Token Entry
                                     </CardTitle>
                                     <CardDescription className="text-xs">Paste token if auto-generation fails.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex gap-2">
                                     <Textarea 
                                        placeholder="Paste token..." 
                                        value={manualToken}
                                        onChange={(e) => setManualToken(e.target.value)}
                                        className="min-h-[36px] h-9 py-1 text-xs font-mono resize-none"
                                     />
                                     <Button 
                                        onClick={handleManualTokenSave} 
                                        disabled={isSavingToken || !manualToken}
                                        size="sm"
                                    >
                                        Save
                                     </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AdminDashboard;

