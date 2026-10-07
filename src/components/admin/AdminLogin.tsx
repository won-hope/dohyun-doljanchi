'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state change will be handled in the parent component (page.tsx)
      onSuccess();
    } catch (error: any) {
      console.error("Login error", error);
      setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
          {errorMsg}
        </div>
      )}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일을 입력하세요"
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호를 입력하세요"
        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
        required
      />
      <button 
        type="submit"
        disabled={isLoading}
        className="bg-gray-800 text-white font-semibold py-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
      >
        {isLoading ? '로그인 중...' : '관리자 로그인'}
      </button>
    </form>
  );
}
