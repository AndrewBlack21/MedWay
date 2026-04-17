import { supabase } from "../lib/supabase";
import { getCycleRange } from "../services/cycleLogs";

export interface HomeSummary {
  totalDoctors: number;
  completedCycle: number;
  pendingCycle: number;
  todayVisits: number;
}

export async function getHomeSummary(): Promise<HomeSummary> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Não autenticado.");

  const userId = userData.user.id;

  const { count: totalDoctors } = await supabase
    .from("doctors")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { data: doctors } = await supabase
    .from("doctors")
    .select("id, cycle_target")
    .eq("user_id", userId);

  const { from, to } = getCycleRange();

  const { data: logs } = await supabase
    .from("visit_logs")
    .select("doctor_id, status")
    .eq("user_id", userId)
    .gte("visit_date", from)
    .lte("visit_date", to);

  const visitMap: Record<string, number> = {};
  (logs ?? []).forEach((l) => {
    if (l.status === "visited") {
      visitMap[l.doctor_id] = (visitMap[l.doctor_id] ?? 0) + 1;
    }
  });

  let completedCycle = 0;
  let pendingCycle = 0;
  (doctors ?? []).forEach((d) => {
    const done = visitMap[d.id] ?? 0;
    if (done >= (d.cycle_target ?? 1)) completedCycle++;
    else pendingCycle++;
  });

  const today = new Date().toISOString().split("T")[0];
  const { count: todayVisits } = await supabase
    .from("visit_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("visit_date", today)
    .eq("status", "visited");

  return {
    totalDoctors: totalDoctors ?? 0,
    completedCycle,
    pendingCycle,
    todayVisits: todayVisits ?? 0,
  };
}
