"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { logAdminActivity } from "@/lib/activity-logger";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createAdminSchema = z.object({
  name: z.string().trim().min(2, "نام کاربر الزامی است"),
  email: z.string().trim().email("ایمیل معتبر نیست"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

export async function createSubAdmin(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("فقط مدیر ارشد مجاز به تعریف مدیر جدید است.");
  }

  const parsed = createAdminSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const existingUser = await db.adminUser.findUnique({
    where: { email: parsed.email },
  });

  if (existingUser) {
    throw new Error("کاربری با این ایمیل قبلاً ثبت شده است.");
  }

  const passwordHash = await bcrypt.hash(parsed.password, 10);

  const newAdmin = await db.adminUser.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: "SUB_ADMIN",
      isActive: true,
    },
  });

  await logAdminActivity({
    adminUserId: session.user.id,
    action: "CREATE_SUB_ADMIN",
    targetType: "ADMIN_USER",
    targetId: newAdmin.id,
    changes: { name: newAdmin.name, email: newAdmin.email, role: newAdmin.role },
  });

  revalidatePath("/admin/team");
}

export async function toggleAdminStatus(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("فقط مدیر ارشد مجاز به تغییر وضعیت حساب است.");
  }

  const targetId = String(formData.get("id"));

  if (targetId === session.user.id) {
    throw new Error("شما نمی‌توانید حساب کاربری خود را غیرفعال کنید.");
  }

  const targetUser = await db.adminUser.findUniqueOrThrow({ where: { id: targetId } });

  if (targetUser.role === "SUPER_ADMIN") {
    throw new Error("حساب مدیر ارشد قابل غیرفعال‌سازی نیست.");
  }

  const newStatus = !targetUser.isActive;

  await db.adminUser.update({
    where: { id: targetId },
    data: { isActive: newStatus },
  });

  await logAdminActivity({
    adminUserId: session.user.id,
    action: "TOGGLE_ADMIN_STATUS",
    targetType: "ADMIN_USER",
    targetId,
    changes: { email: targetUser.email, oldStatus: targetUser.isActive, newStatus },
  });

  revalidatePath("/admin/team");
}

export async function deleteSubAdmin(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("فقط مدیر ارشد مجاز به حذف حساب مدیران است.");
  }

  const targetId = String(formData.get("id"));

  if (targetId === session.user.id) {
    throw new Error("شما نمی‌توانید حساب کاربری خود را حذف کنید.");
  }

  const targetUser = await db.adminUser.findUniqueOrThrow({ where: { id: targetId } });

  if (targetUser.role === "SUPER_ADMIN") {
    throw new Error("حساب مدیر ارشد قابل حذف نیست.");
  }

  await db.adminUser.delete({ where: { id: targetId } });

  await logAdminActivity({
    adminUserId: session.user.id,
    action: "DELETE_SUB_ADMIN",
    targetType: "ADMIN_USER",
    targetId,
    changes: { email: targetUser.email, name: targetUser.name },
  });

  revalidatePath("/admin/team");
}
