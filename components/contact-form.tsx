"use client";

import { useFormState } from "react-dom";
import { createInquiry } from "@/app/actions";
import { Button } from "./ui";

export function ContactForm({
  productId,
  source = "CONTACT_FORM",
}: {
  productId?: string;
  source?: "PRODUCT" | "CONTACT_FORM";
}) {
  const [state, formAction] = useFormState(createInquiry, null);

  return (
    <form action={formAction} className="grid gap-4">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <input type="hidden" name="source" value={source} />
      {productId && <input type="hidden" name="productId" value={productId} />}

      <label className="block text-sm font-bold">
        نام و نام خانوادگی
        <input
          required
          name="name"
          className="mt-2 w-full rounded-button border p-3 font-normal focus:ring-2 focus:ring-cyan-500"
        />
      </label>

      <label className="block text-sm font-bold">
        شماره تماس
        <input
          required
          name="phone"
          inputMode="tel"
          className="mt-2 w-full rounded-button border p-3 font-normal focus:ring-2 focus:ring-cyan-500"
        />
      </label>

      <label className="block text-sm font-bold">
        ایمیل
        <input
          name="email"
          type="email"
          className="mt-2 w-full rounded-button border p-3 font-normal focus:ring-2 focus:ring-cyan-500"
        />
      </label>

      <label className="block text-sm font-bold">
        پیام یا جزئیات درخواست
        <textarea
          required
          name="message"
          rows={4}
          className="mt-2 w-full rounded-button border p-3 font-normal focus:ring-2 focus:ring-cyan-500"
        />
      </label>

      <Button type="submit">ارسال درخواست</Button>

      {state?.message && (
        <p aria-live="polite" className={state.ok ? "text-blue-600 font-bold" : "text-red-600 font-bold"}>
          {state.message}
        </p>
      )}
    </form>
  );
}