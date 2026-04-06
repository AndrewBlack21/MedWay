import { supabase } from "../lib/supabase";
import { Doctor, DoctorFormData } from "../types";
import { geocodeAddress } from "./geocoding";

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

export async function createDoctor(form: DoctorFormData): Promise<Doctor> {
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
): Promise<Doctor> {
  const addressChanged = form.address.trim() !== previousAddress?.trim();
  const coords = addressChanged ? await geocodeAddress(form.address) : null;

  const updatePayload: Record<string, unknown> = {
    name: form.name.trim(),
    specialty: form.specialty.trim(),
    address: form.address.trim(),
    hours: form.hours.trim() || null,
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
