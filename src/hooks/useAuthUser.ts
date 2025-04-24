
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthUserState {
  loading: boolean;
  session: any;
  user: any;
  role: "admin" | "member" | null;
  profileStatus: "pending" | "approved" | "rejected" | null;
}

export function useAuthUser() {
  const [state, setState] = useState<AuthUserState>({
    loading: true,
    session: null,
    user: null,
    role: null,
    profileStatus: null,
  });

  useEffect(() => {
    // Listen for auth changes and get profile/role
    const getSessionAndRole = async () => {
      // This flow prevents race conditions if quickly signing in/out
      setState((s) => ({ ...s, loading: true }));
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user || null;

      let role: "admin" | "member" | null = null;
      let profileStatus: "pending" | "approved" | "rejected" | null = null;
      
      if (user) {
        console.log("User authenticated:", user.id);
        
        // Check user_roles table for role
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        role = roles?.length
          ? (roles[0].role as "admin" | "member")
          : (user.email === "abishaioff@gmail.com" ? "admin" : "member");
          
        // Get profile status
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("status")
          .eq("id", user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }
        
        console.log("Profile status found:", profile?.status);
        profileStatus = profile?.status as "pending" | "approved" | "rejected" | null;
        
        // If admin, always set status to approved (admins don't need approval)
        if (role === "admin") {
          profileStatus = "approved";
        }
        
        // If member but no profile status found, set to pending as default
        if (role === "member" && !profileStatus) {
          profileStatus = "pending";
        }
      }

      setState({ session, user, role, profileStatus, loading: false });
    };

    // Set up listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getSessionAndRole();
    });
    
    // Initial load
    getSessionAndRole();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
