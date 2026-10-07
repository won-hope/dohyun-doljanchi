'use client';
import { MotionConfig } from 'framer-motion';
import { useInvitationData } from '@/hooks/useInvitationData';
import TemplateEditorial from '@/components/themes/TemplateEditorial';
import TemplatePolaroid from '@/components/themes/TemplatePolaroid';
import TemplateCinematic from '@/components/themes/TemplateCinematic';
import TemplateBlueSnake from '@/components/themes/TemplateBlueSnake';
import BgmPlayer from '@/components/common/BgmPlayer';
import FloatingTabBar from '@/components/common/FloatingTabBar';

export default function InvitationMainPage() {
  const { config, loading } = useInvitationData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper" role="status" aria-label="불러오는 중">
        <div className="w-7 h-7 border-2 border-line border-t-ink rounded-full animate-spin" />
      </div>
    );
  }

  const template = config?.selectedTemplate || 'EDITORIAL';

  return (
    // 사용자가 '동작 줄이기'를 켠 기기에서는 모든 모션을 자동으로 끕니다.
    <MotionConfig reducedMotion="user">
      <BgmPlayer url={config?.bgmUrl} />
      {template === 'EDITORIAL' && <TemplateEditorial config={config} />}
      {template === 'POLAROID' && <TemplatePolaroid config={config} />}
      {template === 'CINEMATIC' && <TemplateCinematic config={config} />}
      {template === 'BLUE_SNAKE' && <TemplateBlueSnake config={config} />}
      <FloatingTabBar />
    </MotionConfig>
  );
}
