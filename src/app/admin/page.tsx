'use client';
import { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import Dashboard from '@/components/admin/Dashboard';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

const ALLOWED_UIDS = [
  'IoOreUkeKPXW0eJmjzbUVgr9MbF2',
  'Vk7vmq06ZffYHZKc8yoooigfHIc2'
];

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (ALLOWED_UIDS.includes(currentUser.uid)) {
          setUser(currentUser);
          setAccessDenied(false);
        } else {
          // Log out unauthorized users
          signOut(auth);
          setUser(null);
          setAccessDenied(true);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-20">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">초대장 관리자 설정</h1>
            {user && (
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-800 underline">
                로그아웃
              </button>
            )}
          </div>
          
          {!user ? (
            <>
              {accessDenied && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                  접근 권한이 없는 계정입니다.
                </div>
              )}
              <AdminLogin onSuccess={() => {}} />
            </>
          ) : (
            <Dashboard />
          )}
        </div>
      </div>
    </div>
  );
}
