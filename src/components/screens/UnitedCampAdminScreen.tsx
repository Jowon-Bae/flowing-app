import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'framer-motion';

interface UnitedCampAdminScreenProps {
  teamType: 'outreach' | 'intercessory';
  onBack: () => void;
}

interface PrayerRecord {
  id: string;
  name: string;
  note: string;
  duration: number;
  date: string;
}

const UnitedCampAdminScreen: React.FC<UnitedCampAdminScreenProps> = ({ teamType, onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [records, setRecords] = useState<PrayerRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'flowing_prayers')
      );
      const snapshot = await getDocs(q);
      const fetchedRecords: PrayerRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.teamType === teamType) {
          fetchedRecords.push({ id: docSnap.id, ...data } as PrayerRecord);
        }
      });
      // Sort by date descending
      fetchedRecords.sort((a, b) => b.date.localeCompare(a.date));
      setRecords(fetchedRecords);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecords();
    }
  }, [isAuthenticated, teamType]);

  const handleLogin = () => {
    if (password === '0000') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'flowing_prayers', id));
        setRecords(prev => prev.filter(r => r.id !== id));
      } catch (err) {
        alert('삭제 실패: ' + err);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-900 border border-primary-500/30 rounded-[20px] p-8 w-full max-w-sm text-center shadow-2xl"
        >
          <div className="text-xl font-extrabold text-white mb-2">관리자 확인</div>
          <div className="text-[14px] text-gray-400 mb-6">관리자 비밀번호를 입력해주세요</div>
          
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            maxLength={10}
            placeholder="••••" 
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl py-3 text-center text-2xl tracking-[0.5em] text-white mb-3 focus:border-primary-500 focus:outline-none transition-colors"
          />
          {error && <div className="text-red-400 text-[13px] mb-4">{error}</div>}
          
          <div className="flex gap-3 mt-4">
            <button 
              onClick={onBack}
              className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 font-bold hover:bg-gray-800 transition-colors"
            >
              취소
            </button>
            <button 
              onClick={handleLogin}
              className="flex-1 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-[0_4px_12px_rgba(22,163,74,0.3)] transition-colors"
            >
              확인
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-20 bg-gray-50 text-gray-900 overflow-y-auto no-scrollbar">
      <div className="bg-white px-6 py-5 shadow-sm sticky top-0 z-20 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">관리자</div>
        <button onClick={() => setIsAuthenticated(false)} className="text-sm font-bold text-gray-400 hover:text-gray-600">
          ← 나가기
        </button>
      </div>

      <div className="p-6">
        <div className="bg-white border border-gray-100 rounded-[16px] p-5 shadow-sm">
          <div className="text-[15px] font-bold text-gray-800 mb-4">전체 기도 기록 관리 ({records.length}건)</div>
          
          {loading ? (
            <div className="text-center py-10 text-gray-400 font-medium">데이터를 불러오는 중...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-10 text-gray-400 font-medium">기록이 없습니다.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {records.map(record => (
                <div key={record.id} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px] font-bold text-gray-800">{record.name}</span>
                      <span className="text-[11px] text-gray-400">{record.date}</span>
                      <span className="text-[11px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">{Math.floor(record.duration / 60)}분</span>
                    </div>
                    {record.note && (
                      <div className="text-[13px] text-gray-600 truncate">{record.note}</div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(record.id)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitedCampAdminScreen;
