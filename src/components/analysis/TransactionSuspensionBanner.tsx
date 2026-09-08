"use client";

import { Lock, ShieldAlert, AlertTriangle, Volume2, Building2, CreditCard, ArrowRight, Ban, Zap } from "lucide-react";
import StarBorder from "@/components/ui/StarBorder";
import { DEFAULT_SUSPENDED_TXNS, playHindiFraudAlert } from "@/lib/utils";

interface TransactionSuspensionBannerProps {
  confidence?: number;
}

export default function TransactionSuspensionBanner({ confidence = 96.8 }: TransactionSuspensionBannerProps) {
  return (
    <StarBorder
      as="div"
      className="w-full"
      innerClassName="p-6 bg-[#07070a]/98 flex flex-col gap-6"
      color="#ef4444"
      speed="3.5s"
      thickness={2}
      backgroundColor="#07070a"
      borderColor="rgba(239, 68, 68, 0.4)"
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-red-500/20">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-red-600 rounded-2xl text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] shrink-0 animate-pulse">
            <Lock size={24} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-black uppercase tracking-wider">
                CORE BANKING AUTOMATIC LOCK ACTIVATED
              </span>
              <span className="text-xs font-mono text-red-300">
                CBS / NPCI Auto-Freeze Hook Executed in &lt;1.2s
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              All Banking Transactions &amp; Accounts Paused
            </h3>
            <p className="text-xs text-white/60">
              Account: <span className="text-cyan-300 font-mono">Aditya Sharma (●●●● 8291)</span> · State Secure Core Banking System
            </p>
          </div>
        </div>

        {/* Replay Hindi Audio Alert */}
        <button
          onClick={() => playHindiFraudAlert()}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer active:scale-95 shrink-0"
        >
          <Volume2 size={16} /> री-प्ले सुरक्षा घोषणा (Play Voice Alert)
        </button>
      </div>

      {/* 4 Banking Service Lock Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col justify-between">
          <span className="text-xs font-semibold text-white/80">UPI / QR Payments</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] font-mono font-bold text-red-400">🔴 PAUSED</span>
            <Ban size={14} className="text-red-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col justify-between">
          <span className="text-xs font-semibold text-white/80">NetBanking / IMPS</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] font-mono font-bold text-red-400">🔴 FROZEN</span>
            <Lock size={14} className="text-red-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col justify-between">
          <span className="text-xs font-semibold text-white/80">Debit Card / ATM</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] font-mono font-bold text-red-400">🔴 BLOCKED</span>
            <CreditCard size={14} className="text-red-400" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col justify-between">
          <span className="text-xs font-semibold text-white/80">Pending ₹2.5L Transfer</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] font-mono font-bold text-red-400">❌ ABORTED</span>
            <ShieldAlert size={14} className="text-red-400" />
          </div>
        </div>
      </div>

      {/* Paused In-Flight Transactions Table */}
      <div className="bg-[#020204] rounded-xl border border-white/5 overflow-hidden">
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
            <Zap size={14} className="text-red-400" /> In-Flight Financial Transactions Automatically Paused ({DEFAULT_SUSPENDED_TXNS.length})
          </span>
          <span className="text-[10px] font-mono text-red-400">NPCI / CBS Switch Gate #04</span>
        </div>

        <div className="divide-y divide-white/5">
          {DEFAULT_SUSPENDED_TXNS.map((txn) => (
            <div key={txn.id} className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-mono text-xs font-bold">
                  {txn.id.slice(-2)}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{txn.type}</p>
                  <p className="text-[10px] font-mono text-white/40">{txn.id} · {txn.channel} · {txn.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <span className="text-xs font-mono font-bold text-white">{txn.amount}</span>
                <span className="px-2.5 py-1 rounded-md bg-red-600 text-white font-mono text-[10px] font-black tracking-wider">
                  🛑 {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Defense Footer Alert */}
      <div className="p-3.5 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center justify-between text-xs text-red-300">
        <p className="flex items-center gap-2">
          <ShieldAlert size={16} className="text-red-400 shrink-0" />
          <span>No unauthorized funds were debited. Telemetry and acoustic forensics submitted to Bank Cyber Security Operations Center.</span>
        </p>
        <span className="font-mono text-[10px] text-white/50 shrink-0 hidden sm:inline">Incident ID: #SEC-98412</span>
      </div>
    </StarBorder>
  );
}
