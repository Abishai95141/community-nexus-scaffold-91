
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { format } from "date-fns";

export function ApprovalHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("approval_history")
        .select(`
          *,
          profiles:user_id (name, email),
          admin:admin_id (name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching approval history:", error);
      } else {
        setHistory(data || []);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="p-4">Loading approval history...</div>
      ) : history.length === 0 ? (
        <div className="p-4 text-muted-foreground">No approval history found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.profiles?.name || 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground">{item.profiles?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={item.status === 'approved' ? 'default' : 'destructive'}
                    className={item.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.admin?.name || 'System'}</TableCell>
                <TableCell>{item.notes || '-'}</TableCell>
                <TableCell>
                  {item.created_at && format(new Date(item.created_at), 'MMM d, yyyy HH:mm')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
