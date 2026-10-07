export type ThemeType = 'EDITORIAL' | 'POLAROID' | 'CINEMATIC' | 'BLUE_SNAKE';

export interface ScrollImage {
  id: string;
  url: string;
  caption: string;
  month: number;
}

export interface GalleryImage {
  id: string;
  url: string;
}

export interface TmiItem {
  id: string;
  question: string;
  answer: string;
}

export interface InvitationConfig {
  selectedTemplate: ThemeType;
  mainCoverImage: string;
  /** 커버 사진 세로 초점 (0=위, 100=아래). 얼굴이 잘리지 않도록 사진마다 조정 */
  coverFocusY?: number;
  scrollImages: ScrollImage[];
  galleryImages: GalleryImage[];
  tmiItems: TmiItem[];
  
  babyName: string;
  date: string;
  time: string;
  locationName: string;
  locationAddress: string;
  locationAddressDetail: string;
  /** 주차 안내 (입력한 경우에만 표시) */
  parkingInfo?: string;

  greetingMessage: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;

  quizQuestion: string;
  quizOptions: string[];
  quizAnswerIndex: number;

  bgmUrl?: string;
  
  // Section Toggles
  useStory?: boolean;
  useGallery?: boolean;
  useTmi?: boolean;
  useRsvp: boolean;
  useQuiz?: boolean;
  useGuestbook?: boolean;
}

export interface RsvpEntry {
  id: string;
  name: string;
  isAttending: boolean;
  adultCount: number;
  childCount: number;
  needBabyChair: boolean;
  createdAt: number;
}
