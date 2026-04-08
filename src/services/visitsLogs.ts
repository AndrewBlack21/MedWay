import { supabase } from "../lib/supabase";
import { VisitLog, VisitStatus } from "../types";

export async function getLogsByDate(date: string): Promise<VisitLog[]> {
  const { data, error } = await supabase
    .from("visit_logs")
    .select("*")
    .eq("visit_date", date)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLogsByMoth(
  year: number,
  month: number,
): Promise<VisitLog[]> {
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

  const { data, error } = await supabase
    .from("visit_logs")
    .select("*")
    .gte("visit_date", from)
    .lte("visit_date", to);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function upsertLog(
  doctorId: string,
  date: string,
  status: VisitStatus,
  comment?: string,
): Promise<VisitLog> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Não autenticado.");

  const { data, error } = await supabase
    .from("visit_logs")
    .upsert(
      {
        user_id: userData.user.id,
        doctor_id: doctorId,
        visit_date: date,
        status,
        comment: comment ?? null,
      },
      { onConflict: "user_id,doctor_id,visit_date" },
    )
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteLog(id: string): Promise<void> {
  const { error } = await supabase.from("visit_logs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getMarkedDates(
  year: number,
  month: number,
): Promise<Record<string, { visited: number; not_visited: number }>> {
  const logs = await getLogsByMoth(year, month);
  const result: Record<string, { visited: number; not_visited: number }> = {};

  logs.forEach((log) => {
    if (!result[log.visit_date]) {
      result[log.visit_date] = { visited: 0, not_visited: 0 };
    }
    if (log.status === "visited") result[log.visit_date].visited++;
    if (log.status === "not_visited") result[log.visit_date].not_visited++;
  });

  return result;
}
