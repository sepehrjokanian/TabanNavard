import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ActivityLogsTable } from "@/components/admin/activity-logs-table";

export const dynamic = "force-dynamic";

export default async function ActivityLogsPage() {
  const session = await auth();

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/admin/products");
  }

  const logs = await db.adminActivityLog.findMany({
    include: {
      adminUser: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <ActivityLogsTable
      logs={logs.map((log) => ({
        id: log.id,
        action: log.action,
        targetType: log.targetType,
        targetId: log.targetId,
        changes: log.changes,
        createdAt: log.createdAt,
        adminUser: log.adminUser,
      }))}
    />
  );
}
