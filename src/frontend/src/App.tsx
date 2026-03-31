import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import ProfileSetupModal from "./components/ProfileSetupModal";
import TripHistory from "./components/TripHistory";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const [activeTab, setActiveTab] = useState<"dashboard" | "history">(
    "dashboard",
  );

  // Not logged in
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toaster position="top-right" />
      </>
    );
  }

  // Loading profile
  if (profileLoading || !profileFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-3 w-64">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  // Need profile setup
  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;

  const userName = userProfile?.name ?? "User";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster position="top-right" richColors />
      <ProfileSetupModal open={showProfileSetup} />
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userName={userName}
      />
      <main className="flex-1">
        {activeTab === "dashboard" ? (
          <Dashboard userName={userName} />
        ) : (
          <TripHistory />
        )}
      </main>
      <Footer />
    </div>
  );
}
