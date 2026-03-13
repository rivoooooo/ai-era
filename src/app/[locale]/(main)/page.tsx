import { HeroSection } from "@/components/HeroSection"
import { SystemScanSection } from "@/components/SystemScanSection"
import { ModulesSection } from "@/components/ModulesSection"
import { DailyChallenge } from "@/components/DailyChallenge"
import { ActivityFeed } from "@/components/ActivityFeed"

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <HeroSection />
      <SystemScanSection />
      <ModulesSection />
      <DailyChallenge />
      <ActivityFeed />
    </div>
  )
}
