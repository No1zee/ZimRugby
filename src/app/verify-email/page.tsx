"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from "lucide-react"
import { resendVerification } from "../login/actions"
import SlantedButton from "@/components/ui/SlantedButton"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [cooldown, setCooldown] = useState(0)
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleResend = async () => {
    if (!email) {
      setStatus({ type: "error", message: "Email address not found in parameters." })
      return
    }
    if (cooldown > 0) return

    setIsPending(true)
    setStatus(null)

    try {
      const res = await resendVerification(email)
      if (res.success) {
        setStatus({ type: "success", message: "Verification link sent! Please check your inbox." })
        setCooldown(60) // 60s cooldown limit
      } else {
        setStatus({ type: "error", message: res.error || "Failed to resend. Please try again." })
      }
    } catch {
      setStatus({ type: "error", message: "An unexpected error occurred. Please try again." })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF0] flex flex-col selection:bg-zru-green selection:text-white">
      {/* Top back nav */}
      <div className="flex-none px-6 pt-6 max-w-[1440px] mx-auto w-full">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-rich-black/40 hover:text-rich-black transition-colors text-[10px] font-heading font-black uppercase tracking-[0.2em] group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Sign In
        </Link>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl border border-black/5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 sm:p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zru-green/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-zru-green" />
          </div>

          <h1 className="text-2xl font-heading font-black uppercase tracking-tight text-rich-black mb-2">
            Check your email
          </h1>
          
          <p className="text-rich-black/50 text-sm font-body mb-6 max-w-sm mx-auto leading-relaxed">
            We sent a verification link to <strong className="text-rich-black">{email || "your inbox"}</strong>. Please follow the instructions in the email to activate your account.
          </p>

          {/* Status message */}
          {status && (
            <div
              className={`flex items-center gap-2 p-3 mb-4 rounded-lg text-xs font-body text-left ${
                status.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-600"
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <SlantedButton
              type="button"
              variant="primary"
              className="w-full justify-center"
              onClick={handleResend}
              disabled={isPending || cooldown > 0}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : isPending ? "Sending..." : "Resend Link"}
            </SlantedButton>
            
            <Link href="/login" className="text-xs font-heading font-bold text-zru-green hover:underline uppercase tracking-wider">
              Change email or retry signup
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none text-center px-6 py-4 border-t border-black/5">
        <p className="text-[10px] text-rich-black/30 font-body">
          &copy; {new Date().getFullYear()} Zimbabwe Rugby Union. All rights reserved.
        </p>
      </div>
    </div>
  )
}
