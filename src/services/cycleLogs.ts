import { supabase } from "../lib/supabase";
import { CycleSummary } from "../types";

function getCycleRange(): { from: string; to: string } {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const cycleStart = Math.floor(month / 3) * 3;
  const from = `${year}-${String(cycleStart + 1).padStart(2, "0")}-01`;
  const lastMonth = new Date(year, cycleStart + 3, 0);
  const to = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}-${String(lastMonth.getDate()).padStart(2, "0")}`;
  return { from, to };
}

export async function getCycleSummaries(
  doctorIds: string[],
): Promise<Record<string, CycleSummary>> {
  if (doctorIds.length === 0) return {};
  const { from, to } = getCycleRange();

  const { data, error } = await supabase
    .from("visit_logs")
    .select("doctor_id, status")
    .in("doctor_id", doctorIds)
    .gte("visit_date", from)
    .lte("visit_date", to);

  if (error) throw new Error(error.message);

  const result: Record<string, CycleSummary> = {};

  doctorIds.forEach((id) => {
    result[id] = { doctorId: id, target: 1, visited: 0, absent: 0, failed: 0 };
  });

  (data ?? []).forEach((row) => {
    const s = result[row.doctor_id];
    if (!s) return;
    if (row.status === "visited") s.visited++;
    else if (row.status === "absent") s.absent++;
    else if (row.status === "not_visited") s.failed++;
  });

  return result;
}

export function getCycleLabel(): string {
  const now = new Date();
  const month = now.getMonth();
  const cycleStart = Math.floor(month / 3) * 3;
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return `${months[cycleStart]} – ${months[cycleStart + 2]} ${now.getFullYear()}`;
}
