
import { FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthInput } from "@/components/auth/AuthInput";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Mock authentication state (replace with your auth logic)
  const isAuthenticated = false;
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Basic validation
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    
    // Mock password reset process
    setIsLoading(true);
    
    try {
      // Here you would call your password reset service
      // await supabase.auth.resetPasswordForEmail(email)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On success
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({ email: "Failed to send reset email. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | Community Nexus</title>
      </Helmet>
      
      {isSubmitted ? (
        <AuthLayout
          title="Check your email"
          description="We've sent you a password reset link. Please check your email."
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle className="h-12 w-12 text-primary" />
            <p className="text-center text-sm text-muted-foreground">
              If you don't see it in your inbox, please check your spam folder.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/login">Back to Login</Link>
            </Button>
          </div>
        </AuthLayout>
      ) : (
        <AuthLayout
          title="Forgot Password"
          description="Enter your email and we'll send you a password reset link"
          footer={
            <p>
              Remember your password?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              label="Email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </AuthLayout>
      )}
    </>
  );
}
