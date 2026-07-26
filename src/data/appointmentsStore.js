import { supabase } from "../supabaseClient";

const TABLE = "appointments";

export const loadBookings = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load bookings:", error.message);
    return [];
  }
  return data;
};

export const saveBooking = async (booking) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ ...booking, status: "Requested" }])
    .select();

  if (error) {
    console.error("Failed to save booking:", error.message);
    throw error;
  }
  return data?.[0];
};

export const updateBookingStatus = async (id, status) => {
  const { error } = await supabase.from(TABLE).update({ status }).eq("id", id);
  if (error) console.error("Failed to update booking:", error.message);
};

export const deleteBooking = async (id) => {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) console.error("Failed to delete booking:", error.message);
};

/**
 * Subscribes to live changes on the appointments table — fires `onChange`
 * whenever ANY device inserts, updates, or deletes a booking. This is what
 * makes a request made on a patient's phone show up on the dentist's laptop
 * without anyone refreshing the page.
 *
 * Returns an unsubscribe function — call it in a useEffect cleanup.
 */
export const subscribeToBookings = (onChange) => {
  const channel = supabase
    .channel("appointments-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: TABLE }, () => {
      onChange();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};