import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Helmet } from "react-helmet";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AuthStatus } from "@/components/auth/AuthStatus";
import { useToast } from "@/hooks/use-toast";

function BuildersArcLogo() {
  return <div className="flex flex-col items-center">
      <div className="h-32 w-auto">
        <img alt="Builders Arc" src="/lovable-uploads/8cbf02e4-ab37-47e4-b23e-c855f36f8880.png" className="h-full w-auto object-contain" />
      </div>
      <div className="mt-8 text-center space-y-4">
        <h2 className="text-3xl font-semibold">Join our community of builders and innovators.</h2>
        <p className="text-xl opacity-80">Connect, collaborate, and create impactful projects.</p>
      </div>
    </div>;
}

function AdminSignIn({
  onResult
}: {
  onResult?: (err: string | null) => void;
}) {
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
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      setError(error.message);
      onResult?.(error.message);
    } else {
      const {
        data: userData
      } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase.from("user_roles").upsert([{
          user_id: userData.user.id,
          role: "admin"
        }], {
          onConflict: "user_id,role"
        });
      }
      onResult?.(null);
      navigate("/");
    }
    setLoading(false);
  };
  return <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Admin Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
          <Input value={email} disabled className="text-gray-400 bg-muted" />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>Sign In</Button>
        </form>
      </CardContent>
    </Card>;
}

const GENDER_OPTIONS = [
  {
    value: "Male",
    label: "Male"
  },
  {
    value: "Female",
    label: "Female"
  },
  {
    value: "Other",
    label: "Other"
  }
];

const DEPARTMENT_OPTIONS = ["Engineering", "Design", "Product", "Marketing", "Sales", "HR", "Other"];

function MemberAuth({
  onResult
}: {
  onResult?: (err: string | null) => void;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [accountStatus, setAccountStatus] = useState<"success" | "pending" | "rejected" | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      if (!name || !age || !gender || !department) {
        setErr("Please fill in all required fields.");
        setLoading(false);
        onResult?.("Please fill in all required fields.");
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setErr("Invalid email address.");
        setLoading(false);
        onResult?.("Invalid email address.");
        return;
      }

      if (password.length < 6) {
        setErr("Password must be at least 6 characters long.");
        setLoading(false);
        onResult?.("Password must be at least 6 characters long.");
        return;
      }

      if (password !== confirmPassword) {
        setErr("Passwords do not match.");
        setLoading(false);
        onResult?.("Passwords do not match.");
        return;
      }

      const {
        error,
        data
      } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        setErr(error.message);
        onResult?.(error.message);
        setLoading(false);
        return;
      }

      if (!data?.user?.id) {
        setErr("Sign up failed. Try again later.");
        setLoading(false);
        onResult?.("Sign up failed. Try again later.");
        return;
      }

      try {
        await supabase.from("profiles").upsert([{
          id: data.user.id,
          name,
          age: typeof age === "string" ? parseInt(age, 10) : age,
          gender,
          department,
          email,
          status: "pending"
        }], {
          onConflict: "id"
        });
        
        await supabase.auth.signOut();
        
        setSignupSuccess(true);
        setAccountStatus("success");
        onResult?.(null);
      } catch (errUpsert) {
        setErr("Error saving your profile. Please contact support.");
        onResult?.("Error saving your profile. Please contact support.");
      }
      setLoading(false);
      return;
    }

    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setErr(error.message);
      onResult?.(error.message);
      setLoading(false);
      return;
    }

    const {
      data: userData
    } = await supabase.auth.getUser();
    const id = userData.user?.id;

    if (id) {
      const {
        data: profile
      } = await supabase
        .from("profiles")
        .select("status")
        .eq("id", id)
        .maybeSingle();
      
      if (profile?.status === "pending") {
        setErr(null);
        setAccountStatus("pending");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
      
      if (profile?.status === "rejected") {
        setErr(null);
        setAccountStatus("rejected");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back to Builders Arc!",
      });
      
      onResult?.(null);
      navigate("/");
    }
    
    setLoading(false);
  };

  if (signupSuccess || accountStatus) {
    return (
      <Card className="bg-white shadow-none border-none p-8 w-full max-w-md">
        <AuthStatus 
          type={accountStatus || "success"} 
        />
        <Button 
          onClick={() => {
            setSignupSuccess(false);
            setAccountStatus(null);
            setMode("signin");
          }}
          className="mt-6 w-full"
        >
          Back to Sign In
        </Button>
      </Card>
    );
  }

  return <Card className="bg-white shadow-none border-none p-8 w-full max-w-md">
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome {mode === "signin" ? "Back" : "to Builders Arc"}</h1>
        <p className="text-muted-foreground">{mode === "signin" ? "Sign in to continue building" : "Create your account to get started"}</p>
      </div>
      
      <form onSubmit={submit} className="space-y-4">
        {mode === "signup" && <>
          <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required={mode === "signup"} />
          <Input placeholder="Age" type="number" min={1} value={age} onChange={e => setAge(e.target.value ? Number(e.target.value) : "")} required={mode === "signup"} />
          <Select value={gender} onValueChange={setGender} required={mode === "signup"}>
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} required={mode === "signup"} />
        </>}
        <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" required />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete={mode === "signup" ? "new-password" : "current-password"} />
        {mode === "signup" && <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required autoComplete="new-password" />}
        {err && <p className="text-destructive text-sm">{err}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : mode === "signup" ? "Sign Up" : "Sign In"}
        </Button>
      </form>
      <div className="text-center">
        <Button variant="link" type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="text-sm">
          {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
        </Button>
      </div>
    </div>
  </Card>;
}

export default function AuthPage() {
  const { role, loading } = useAuthUser();
  const [authMode, setAuthMode] = useState<"admin" | "member">("member");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  if (loading) return null;
  if (role === "admin" || role === "member") return <Navigate to="/" replace />;

  return <>
    <Helmet>
      <title>Builders Arc | Sign in</title>
    </Helmet>
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-8 flex-col justify-center items-center">
        <BuildersArcLogo />
      </div>
      
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center space-x-2 mb-6">
            <Button variant={authMode === "member" ? "default" : "outline"} onClick={() => {
              setAuthMode("member");
              setErrMsg(null);
            }}>
              Member
            </Button>
            <Button variant={authMode === "admin" ? "default" : "outline"} onClick={() => {
              setAuthMode("admin");
              setErrMsg(null);
            }}>
              Admin
            </Button>
          </div>
          {errMsg && <div className="text-center mb-4">
            <p className="text-destructive font-medium">{errMsg}</p>
          </div>}
          {authMode === "member" ? <MemberAuth onResult={setErrMsg} /> : <AdminSignIn onResult={setErrMsg} />}
        </div>
      </div>
    </div>
  </>;
}
