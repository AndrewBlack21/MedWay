import { supabase } from "../lib/supabase";
import { Doctor, DoctorFormData } from "../types";
import { geocodeAddress } from "./geocoding";

interface DoctorExtra {
  visit_days?: string[];
  visit_period?: string;
  cycle_target?: number;
}
export async function getDoctors(): Promise<Doctor[]> {
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getDoctorById(id: string): Promise<Doctor> {
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createDoctor(
  form: DoctorFormData,
  extra?: DoctorExtra,
): Promise<Doctor> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Usuario não autenticado.");

  const coords = await geocodeAddress(form.address);

  const { data, error } = await supabase
    .from("doctors")
    .insert({
      user_id: userData.user.id,
      name: form.name.trim(),
      specialty: form.specialty.trim(),
      address: form.address.trim(),
      lat: coords.lat,
      lng: coords.lng,
      hours: form.hours.trim() || null,
      visit_days: extra?.visit_days ?? [],
      visit_period: extra?.visit_period ?? "both",
      cycle_target: extra?.cycle_target ?? 1,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// previousAddress: endereço ja salvo no banco - se igual ao novo evita
// chama o geocoding desnecessariamente

export async function updateDoctor(
  id: string,
  form: DoctorFormData,
  previousAddress?: string,
  extra?: DoctorExtra,
): Promise<Doctor> {
  const addressChanged = form.address.trim() !== previousAddress?.trim();
  const coords = addressChanged ? await geocodeAddress(form.address) : null;

  const updatePayload: Record<string, unknown> = {
    name: form.name.trim(),
    specialty: form.specialty.trim(),
    address: form.address.trim(),
    hours: form.hours.trim() || null,
    ...(extra?.visit_days !== undefined && { visit_days: extra.visit_days }),
    ...(extra?.visit_period !== undefined && {
      visit_period: extra.visit_period,
    }),
    ...(extra?.cycle_target !== undefined && {
      cycle_target: extra.cycle_target,
    }),
  };

  if (coords) {
    updatePayload.lat = coords.lat;
    updatePayload.lng = coords.lng;
  }

  const { data, error } = await supabase
    .from("doctors")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteDoctor(id: string): Promise<void> {
  const { error } = await supabase.from("doctors").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
