import { DollarSign, LogIn } from "lucide-react";
import { Button } from "../components/ui/button";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FinanceOS</h1>
          <p className="text-slate-400">
            Your personal finance management platform
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
          <h2 className="text-xl font-semibold text-white mb-2">Sign In</h2>
          <p className="text-slate-400 text-sm mb-6">
            Connect with Internet Identity to securely access your financial
            data.
          </p>

          <Button
            data-ocid="login.internet_identity.button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {isLoggingIn ? "Connecting..." : "Login"}
          </Button>

          <p className="text-xs text-slate-500 text-center mt-4">
            Internet Identity provides secure, anonymous authentication on the
            Internet Computer.
          </p>
        </div>
      </div>
    </div>
  );
}
