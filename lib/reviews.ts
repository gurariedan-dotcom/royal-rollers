import { getDb, type ReviewRow } from "@/lib/db";

// Newest first. Never throws: a database hiccup should show the empty
// "reviews on the way" state, not break the homepage.
export async function getReviews(limit?: number): Promise<ReviewRow[]> {
  try {
    let query = getDb()
      .from("reviews")
      .select("id, customer_name, route, rating, body, created_at")
      .order("created_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) {
      console.error("Failed to load reviews:", error);
      return [];
    }
    return (data ?? []) as ReviewRow[];
  } catch (err) {
    console.error("Failed to load reviews:", err);
    return [];
  }
}

export async function countReviews(): Promise<number> {
  try {
    const { count } = await getDb().from("reviews").select("id", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}
