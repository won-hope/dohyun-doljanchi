'use client';
import { useState } from 'react';
import { useInvitationData } from '@/hooks/useInvitationData';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { ThemeType, ScrollImage } from '@/types';
import imageCompression from 'browser-image-compression';

export default function Dashboard() {
  const { config, loading, updateConfig } = useInvitationData();
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingScroll, setUploadingScroll] = useState(false);
  
  const [newScrollMonth, setNewScrollMonth] = useState<number | ''>('');
  const [newScrollCaption, setNewScrollCaption] = useState('');

  if (loading) return <div className="text-center py-10 animate-pulse">설정 불러오는 중...</div>;

  const handleThemeChange = async (theme: ThemeType) => {
    const success = await updateConfig({ selectedTemplate: theme });
    if (success) alert(`${theme === 'EDITORIAL' ? '에디토리얼' : '폴라로이드'} 테마로 변경되었습니다.`);
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `invitation/main_${Date.now()}`);
      await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(storageRef);
      await updateConfig({ mainCoverImage: url });
      alert('메인 커버 사진이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('업로드 실패', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploadingMain(false);
      e.target.value = '';
    }
  };

  const handleAddScrollImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (newScrollMonth === '' || !newScrollCaption) {
      alert("월(개월 수)과 캡션을 먼저 입력해주세요!");
      e.target.value = '';
      return;
    }

    setUploadingScroll(true);
    try {
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      const imageId = `scroll_${Date.now()}`;
      const storageRef = ref(storage, `invitation/scroll/${imageId}`);
      await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(storageRef);
      
      const newImage: ScrollImage = {
        id: imageId,
        url,
        month: Number(newScrollMonth),
        caption: newScrollCaption
      };

      const updatedScrollImages = [...(config.scrollImages || []), newImage].sort((a, b) => a.month - b.month);
      
      await updateConfig({ scrollImages: updatedScrollImages });
      
    } catch (error) {
      console.error('업로드 실패', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploadingScroll(false);
      e.target.value = '';
    }
  };

  const handleDeleteScrollImage = async (imageId: string, url: string) => {
    if (!confirm('정말 이 사진을 삭제하시겠습니까?')) return;
    
    try {
      if (url.includes('firebasestorage')) {
         const imageRef = ref(storage, url);
         await deleteObject(imageRef).catch(e => console.log('Storage 파일 삭제 실패', e));
      }
      
      const updatedScrollImages = (config.scrollImages || []).filter(img => img.id !== imageId);
      await updateConfig({ scrollImages: updatedScrollImages });
    } catch (error) {
      console.error('삭제 실패', error);
      alert('사진 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-10">
      <GeneralSettingsManager config={config} updateConfig={updateConfig} />

      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-800">1. 디자인 테마 선택</h2>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => handleThemeChange('EDITORIAL')} className={`p-4 border rounded-xl flex flex-col items-center transition ${config.selectedTemplate === 'EDITORIAL' ? 'border-gray-800 bg-gray-50 ring-2 ring-gray-800 ring-opacity-20' : 'border-gray-200 hover:bg-gray-50'}`}>
            <div className="w-16 h-24 bg-stone-100 border border-stone-200 mb-3 flex flex-col items-center justify-center p-1 shadow-sm relative overflow-hidden">
              <div className="w-full aspect-[4/5] bg-stone-300 mb-1"></div>
              <div className="w-10 h-0.5 bg-stone-400 mb-0.5"></div>
            </div>
            <span className="font-bold text-gray-800 text-sm">에디토리얼</span>
            <span className="text-[10px] text-gray-500 mt-1 text-center">차분한 오프화이트</span>
          </button>
          
          <button onClick={() => handleThemeChange('POLAROID')} className={`p-4 border rounded-xl flex flex-col items-center transition ${config.selectedTemplate === 'POLAROID' ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500 ring-opacity-20' : 'border-gray-200 hover:bg-orange-50'}`}>
            <div className="w-16 h-24 bg-yellow-50 border border-orange-100 mb-3 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-12 p-1 bg-white shadow-sm rotate-[-6deg] rounded-[2px] mb-1 border border-gray-100">
                <div className="w-full aspect-[4/5] bg-blue-100 mb-0.5"></div>
              </div>
            </div>
            <span className="font-bold text-gray-800 text-sm">폴라로이드</span>
            <span className="text-[10px] text-gray-500 mt-1 text-center">따뜻한 피치톤</span>
          </button>

          <button onClick={() => handleThemeChange('CINEMATIC')} className={`p-4 border rounded-xl flex flex-col items-center transition ${config.selectedTemplate === 'CINEMATIC' ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-600 ring-opacity-20' : 'border-gray-200 hover:bg-gray-50'}`}>
            <div className="w-16 h-24 bg-black border border-gray-800 mb-3 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-full h-full bg-gradient-to-t from-black to-zinc-800 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/50 text-[8px]">D-DAY</div>
              </div>
            </div>
            <span className="font-bold text-gray-800 text-sm">시네마틱</span>
            <span className="text-[10px] text-gray-500 mt-1 text-center">풀스크린 다크모드</span>
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-800">2. 메인 커버 사진</h2>
        <div className="flex flex-col space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          {config.mainCoverImage ? (
            <div className="relative w-full aspect-square overflow-hidden rounded-lg shadow-sm">
              <img src={config.mainCoverImage} alt="Main Cover" className="object-cover w-full h-full" />
            </div>
          ) : (
            <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">이미지 없음</div>
          )}
          <label className="flex flex-col items-center justify-center w-full h-12 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
            <span className="text-sm text-gray-500 font-medium">{uploadingMain ? '업로드 중입니다...' : '새로운 메인 사진 업로드'}</span>
            <input type="file" accept="image/*" onChange={handleMainImageUpload} disabled={uploadingMain} className="hidden" />
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-800">3. 성장 타임라인 사진</h2>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
          
          <div className="space-y-3">
            {(config.scrollImages || []).map((img) => (
              <div key={img.id} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <img src={img.url} alt={img.caption} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-800">{img.month}개월</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{img.caption}</p>
                </div>
                <button 
                  onClick={() => handleDeleteScrollImage(img.id, img.url)}
                  className="text-red-500 p-2 text-sm font-semibold hover:bg-red-50 rounded"
                >
                  삭제
                </button>
              </div>
            ))}
            {(!config.scrollImages || config.scrollImages.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">등록된 타임라인 사진이 없습니다.</p>
            )}
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3 text-gray-700">새 사진 추가</h3>
            <div className="flex gap-2 mb-3">
              <input 
                type="number" 
                placeholder="개월수" 
                value={newScrollMonth}
                onChange={e => setNewScrollMonth(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-20 p-2 border rounded text-sm focus:ring-2 focus:ring-gray-800 focus:outline-none"
              />
              <input 
                type="text" 
                placeholder="설명 (예: 처음 뒤집은 날!)" 
                value={newScrollCaption}
                onChange={e => setNewScrollCaption(e.target.value)}
                className="flex-1 p-2 border rounded text-sm focus:ring-2 focus:ring-gray-800 focus:outline-none"
              />
            </div>
            
            <label className={`flex flex-col items-center justify-center w-full h-10 border-2 border-dashed rounded-lg cursor-pointer bg-white transition ${uploadingScroll ? 'opacity-50' : 'hover:bg-gray-100'}`}>
              <span className="text-sm text-gray-600 font-medium">{uploadingScroll ? '사진 업로드 중...' : '사진 선택 및 추가'}</span>
              <input type="file" accept="image/*" onChange={handleAddScrollImage} disabled={uploadingScroll} className="hidden" />
            </label>
          </div>

        </div>
      </section>

      
      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-800">2-2. 갤러리 (스튜디오 사진) 관리</h2>
        <GalleryManager config={config} updateConfig={updateConfig} />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-800">3-2. 참석자(RSVP) 통계 대시보드</h2>
        <RsvpManager config={config} updateConfig={updateConfig} />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-800">4. 깜짝 퀴즈 설정 & 참여자</h2>
        <QuizManager config={config} updateConfig={updateConfig} />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-800">4-2. 아이 TMI (인터뷰) 설정</h2>
        <TmiManager config={config} updateConfig={updateConfig} />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4 text-gray-800">5. 타임캡슐(방명록) 관리</h2>
        <GuestbookManager />
      </section>
    </div>
  );
}

import { useGuestbook } from '@/hooks/useGuestbook';
import { useQuiz } from '@/hooks/useQuiz';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function QuizManager({ config, updateConfig }: { config: any, updateConfig: any }) {
  const { submissions, loading } = useQuiz();
  
  const [question, setQuestion] = useState(config.quizQuestion || '');
  const [options, setOptions] = useState(config.quizOptions || ['', '', '', '']);
  const [answerIdx, setAnswerIdx] = useState(config.quizAnswerIndex || 0);

  const handleOptionChange = (idx: number, value: string) => {
    const newOpts = [...options];
    newOpts[idx] = value;
    setOptions(newOpts);
  };

  const handleSave = () => {
    updateConfig({
      quizQuestion: question,
      quizOptions: options,
      quizAnswerIndex: answerIdx
    });
    alert('퀴즈 설정이 저장되었습니다!');
  };

  const handleResetQuiz = async () => {
    if (!confirm('정말 퀴즈 참여 내역을 모두 초기화하시겠습니까? (복구 불가)')) return;
    try {
      await Promise.all(submissions.map(sub => deleteDoc(doc(db, 'quiz_votes', sub.id))));
      alert('퀴즈 참여 내역이 모두 초기화되었습니다.');
    } catch (e) {
      alert('초기화 중 오류가 발생했습니다.');
    }
  };

  const correctCount = submissions.filter(s => s.isCorrect).length;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
        <h3 className="font-bold text-blue-800 text-sm">퀴즈 내용 커스터마이징</h3>
        <p className="text-xs text-blue-600 mb-2">원하시는 질문과 보기를 직접 입력하고 [저장하기]를 눌러주세요.</p>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">질문</label>
          <input 
            type="text" 
            value={question} 
            onChange={e => setQuestion(e.target.value)} 
            placeholder="예) 도현이가 가장 좋아하는 과일은?"
            className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-400" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">보기 (최대 4개)</label>
          <div className="space-y-2">
            {[0, 1, 2, 3].map(idx => (
              <div key={idx} className="flex items-center gap-2">
                <input 
                  type="radio" 
                  checked={answerIdx === idx} 
                  onChange={() => setAnswerIdx(idx)} 
                  className="w-4 h-4 cursor-pointer"
                />
                <input 
                  type="text" 
                  value={options[idx]} 
                  onChange={e => handleOptionChange(idx, e.target.value)} 
                  placeholder={`${idx + 1}번 보기`}
                  className="flex-1 p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-400"
                />
                {answerIdx === idx && <span className="text-xs text-blue-600 font-bold">정답</span>}
              </div>
            ))}
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          퀴즈 설정 저장하기
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800 text-sm">퀴즈 참여 현황 (정답자: {correctCount}명)</h3>
          <button onClick={handleResetQuiz} className="text-xs text-red-500 font-bold hover:underline">전체 초기화</button>
        </div>
        {loading ? (
          <p className="text-sm text-gray-500">불러오는 중...</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {submissions.map(sub => (
              <div key={sub.id} className={`p-3 rounded-lg text-sm flex flex-col gap-1 ${sub.isCorrect ? 'bg-green-100 text-green-900 border border-green-200' : 'bg-white border text-gray-600'}`}>
                <div className="flex justify-between items-center font-bold">
                  <span>{sub.name}</span>
                  <span>{options[sub.answerIndex] || '?'}</span>
                </div>
                {sub.comment && <p className="text-xs mt-1 bg-white/50 p-2 rounded">{sub.comment}</p>}
              </div>
            ))}
            {submissions.length === 0 && <p className="text-xs text-gray-400">아직 참여자가 없습니다.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function GuestbookManager() {
  const { entries, loading, deleteEntry } = useGuestbook();

  const handleResetGuestbook = async () => {
    if (!confirm('정말 모든 방명록을 삭제하시겠습니까? (복구 불가)')) return;
    try {
      await Promise.all(entries.map(entry => deleteDoc(doc(db, 'guestbook', entry.id))));
      alert('방명록이 모두 초기화되었습니다.');
    } catch (e) {
      alert('초기화 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div className="text-sm text-gray-500">방명록 불러오는 중...</div>;

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 max-h-96 overflow-y-auto">
      <div className="flex justify-end">
        <button onClick={handleResetGuestbook} className="text-xs text-red-500 font-bold hover:underline">전체 초기화</button>
      </div>
      {entries.map(entry => (
        <div key={entry.id} className="bg-white p-3 rounded shadow-sm border border-gray-100 flex justify-between items-start">
          <div>
            <p className="font-bold text-sm text-gray-800">{entry.name}</p>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{entry.message}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date(entry.createdAt).toLocaleString()}</p>
          </div>
          <button 
            onClick={() => {
              if(confirm('이 댓글을 삭제하시겠습니까?')) deleteEntry(entry.id);
            }}
            className="text-red-500 text-xs font-bold p-2 hover:bg-red-50 rounded"
          >
            삭제
          </button>
        </div>
      ))}
      {entries.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">아직 작성된 방명록이 없습니다.</p>
      )}
    </div>
  );
}
import { useEffect } from 'react';

function GeneralSettingsManager({ config, updateConfig }: { config: any, updateConfig: any }) {
  const [formData, setFormData] = useState<any>(config || {});

  useEffect(() => {
    // config가 로드될 때 한 번만 초기화
    if (Object.keys(formData).length === 0 && config) {
      setFormData(config);
    }
  }, [config]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await updateConfig({
      babyName: formData.babyName,
      date: formData.date,
      time: formData.time,
      locationName: formData.locationName,
      locationAddress: formData.locationAddress,
      locationAddressDetail: formData.locationAddressDetail,
      greetingMessage: formData.greetingMessage,
      fatherName: formData.fatherName,
      fatherPhone: formData.fatherPhone,
      motherName: formData.motherName,
      motherPhone: formData.motherPhone,
      bgmUrl: formData.bgmUrl,
    });
    alert('기본 설정이 모두 저장되었습니다!');
  };

  if (!formData || Object.keys(formData).length === 0) return null;

  return (
    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">0. 공통 기본 설정</h2>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition"
        >
          기본 설정 저장하기
        </button>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-sm font-bold mb-3 text-gray-700">📌 아기 정보 & 행사 일시</h3>
          <div className="grid gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">아기 이름</label>
              <input type="text" value={formData.babyName || ''} onChange={e => handleChange('babyName', e.target.value)} className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  행사 날짜 
                  {formData.date && (
                    <span className="ml-2 text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full text-[10px]">
                      {(() => {
                        const today = new Date();
                        today.setHours(0,0,0,0);
                        const eventDate = new Date(formData.date);
                        eventDate.setHours(0,0,0,0);
                        const diff = eventDate.getTime() - today.getTime();
                        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                        if (days > 0) return `D-${days}`;
                        if (days === 0) return 'D-DAY';
                        return `D+${Math.abs(days)}`;
                      })()}
                    </span>
                  )}
                </label>
                <input type="date" value={formData.date || ''} onChange={e => handleChange('date', e.target.value)} className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">행사 시간</label>
                <input type="time" value={formData.time || ''} onChange={e => handleChange('time', e.target.value)} className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold mb-3 text-gray-700">📍 오시는 길 (장소)</h3>
          <div className="grid gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">장소명</label>
              <input type="text" value={formData.locationName || ''} onChange={e => handleChange('locationName', e.target.value)} className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">도로명 주소</label>
              <input type="text" value={formData.locationAddress || ''} onChange={e => handleChange('locationAddress', e.target.value)} className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">상세 주소 (지번 등)</label>
              <input type="text" value={formData.locationAddressDetail || ''} onChange={e => handleChange('locationAddressDetail', e.target.value)} className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold mb-3 text-gray-700">✉️ 모시는 글 & 부모님 연락처</h3>
          <div className="grid gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">초대하는 글 (인사말)</label>
              <textarea 
                value={formData.greetingMessage || ''} 
                onChange={e => handleChange('greetingMessage', e.target.value)} 
                rows={4}
                className="w-full p-2 border rounded text-sm outline-none resize-none focus:ring-2 focus:ring-blue-400" 
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">아빠 이름</label>
                <input type="text" value={formData.fatherName || ''} onChange={e => handleChange('fatherName', e.target.value)} className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">아빠 연락처 (- 포함)</label>
                <input type="text" value={formData.fatherPhone || ''} onChange={e => handleChange('fatherPhone', e.target.value)} className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">엄마 이름</label>
                <input type="text" value={formData.motherName || ''} onChange={e => handleChange('motherName', e.target.value)} className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">엄마 연락처 (- 포함)</label>
                <input type="text" value={formData.motherPhone || ''} onChange={e => handleChange('motherPhone', e.target.value)} className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold mb-3 text-gray-700">🎵 배경음악(BGM) 설정</h3>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">유튜브 링크 (선택사항)</label>
            <input 
              type="text" 
              value={formData.bgmUrl || ''} 
              onChange={e => handleChange('bgmUrl', e.target.value)} 
              placeholder="예: https://www.youtube.com/watch?v=..." 
              className="w-full p-2 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-400" 
            />
            <p className="text-xs text-gray-500 mt-2">유튜브 링크를 넣으면 초대장 우측 상단에 재생 버튼이 생깁니다.</p>
          </div>
        </section>
      </div>

      <button 
        onClick={handleSave}
        className="w-full mt-6 bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition shadow-lg"
      >
        위 기본 설정 모두 저장하기
      </button>
    </div>
  );
}

function TmiManager({ config, updateConfig }: { config: any, updateConfig: any }) {
  const [tmiItems, setTmiItems] = useState<{id: string, question: string, answer: string}[]>(config.tmiItems || []);

  const handleSave = () => {
    updateConfig({ tmiItems });
    alert('TMI 설정이 저장되었습니다!');
  };

  const addItem = () => {
    setTmiItems([...tmiItems, { id: Date.now().toString(), question: '', answer: '' }]);
  };

  const updateItem = (id: string, field: 'question' | 'answer', value: string) => {
    setTmiItems(tmiItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setTmiItems(tmiItems.filter(item => item.id !== id));
  };

  return (
    <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-pink-800 text-sm">TMI 문답 관리</h3>
        <button onClick={addItem} className="text-xs bg-pink-200 text-pink-800 px-3 py-1 rounded font-bold hover:bg-pink-300 transition shadow-sm">문답 추가하기</button>
      </div>
      <div className="space-y-3">
        {tmiItems.map((item, idx) => (
          <div key={item.id} className="bg-white p-3 rounded-lg border border-pink-100 shadow-sm flex flex-col gap-2 relative">
            <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 text-xs text-red-500 font-bold hover:underline">삭제</button>
            <div className="flex gap-2 items-center">
              <span className="text-pink-500 font-black">Q.</span>
              <input type="text" value={item.question} onChange={e => updateItem(item.id, 'question', e.target.value)} placeholder="질문 (예: 태몽은?)" className="flex-1 p-1.5 border rounded text-xs outline-none focus:ring-1 focus:ring-pink-400" />
            </div>
            <div className="flex gap-2 items-center mt-1">
              <span className="text-blue-500 font-black">A.</span>
              <input type="text" value={item.answer} onChange={e => updateItem(item.id, 'answer', e.target.value)} placeholder="답변 (예: 황금돼지!)" className="flex-1 p-1.5 border rounded text-xs outline-none focus:ring-1 focus:ring-pink-400" />
            </div>
          </div>
        ))}
        {tmiItems.length === 0 && <p className="text-xs text-gray-400 text-center py-2">등록된 문답이 없습니다.</p>}
      </div>
      <button onClick={handleSave} className="w-full bg-pink-500 text-white font-bold py-2 rounded-lg hover:bg-pink-600 transition shadow-sm">TMI 저장하기</button>
    </div>
  );
}


import { useRsvp } from '@/hooks/useRsvp';

function GalleryManager({ config, updateConfig }: { config: any, updateConfig: any }) {
  const [uploading, setUploading] = useState(false);

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      const imageId = `gallery_${Date.now()}`;
      const storageRef = ref(storage, `invitation/gallery/${imageId}`);
      await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(storageRef);
      
      const newImage = { id: imageId, url };
      const updatedGallery = [...(config.galleryImages || []), newImage];
      
      await updateConfig({ galleryImages: updatedGallery });
    } catch (error) {
      alert('갤러리 사진 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (imageId: string, url: string) => {
    if (!confirm('정말 이 사진을 삭제하시겠습니까?')) return;
    try {
      if (url.includes('firebasestorage')) {
         const imageRef = ref(storage, url);
         await deleteObject(imageRef).catch(e => console.log('Storage 파일 삭제 실패', e));
      }
      const updatedGallery = (config.galleryImages || []).filter((img: any) => img.id !== imageId);
      await updateConfig({ galleryImages: updatedGallery });
    } catch (error) {
      alert('사진 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {(config.galleryImages || []).map((img: any) => (
          <div key={img.id} className="relative aspect-square rounded overflow-hidden group border border-gray-200">
            <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
            <button onClick={() => handleDeleteImage(img.id, img.url)} className="absolute top-1 right-1 bg-red-500/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">삭제</button>
          </div>
        ))}
        <label className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded cursor-pointer bg-white transition ${uploading ? 'opacity-50' : 'hover:bg-gray-100'}`}>
          <span className="text-xl text-gray-400 mb-1">+</span>
          <span className="text-[10px] text-gray-500">{uploading ? '업로드 중...' : '추가'}</span>
          <input type="file" accept="image/*" onChange={handleAddImage} disabled={uploading} className="hidden" />
        </label>
      </div>
    </div>
  );
}

function RsvpManager({ config, updateConfig }: { config: any, updateConfig: any }) {
  const { entries, loading } = useRsvp();

  const totalAdults = entries.filter(e => e.isAttending).reduce((sum, e) => sum + e.adultCount, 0);
  const totalKids = entries.filter(e => e.isAttending).reduce((sum, e) => sum + e.childCount, 0);
  const totalChairs = entries.filter(e => e.isAttending && e.needBabyChair).length;
  const notAttending = entries.filter(e => !e.isAttending).length;

  return (
    <div className="space-y-4">
      <div className="bg-green-50 p-4 rounded-xl border border-green-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-[10px] font-bold text-green-700 mb-1">참석 (어른)</p>
          <p className="text-2xl font-black text-green-900">{totalAdults}명</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-green-700 mb-1">참석 (아이)</p>
          <p className="text-2xl font-black text-green-900">{totalKids}명</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-green-700 mb-1">아기의자 필요</p>
          <p className="text-2xl font-black text-green-900">{totalChairs}개</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 mb-1">불참 (마음만)</p>
          <p className="text-2xl font-black text-gray-600">{notAttending}명</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl max-h-60 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="p-3 font-bold text-gray-600">이름</th>
              <th className="p-3 font-bold text-gray-600 text-center">참석여부</th>
              <th className="p-3 font-bold text-gray-600 text-center">어른/아이</th>
              <th className="p-3 font-bold text-gray-600 text-center">아기의자</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-400">명단을 불러오는 중...</td></tr>
            ) : entries.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-400">아직 응답이 없습니다.</td></tr>
            ) : entries.map(entry => (
              <tr key={entry.id} className="hover:bg-gray-50 transition">
                <td className="p-3 font-bold text-gray-800">{entry.name}</td>
                <td className="p-3 text-center">
                  {entry.isAttending ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold">참석</span> : <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded">불참</span>}
                </td>
                <td className="p-3 text-center text-gray-600">{entry.isAttending ? `${entry.adultCount}명 / ${entry.childCount}명` : '-'}</td>
                <td className="p-3 text-center text-gray-600">{entry.isAttending && entry.needBabyChair ? '⭕️ 필요' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
