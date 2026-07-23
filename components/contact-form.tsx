"use client";

import { useRef, useEffect } from "react";
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
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <input type="hidden" name="source" value={source} />
      {productId && <input type="hidden" name="productId" value={productId} />}

      <label className="block text-sm font-bold text-white">
        نام و نام خانوادگی
        <input
          required
          name="name"
          className="mt-2 w-full rounded-button border border-white/20 bg-white p-3 font-normal text-navy-900 shadow-sm placeholder:text-navy-900/50 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
      </label>

      <label className="block text-sm font-bold text-white">
        شماره تماس
        <input
          required
          name="phone"
          inputMode="tel"
          className="mt-2 w-full rounded-button border border-white/20 bg-white p-3 font-normal text-navy-900 shadow-sm placeholder:text-navy-900/50 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
      </label>

      <label className="block text-sm font-bold text-white">
        ایمیل
        <input
          name="email"
          type="email"
          className="mt-2 w-full rounded-button border border-white/20 bg-white p-3 font-normal text-navy-900 shadow-sm placeholder:text-navy-900/50 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
      </label>

      <label className="block text-sm font-bold text-white">
        پیام یا جزئیات درخواست
        <textarea
          required
          name="message"
          rows={4}
          className="mt-2 w-full rounded-button border border-white/20 bg-white p-3 font-normal text-navy-900 shadow-sm placeholder:text-navy-900/50 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
      </label>

      <Button type="submit" className="w-full border-0 bg-white font-bold text-navy-900 shadow-md hover:bg-cyan-50">
        ارسال درخواست
      </Button>

      {state?.message && (
        <p aria-live="polite" className={state.ok ? "font-bold text-cyan-200" : "font-bold text-amber-300"}>
          {state.message}
        </p>
      )}
    </form>
  );
}