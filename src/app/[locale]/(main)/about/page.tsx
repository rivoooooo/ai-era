import { getTranslations } from "next-intl/server"
import { Metadata } from "next"
import { HeroSection } from "./components/HeroSection"
import { MissionSection } from "./components/MissionSection"
import { FounderSection } from "./components/FounderSection"
import { TeamSection } from "./components/TeamSection"
import { OpenRolesSection } from "./components/OpenRolesSection"
import { ContactSection } from "./components/ContactSection"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About — AI-Era | Developer Training Platform",
    description:
      "AI-Era is a training ground built by developers for developers navigating the AI era. Learn our mission, team, and tech stack.",
  }
}

function SectionDivider({ section, total }: { section: number; total: number }) {
  return (
    <div className="overflow-hidden select-none text-border/40 text-xs tracking-widest py-1">
      <span className="whitespace-nowrap">
        {'─'.repeat(80)} // section {section} of {total} {'─'.repeat(80)}
      </span>
    </div>
  )
}

export default async function AboutPage() {
  const t = await getTranslations("about")

  const teamMembers = [
    {
      name: "Developer",
      role: "Founder & Developer",
      handle: "developer",
      comment: ["Built this because I needed it."],
    },
  ]

  return (
    <div className="min-h-screen py-4 md:py-6 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="sr-only">{t("pageTitle")}</h1>

        <HeroSection
          title={[t("hero.title.line1"), t("hero.title.line2")]}
          subtitle={[
            t("hero.subtitle.line1"),
            t("hero.subtitle.line2"),
            t("hero.subtitle.line3"),
          ]}
        />

        <SectionDivider section={2} total={6} />

        <MissionSection
          label={t("mission.label")}
          badge={t("mission.badge")}
          lineNumber={t("mission.lineNumber")}
          problemText={[
            t("mission.problem.paragraph1"),
            t("mission.problem.paragraph2"),
          ]}
          solutionText={[
            t("mission.solution.paragraph1"),
            t("mission.solution.paragraph2"),
          ]}
        />

        <SectionDivider section={3} total={6} />

        <FounderSection
          name={t("founder.name")}
          role={t("founder.role")}
          handle={t("founder.handle")}
          comment={[t("founder.comment.line1"), t("founder.comment.line2")]}
        />

        <SectionDivider section={4} total={6} />

        <TeamSection
          title={t("team.title")}
          subtitle={[t("team.subtitle.line1"), t("team.subtitle.line2")]}
          members={teamMembers}
        />

        <SectionDivider section={5} total={6} />

        <OpenRolesSection
          title={t("openRoles.title")}
          description={[
            t("openRoles.description.line1"),
            t("openRoles.description.line2"),
            t("openRoles.description.line3"),
          ]}
          needsLabel={t("openRoles.needsLabel")}
          needs={[
            t("openRoles.needs.frontend"),
            t("openRoles.needs.backend"),
            t("openRoles.needs.content"),
            t("openRoles.needs.devrel"),
          ]}
          ctaText={t("openRoles.cta")}
          ctaLink="https://github.com/your-org/ai-era/issues"
        />

        <SectionDivider section={6} total={6} />

        <ContactSection
          title={t("contact.title")}
          links={[
            {
              label: t("contact.links.github.label"),
              url: "https://github.com/your-org/ai-era",
            },
            {
              label: t("contact.links.twitter.label"),
              url: "https://twitter.com/ai_era_dev",
            },
          ]}
          email={t("contact.email")}
          okMessage={t("contact.okMessage")}
          newsletterTitle={t("contact.newsletter.title")}
          newsletterDescription={[
            t("contact.newsletter.description.line1"),
            t("contact.newsletter.description.line2"),
          ]}
          newsletterPlaceholder={t("contact.newsletter.placeholder")}
          newsletterButton={t("contact.newsletter.button")}
        />
      </div>
    </div>
  )
}
