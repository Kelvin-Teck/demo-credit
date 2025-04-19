import  db from "./connection";

export const testConnection = async () => {
  try {
    await db.raw("SELECT 1");
    console.log("✅ Database connection established successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}
