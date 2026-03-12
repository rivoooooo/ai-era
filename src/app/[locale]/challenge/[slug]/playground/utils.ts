export interface ChallengeCode {
  html: string;
  css: string;
  js: string;
}

export interface ChallengeConfig {
  id: string;
  title: string;
  description: string;
  defaultCode: ChallengeCode;
  dependencies?: string[];
  modules?: string[];
}

const challengesData: Record<string, ChallengeConfig> = {};

export async function getChallengeConfig(slug: string): Promise<ChallengeConfig | null> {
  return challengesData[slug] || null;
}

export function getAllChallenges(): ChallengeConfig[] {
  return Object.values(challengesData);
}
