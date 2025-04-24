
import { Check, AlertTriangle, XCircle } from "lucide-react";

interface AuthStatusProps {
  type: "success" | "pending" | "rejected";
  message?: string;
}

export function AuthStatus({ type, message }: AuthStatusProps) {
  const defaultMessages = {
    success: "Your account has been successfully created! Please wait for admin approval.",
    pending: "Your account is pending approval by an administrator.",
    rejected: "Your signup request has been rejected."
  };

  const finalMessage = message || defaultMessages[type];
  
  const icons = {
    success: <Check className="h-8 w-8 text-green-600" />,
    pending: <AlertTriangle className="h-8 w-8 text-amber-500" />,
    rejected: <XCircle className="h-8 w-8 text-red-600" />
  };
  
  const bgColors = {
    success: "bg-green-100",
    pending: "bg-amber-100",
    rejected: "bg-red-100"
  };
  
  return (
    <div className="space-y-6 text-center">
      <div className={`mx-auto ${bgColors[type]} rounded-full p-3 w-16 h-16 flex items-center justify-center`}>
        {icons[type]}
      </div>
      <h2 className="text-2xl font-bold">{type === "success" ? "Signup Successful" : type === "pending" ? "Account Pending" : "Account Rejected"}</h2>
      <p className="text-muted-foreground">
        {finalMessage}
      </p>
      {type === "pending" && (
        <p className="text-sm text-muted-foreground">
          You will be able to access the platform once your request is approved.
        </p>
      )}
      {type === "rejected" && (
        <p className="text-sm text-muted-foreground">
          If you believe this is an error, please contact the administrator.
        </p>
      )}
    </div>
  );
}
