import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Plus, Route, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Trip } from "../backend";
import { useGetTripStats, useGetTrips } from "../hooks/useQueries";
import TripModal from "./TripModal";

interface Props {
  userName: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("hi-IN", { day: "numeric", month: "short" });
}

export default function Dashboard({ userName }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: trips = [], isLoading: tripsLoading } = useGetTrips();
  const { data: stats, isLoading: statsLoading } = useGetTripStats();

  const todayStr = new Date().toISOString().split("T")[0];

  const todayKm = useMemo(
    () =>
      trips
        .filter((t) => t.date === todayStr)
        .reduce((sum, t) => sum + t.kilometers, 0),
    [trips, todayStr],
  );

  const thisMonthTrips = useMemo(() => {
    const now = new Date();
    const month = now.toISOString().slice(0, 7);
    return trips.filter((t) => t.date.startsWith(month));
  }, [trips]);

  const last7DaysData = useMemo(() => {
    const days: { label: string; km: number; date: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-IN", { weekday: "short" });
      const km = trips
        .filter((t) => t.date === dateStr)
        .reduce((sum, t) => sum + t.kilometers, 0);
      days.push({ label, km, date: dateStr });
    }
    return days;
  }, [trips]);

  const recentTrips: Trip[] = useMemo(
    () => [...trips].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [trips],
  );

  const isLoading = tripsLoading || statsLoading;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Namaste, {userName}! 🙏
          </h1>
          <p className="text-muted-foreground mt-1">
            Office ke safar track karo effortlessly
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Is mahine:{" "}
            <span className="font-semibold text-foreground">
              {thisMonthTrips.length} trips
            </span>{" "}
            ·{" "}
            <span className="font-semibold text-foreground">
              {thisMonthTrips.reduce((s, t) => s + t.kilometers, 0).toFixed(1)}{" "}
              KM
            </span>
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 font-semibold px-5"
          data-ocid="dashboard.add_trip.primary_button"
        >
          <Plus className="w-4 h-4" />+ Trip Log Karo
        </Button>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Aaj Ka KM",
            value: isLoading ? null : `${todayKm.toFixed(1)} km`,
            icon: Route,
            color: "text-primary",
            bg: "bg-primary/10",
            ocid: "dashboard.today_km.card",
          },
          {
            label: "Is Mahine Ki Trips",
            value: isLoading ? null : `${thisMonthTrips.length}`,
            icon: Calendar,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            ocid: "dashboard.month_trips.card",
          },
          {
            label: "Total KM (Sab)",
            value: isLoading
              ? null
              : `${(stats?.totalKilometers ?? 0).toFixed(1)} km`,
            icon: TrendingUp,
            color: "text-violet-600",
            bg: "bg-violet-50",
            ocid: "dashboard.total_km.card",
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            data-ocid={item.ocid}
          >
            <Card className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-7 w-24 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold text-foreground mt-0.5">
                        {item.value}
                      </p>
                    )}
                  </div>
                  <div
                    className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center`}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="lg:col-span-3"
        >
          <Card className="shadow-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Pichle 7 Din Ka KM
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton
                  className="h-48 w-full"
                  data-ocid="dashboard.chart.loading_state"
                />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={last7DaysData}
                    margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="oklch(0.9 0.008 264)"
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <RechartsTooltip
                      formatter={(v: number) => [`${v.toFixed(1)} km`, "KM"]}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid oklch(0.9 0.008 264)",
                      }}
                    />
                    <Bar
                      dataKey="km"
                      fill="oklch(0.546 0.245 264)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent trips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Recent Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div
                  className="space-y-3"
                  data-ocid="dashboard.recent_trips.loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentTrips.length === 0 ? (
                <div
                  className="text-center py-8"
                  data-ocid="dashboard.recent_trips.empty_state"
                >
                  <MapPin className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Abhi koi trip nahi
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    "+ Trip Log Karo" se shuru karein
                  </p>
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {recentTrips.map((trip, idx) => (
                    <li
                      key={trip.id.toString()}
                      className="flex items-center justify-between gap-2 py-1.5"
                      data-ocid={`dashboard.recent_trips.item.${idx + 1}`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {trip.destination}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {trip.purpose}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-primary">
                          {trip.kilometers} km
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(trip.date)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <TripModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
