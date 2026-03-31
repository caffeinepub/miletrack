import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-card">
            <Navigation className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">MileTrack</span>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Namaste! 🙏
          </h1>
          <p className="text-muted-foreground mb-2">
            Office trips track karna shuru karein
          </p>
          <p className="text-sm text-muted-foreground mb-7">
            Apne safar ko track karein — kab gaye, kahan gaye, kitne KM hue.
          </p>

          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90"
            data-ocid="login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Login ho rahe hain...
              </>
            ) : (
              "Login Karein"
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Internet Identity se secure login
        </p>
      </div>
    </div>
  );
}
