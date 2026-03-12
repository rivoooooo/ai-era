export interface ChallengeFile {
  filename: string;
  language: string;
  content: string;
}

export interface ChallengeResource {
  id: string;
  challengeId: string;
  type: string;
  importSource: string;
  initCode: ChallengeFile[];
  codeSource: ChallengeFile[];
}

export interface ChallengeConfig {
  id: string;
  title: string;
  description: string;
  initCode: ChallengeFile[];
  codeSource: ChallengeFile[];
  importSource: string;
}

export async function getChallengeConfig(slug: string): Promise<ChallengeConfig | null> {
  const { getChallengeWithResources } = await import('@/server/lib/db/queries');
  
  const challenge = await getChallengeWithResources(slug, 'en');
  
  if (!challenge) return null;

  const resource = challenge.resources?.[0];
  
  return {
    id: challenge.id,
    title: challenge.name,
    description: challenge.description || '',
    initCode: resource?.initCode || [],
    codeSource: resource?.codeSource || [],
    importSource: resource?.importSource || '',
  };
}
