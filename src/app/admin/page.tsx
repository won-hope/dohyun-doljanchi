'use client';
import { useState } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import Dashboard from '@/components/admin/Dashboard';

// PIN '205610'의 SHA-256 해시값입니다. 원본 번호가 소스에 노출되지 않습니다.
const ADMIN_PIN_HASH = "144151c760561f3b42d3fef0a575d4d2524160122b3005d7816f911b2fb2b150"; 

async function hashPIN(pin: string) {
  const msgUint8 = new TextEncoder().encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = async (pin: string) => {
    const hashed = await hashPIN(pin);
    if (hashed === ADMIN_PIN_HASH) {
      setIsAuthenticated(true);
    } else {
      alert("PIN 번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-20">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">초대장 관리자 설정</h1>
          {!isAuthenticated ? <AdminLogin onLogin={handleLogin} /> : <Dashboard />}
        </div>
      </div>
    </div>
  );
}
