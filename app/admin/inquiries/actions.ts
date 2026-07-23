"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { logAdminActivity } from "@/lib/activity-logger";
import { InquiryStatus } from "@prisma/client";

export async function updateInquiry(fd: FormData) {
  const session = await auth();
  if (!session?.user || session.user.isActive === false) {
    throw new Error("دسترسی غیرمجاز");
  }

  const id = String(fd.get("id"));
  const newStatus = String(fd.get("status")) as InquiryStatus;
  const newNotes = String(fd.get("adminNotes") || "");

  const existing = await db.inquiry.findUniqueOrThrow({ where: { id } });

  await db.inquiry.update({
    where: { id },
    data: {
      status: newStatus,
      adminNotes: newNotes,
    },
  });

  await logAdminActivity({
    adminUserId: session.user.id,
    action: "UPDATE_INQUIRY",
    targetType: "INQUIRY",
    targetId: id,
    changes: {
      clientName: existing.name,
      oldStatus: existing.status,
      newStatus,
      notesChanged: existing.adminNotes !== newNotes,
    },
  });

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${id}`);
}