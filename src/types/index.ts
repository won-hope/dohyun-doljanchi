export type ThemeType = 'EDITORIAL' | 'POLAROID' | 'CINEMATIC';

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
  scrollImages: ScrollImage[];
  galleryImages: GalleryImage[];
  tmiItems: TmiItem[];
  
  babyName: string;
  date: string;
  time: string;
  locationName: string;
  locationAddress: string;
  locationAddressDetail: string;

  greetingMessage: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;

  quizQuestion: string;
  quizOptions: string[];
  quizAnswerIndex: number;

  bgmUrl?: string;
  useRsvp: boolean;
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
