import { HeroSection } from "@/components/HeroSection"
import { SystemScanSection } from "@/components/SystemScanSection"

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <HeroSection />
      <SystemScanSection />
    </div>
  )
}
