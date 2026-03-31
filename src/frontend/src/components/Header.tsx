import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { History, LayoutDashboard, LogOut, Navigation } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface Props {
  activeTab: "dashboard" | "history";
  onTabChange: (tab: "dashboard" | "history") => void;
  userName: string;
}

export default function Header({ activeTab, onTabChange, userName }: Props) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Navigation className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">MileTrack</span>
        </div>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <button
            type="button"
            onClick={() => onTabChange("dashboard")}
            data-ocid="nav.dashboard.link"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "dashboard"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onTabChange("history")}
            data-ocid="nav.history.link"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "history"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <History className="w-4 h-4" />
            Safar Ka Itihas
          </button>
        </nav>

        {/* User actions */}
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:block text-sm font-medium text-foreground">
            {userName}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
            data-ocid="nav.logout.button"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden flex border-t border-border">
        <button
          type="button"
          onClick={() => onTabChange("dashboard")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium ${
            activeTab === "dashboard"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
          data-ocid="mobile_nav.dashboard.link"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>
        <button
          type="button"
          onClick={() => onTabChange("history")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium ${
            activeTab === "history"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
          data-ocid="mobile_nav.history.link"
        >
          <History className="w-4 h-4" />
          Itihas
        </button>
      </div>
    </header>
  );
}
