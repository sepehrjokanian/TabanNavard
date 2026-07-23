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

export async function createSubAdmin(prevState: any, formData: FormData): Promise<{ ok: boolean; message: string }> {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
      return { ok: false, message: "فقط مدیر ارشد مجاز به تعریف مدیر جدید است." };
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
      return { ok: false, message: `کاربری با ایمیل ${parsed.email} قبلاً ثبت شده است.` };
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

    return { ok: true, message: `حساب پشتیبان جدید برای ${newAdmin.name} با موفقیت ایجاد شد.` };
  } catch (error: any) {
    return { ok: false, message: error?.message || "خطا در ایجاد حساب پشتیبان." };
  }
}

export async function toggleAdminStatus(prevState: any, formData: FormData): Promise<{ ok: boolean; message: string }> {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
      return { ok: false, message: "فقط مدیر ارشد مجاز به تغییر وضعیت حساب است." };
    }

    const targetId = String(formData.get("id"));

    if (targetId === session.user.id) {
      return { ok: false, message: "شما نمی‌توانید حساب کاربری خود را غیرفعال کنید." };
    }

    const targetUser = await db.adminUser.findUniqueOrThrow({ where: { id: targetId } });

    if (targetUser.role === "SUPER_ADMIN") {
      return { ok: false, message: "حساب مدیر ارشد قابل غیرفعال‌سازی نیست." };
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

    const statusText = newStatus ? "فعال" : "غیرفعال";
    return { ok: true, message: `حساب کاربری ${targetUser.name} با موفقیت ${statusText} شد.` };
  } catch (error: any) {
    return { ok: false, message: error?.message || "خطا در تغییر وضعیت حساب." };
  }
}

export async function deleteSubAdmin(prevState: any, formData: FormData): Promise<{ ok: boolean; message: string }> {
  try {
    const session = await auth();
    if (session?.user?.role !== "SUPER_ADMIN") {
      return { ok: false, message: "فقط مدیر ارشد مجاز به حذف حساب مدیران است." };
    }

    const targetId = String(formData.get("id"));

    if (targetId === session.user.id) {
      return { ok: false, message: "شما نمی‌توانید حساب کاربری خود را حذف کنید." };
    }

    const targetUser = await db.adminUser.findUniqueOrThrow({ where: { id: targetId } });

    if (targetUser.role === "SUPER_ADMIN") {
      return { ok: false, message: "حساب مدیر ارشد قابل حذف نیست." };
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

    return { ok: true, message: `حساب کاربری ${targetUser.name} با موفقیت حذف گردید.` };
  } catch (error: any) {
    return { ok: false, message: error?.message || "خطا در حذف حساب کاربری." };
  }
}
