'use client';
import { useInvitationData } from '@/hooks/useInvitationData';
import TemplateEditorial from '@/components/themes/TemplateEditorial';
import TemplatePolaroid from '@/components/themes/TemplatePolaroid';
import TemplateCinematic from '@/components/themes/TemplateCinematic';
import BgmPlayer from '@/components/common/BgmPlayer';
import FloatingTabBar from '@/components/common/FloatingTabBar';

export default function InvitationMainPage() {
  const { config, loading } = useInvitationData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium tracking-widest text-sm">LOADING...</p>
        </div>
      </div>
    );
  }

  const template = config?.selectedTemplate || 'EDITORIAL';

  return (
    <>
      <BgmPlayer url={config?.bgmUrl} />
      {template === 'EDITORIAL' && <TemplateEditorial config={config} />}
      {template === 'POLAROID' && <TemplatePolaroid config={config} />}
      {template === 'CINEMATIC' && <TemplateCinematic config={config} />}
      <FloatingTabBar />
    </>
  );
}
