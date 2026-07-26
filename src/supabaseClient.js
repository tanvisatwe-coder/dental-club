import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kecudbqndjngtmemsoek.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlY3VkYnFuZGpuZ3RtZW1zb2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNTMzNTUsImV4cCI6MjEwMDYyOTM1NX0.LSfTkAkOY5EEzCcgqqTKX3xxwQ2kZmh3XWi_sBjqhIk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);