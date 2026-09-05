import StatCard from "@/components/dashboard/StatCard";
import LiveAudioWidget from "@/components/ui/LiveAudioWidget";
import AudioUploader from "@/components/ui/AudioUploader";
import RecentDetections from "@/components/dashboard/RecentDetections";
import ThreatChart from "@/components/dashboard/ThreatChart";
import { Activity, ShieldAlert, Users, Target } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome to <span className="text-accent">Swaraksha AI</span></h1>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <p className="text-foreground/70">AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks</p>
          <p className="text-foreground/50 italic text-sm border-l-2 border-accent pl-3">&quot;Authentic Voices<br/>A Safer Tomorrow&quot;</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Total Scans" 
          value="1,284" 
          icon={Activity} 
          trend="12.4%" 
          trendUp={true} 
          type="accent" 
        />
        <StatCard 
          title="Threats Detected" 
          value="24" 
          icon={ShieldAlert} 
          trend="3 today" 
          trendUp={false} 
          type="danger" 
        />
        <StatCard 
          title="Genuine Voices" 
          value="1,060" 
          icon={Users} 
          trend="10.2%" 
          trendUp={true} 
          type="success" 
        />
        <StatCard 
          title="Detection Accuracy" 
          value="98.7%" 
          icon={Target} 
          type="default" 
        />
      </div>

      {/* Main Action Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[420px]">
        <LiveAudioWidget />
        <AudioUploader />
      </div>

      {/* Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[400px]">
          <RecentDetections />
        </div>
        <div className="lg:col-span-2 h-[400px]">
          <ThreatChart />
        </div>
      </div>

    </div>
  );
}

