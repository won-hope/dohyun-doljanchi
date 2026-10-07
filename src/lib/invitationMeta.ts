import { formatKoreanDate } from '@/utils/dateFormatter';

export interface InvitationMeta {
  title: string;
  description: string;
  image?: string;
}

const FALLBACK: InvitationMeta = {
  title: '도현이의 첫돌에 초대합니다',
  description: '우리 아기 첫 번째 생일에 함께해 주세요.',
};

type FirestoreString = { stringValue?: string };

/**
 * 빌드 시점에 Firestore(REST)에서 커버 사진·날짜·장소를 읽어 OG 태그에 사용합니다.
 * 정적 export 이므로 카카오톡 미리보기 정보는 "배포할 때" 갱신됩니다.
 * 읽기에 실패하면 기본 문구로 안전하게 대체됩니다.
 */
export async function getInvitationMeta(): Promise<InvitationMeta> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId || projectId === 'mock-project') return FALLBACK;

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/invitation_config/settings`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return FALLBACK;

    const fields: Record<string, FirestoreString> = (await res.json()).fields ?? {};
    const get = (key: string) => fields[key]?.stringValue ?? '';

    const babyName = get('babyName') || '도현';
    const when = formatKoreanDate(get('date'), get('time'));
    const place = get('locationName');

    return {
      title: `${babyName}의 첫돌에 초대합니다`,
      description: [when, place].filter(Boolean).join(' · ') || FALLBACK.description,
      image: get('mainCoverImage') || undefined,
    };
  } catch {
    return FALLBACK;
  }
}

