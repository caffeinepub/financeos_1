import { RefreshCw, Shield, UserCheck, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { useActor } from "../hooks/useActor";

type UserEntry = {
  principal: string;
  name: string;
  email: string;
  suspended: boolean;
};

export default function AdminPage() {
  const { actor } = useActor();
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!actor) return;
    (async () => {
      try {
        const admin = await actor.bootstrapAdmin().catch(() => false);
        setBootstrapped(true);
        const check = await actor.isCallerAdmin().catch(() => false);
        setIsAdmin(!!check || !!admin);
        if (check || admin) await loadUsers();
      } catch {
        setError("Failed to initialize admin");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actor]);

  const loadUsers = async () => {
    if (!actor) return;
    try {
      const raw = await actor.adminGetAllUsers();
      // raw is Array<[string, {name, email}]>
      // also load suspended list via isCallerBlocked is per-user only
      // We'll check suspension via a local map from suspendedPrincipals
      // Since we don't have a direct "getSuspended" endpoint, we'll just show users
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const list: UserEntry[] = (raw as any[]).map((entry: any) => {
        const principal = Array.isArray(entry) ? entry[0] : entry.principal;
        const profile = Array.isArray(entry) ? entry[1] : entry;
        return {
          principal: String(principal),
          name: profile?.name || "—",
          email: profile?.email || "—",
          suspended: false,
        };
      });
      setUsers(list);
    } catch {
      setError("Failed to load users");
    }
  };

  const handleSuspend = async (u: UserEntry) => {
    if (!actor) return;
    setActionLoading(u.principal);
    try {
      if (u.suspended) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (actor as any).adminUnsuspendUser(u.principal);
        setUsers((prev) =>
          prev.map((x) =>
            x.principal === u.principal ? { ...x, suspended: false } : x,
          ),
        );
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (actor as any).adminSuspendUser(u.principal);
        setUsers((prev) =>
          prev.map((x) =>
            x.principal === u.principal ? { ...x, suspended: true } : x,
          ),
        );
      }
    } catch {
      /* ignore */
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500 animate-pulse">
          Loading admin panel...
        </div>
      </div>
    );
  }

  if (!isAdmin && bootstrapped) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-sm">Access denied. Admin only.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
        </div>
        <Button variant="outline" size="sm" onClick={loadUsers}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-700">
            Registered Users ({users.length})
          </span>
        </div>
        {users.length === 0 ? (
          <div className="px-5 py-8 text-center text-slate-400 text-sm">
            No registered users yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500">
                  Name
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500 hidden md:table-cell">
                  Email
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500 hidden lg:table-cell">
                  Principal
                </th>
                <th className="text-left px-5 py-2.5 text-xs font-semibold text-slate-500">
                  Status
                </th>
                <th className="text-right px-5 py-2.5 text-xs font-semibold text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr
                  key={u.principal}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-slate-800">
                    {u.name}
                  </td>
                  <td className="px-5 py-3 text-slate-500 hidden md:table-cell">
                    {u.email}
                  </td>
                  <td className="px-5 py-3 text-slate-400 font-mono text-xs hidden lg:table-cell">
                    {u.principal.slice(0, 20)}...
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        u.suspended
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {u.suspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      size="sm"
                      variant={u.suspended ? "outline" : "destructive"}
                      disabled={actionLoading === u.principal}
                      onClick={() => handleSuspend(u)}
                      className="text-xs h-7"
                    >
                      {u.suspended ? (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" /> Unsuspend
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3 mr-1" /> Suspend
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
