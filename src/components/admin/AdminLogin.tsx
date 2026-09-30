'use client';
import { useState } from 'react';

interface AdminLoginProps {
  onLogin: (pin: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(pin);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="PIN 번호를 입력하세요"
        className="border border-gray-300 p-3 rounded-lg text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-gray-800"
        maxLength={6}
      />
      <button 
        type="submit"
        className="bg-gray-800 text-white font-semibold py-3 rounded-lg hover:bg-gray-900 transition"
      >
        관리자 로그인
      </button>
    </form>
  );
}
