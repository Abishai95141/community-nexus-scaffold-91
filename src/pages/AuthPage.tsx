
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Helmet } from "react-helmet";

function BuildersArcLogo() {
  // Prominent logo
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="bg-primary text-primary-foreground rounded-full h-24 w-24 flex items-center justify-center mb-3 text-4xl font-extrabold shadow-lg">
        BA
      </div>
      <span className="font-extrabold text-4xl tracking-tighter">Builders Arc</span>
    </div>
  );
}

function AdminSignIn({ onResult }: { onResult?: (err: string | null) => void }) {
  const [email] = useState("abishaioff@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (email !== "abishaioff@gmail.com") {
      setError("Not allowed. Only admin can use this form.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      onResult?.(error.message);
    } else {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase.from("user_roles").upsert(
          [{ user_id: userData.user.id, role: "admin" }],
          { onConflict: "user_id,role" }
        );
      }
      onResult?.(null);
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Admin Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
          <Input value={email} disabled className="text-gray-400 bg-muted" />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>Sign In</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function MemberAuth({ onResult }: { onResult?: (err: string | null) => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    if (email.trim().toLowerCase() === "abishaioff@gmail.com") {
      setErr("Admin email cannot be used for member login.");
      setLoading(false);
      onResult?.("Admin email cannot be used for member login.");
      return;
    }
    if (mode === "signup") {
      // Sign up
      const { error, data } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErr(error.message);
        onResult?.(error.message);
      } else {
        if (data.user) {
          await supabase.from("user_roles").upsert(
            [{ user_id: data.user.id, role: "member" }],
            { onConflict: "user_id,role" }
          );
        }
        onResult?.(null);
        navigate("/");
      }
    } else {
      // Sign in
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErr(error.message);
        onResult?.(error.message);
      } else {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          await supabase.from("user_roles").upsert(
            [{ user_id: userData.user.id, role: "member" }],
            { onConflict: "user_id,role" }
          );
        }
        onResult?.(null);
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Member {mode === "signup" ? "Sign Up" : "Sign In"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
          {err && <p className="text-destructive text-sm">{err}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : mode === "signup" ? "Sign Up" : "Sign In"}
          </Button>
        </form>
        <div className="text-center mt-2">
          <Button
            variant="link"
            type="button"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          >
            {mode === "signup" ? "Already a member? Sign in" : "New here? Sign up"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuthPage() {
  const { role, loading } = useAuthUser();
  const [authMode, setAuthMode] = useState<"admin" | "member">("member");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  if (loading) return null; // Or show loading spinner

  if (role === "admin" || role === "member") return <Navigate to="/" replace />;

  return (
    <>
      <Helmet>
        <title>Builders Arc | Sign in</title>
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col justify-center items-center">
        <BuildersArcLogo />

        <div className="mb-4">
          <div className="flex justify-center space-x-2">
            <Button
              variant={authMode === "member" ? "default" : "outline"}
              onClick={() => { setAuthMode("member"); setErrMsg(null); }}
            >
              Member
            </Button>
            <Button
              variant={authMode === "admin" ? "default" : "outline"}
              onClick={() => { setAuthMode("admin"); setErrMsg(null); }}
            >
              Admin
            </Button>
          </div>
        </div>
        {errMsg && (
          <div className="mb-4 text-destructive font-medium">{errMsg}</div>
        )}
        <div className="w-full flex justify-center">
          {authMode === "member" ? (
            <MemberAuth onResult={setErrMsg} />
          ) : (
            <AdminSignIn onResult={setErrMsg} />
          )}
        </div>
      </div>
    </>
  );
}
