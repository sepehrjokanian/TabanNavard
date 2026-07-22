import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const metadata = { title: "ورود مدیریت | آسانسور تابان نورد" };

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 p-4 text-ink-900">
      <form
        action={async (fd) => {
          "use server";
          try {
            await signIn("credentials", {
              email: fd.get("email"),
              password: fd.get("password"),
              redirectTo: "/admin/dashboard",
            });
          } catch (error) {
            if (error instanceof AuthError) {
              const { redirect } = await import("next/navigation");
              redirect("/admin/login?error=CredentialsSignin");
            }
            throw error;
          }
        }}
        className="w-full max-w-md rounded-card border border-white/10 bg-white p-8 shadow-2xl"
      >
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-navy-900">ورود به پنل مدیریت</h1>
          <p className="mt-2 text-sm text-ink-900/60">آسانسور تابان نورد</p>
        </div>

        {searchParams.error && (
          <div className="mt-5 rounded-button border border-red-200 bg-red-50 p-3 text-center text-sm font-bold text-red-600">
            ایمیل یا رمز عبور وارد شده نادرست است.
          </div>
        )}

        <label className="mt-6 block text-sm font-bold">
          ایمیل مدیریت
          <input
            name="email"
            type="email"
            required
            defaultValue="admin@tabanelevator.ir"
            className="mt-2 w-full rounded-button border border-navy-900/20 p-3 font-normal focus-visible:ring-2 focus-visible:ring-cyan-500"
          />
        </label>

        <label className="mt-4 block text-sm font-bold">
          رمز عبور
          <input
            name="password"
            type="password"
            required
            defaultValue="adminpassword123"
            className="mt-2 w-full rounded-button border border-navy-900/20 p-3 font-normal focus-visible:ring-2 focus-visible:ring-cyan-500"
          />
        </label>

        <button className="mt-6 w-full rounded-button bg-gradient-to-l from-cyan-500 to-blue-600 p-3.5 font-bold text-white transition hover:shadow-lg focus-visible:ring-2 focus-visible:ring-cyan-500">
          ورود به سیستم
        </button>

        <p className="mt-6 text-center text-xs text-ink-900/50">
          اطلاعات ورود پیش‌فرض (حالت آزمایشی):<br />
          <code className="font-mono" dir="ltr">admin@tabanelevator.ir</code> / <code className="font-mono" dir="ltr">adminpassword123</code>
        </p>
      </form>
    </main>
  );
}