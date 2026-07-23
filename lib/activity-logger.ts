import { db } from "@/lib/db";

export async function logAdminActivity({
  adminUserId,
  action,
  targetType,
  targetId,
  changes,
}: {
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  changes: Record<string, any>;
}) {
  try {
    await db.adminActivityLog.create({
      data: {
        adminUserId,
        action,
        targetType,
        targetId,
        changes,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
