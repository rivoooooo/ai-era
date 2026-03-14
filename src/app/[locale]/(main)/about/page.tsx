"use client"

import { TerminalCanvas } from "./components/TerminalCanvas"
import { SectionDivider } from "./components/SectionDivider"
import { MissionSection } from "./components/MissionSection"
import { FounderSection } from "./components/FounderSection"
import { TeamSection } from "./components/TeamSection"
import { StackSection } from "./components/StackSection"
import { OpenRolesSection } from "./components/OpenRolesSection"
import { ContactSection } from "./components/ContactSection"
import { NewsletterSection } from "./components/NewsletterSection"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Canvas Zone (70vh) - Unchanged */}
      <TerminalCanvas />

      {/* Content Area - Scrollable */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Divider 1 */}
        <SectionDivider current={1} total={4} />

        {/* Section 1: MISSION */}
        <MissionSection />

        {/* Section Divider 2 */}
        <SectionDivider current={2} total={4} />

        {/* Section 2: FOUNDER + TEAM */}
        <section className="py-16 md:py-20">
          <FounderSection />
          <TeamSection />
        </section>

        {/* Section Divider 3 */}
        <SectionDivider current={3} total={4} />

        {/* Section 3: STACK */}
        <StackSection />

        {/* Section Divider 4 */}
        <SectionDivider current={4} total={4} />

        {/* Section 4: OPEN_ROLES + CONTACT */}
        <section className="py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <OpenRolesSection />
            <ContactSection />
          </div>
          <NewsletterSection />
        </section>

        {/* Bottom Spacing */}
        <div className="h-20" />
      </div>
    </div>
  )
}
