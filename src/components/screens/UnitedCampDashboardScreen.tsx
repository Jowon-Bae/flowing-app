import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TEAM_MEMBERS } from '../../data/teamMembers';

interface UnitedCampDashboardScreenProps {
  teamType: 'outreach' | 'intercessory';
}

interface PrayerRecord {
  id: string;
  name: string;
  note: string;
  duration: number;
  date: string;
}

const TOTAL_GOAL_MINUTES = 21000; // From United Camp (70 teachers * 30 days * 10 mins)

const UnitedCampDashboardScreen: React.FC<UnitedCampDashboardScreenProps> = ({ teamType }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<PrayerRecord[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [myMinutes, setMyMinutes] = useState(0); 
  const [loading, setLoading] = useState(true);

  // Use localStorage to match name for "my minutes"
  const storedName = localStorage.getItem('flowing_outreach_name') || '';

  const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
  const displayDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'flowing_prayers'),
          where('date', '==', dateStr),
          where('teamType', '==', teamType)
        );
        const snapshot = await getDocs(q);
        const fetchedRecords: PrayerRecord[] = [];
        snapshot.forEach((doc) => {
          fetchedRecords.push({ id: doc.id, ...doc.data() } as PrayerRecord);
        });
        
        setRecords(fetchedRecords);

        // Fetch total minutes across ALL days for this team
        const qTotal = query(
          collection(db, 'flowing_prayers'),
          where('teamType', '==', teamType)
        );
        const totalSnap = await getDocs(qTotal);
        let totalSec = 0;
        let mySec = 0;
        totalSnap.forEach(doc => {
          const data = doc.data();
          totalSec += data.duration || 0;
          if (data.name === storedName) {
            mySec += data.duration || 0;
          }
        });
        setTotalMinutes(Math.floor(totalSec / 60));
        setMyMinutes(Math.floor(mySec / 60));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [dateStr, teamType, storedName]);

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const pct = Math.min(Math.round((totalMinutes / TOTAL_GOAL_MINUTES) * 100), 100);

  return (
    <div className="min-h-full pb-20 bg-gray-50 text-gray-900 overflow-y-auto no-scrollbar">
      <div className="bg-white px-6 py-5 shadow-sm sticky top-0 z-20 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">📊 기도 현황</div>
      </div>

      <div className="p-6">
        {/* Date Nav */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={() => changeDate(-1)} className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors">‹</button>
          <div className="text-[15px] font-bold text-gray-800">{displayDate}</div>
          <button onClick={() => changeDate(1)} className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors">›</button>
        </div>

        {/* Notes */}
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100 rounded-[16px] p-5 mb-5 shadow-sm">
          <div className="text-[14px] font-bold text-primary-800 mb-4">💬 오늘의 기도 한 문장</div>
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="text-sm text-gray-500 text-center py-2">불러오는 중...</div>
            ) : records.filter(r => r.note).length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-2">아직 남겨진 기도가 없습니다.</div>
            ) : (
              records.filter(r => r.note).map(record => (
                <div key={record.id} className="flex gap-3 items-start py-2 border-b border-primary-200/50 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                    {record.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] text-gray-500 mb-1">{record.name}</div>
                    <div className="text-[14px] text-gray-800 leading-snug">{record.note}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Teachers */}
        <div className="bg-white border border-gray-100 rounded-[16px] p-5 mb-5 shadow-sm">
          <div className="text-[14px] font-bold text-gray-800 mb-2">👩‍🏫 팀원 기도 현황</div>
          <div className="text-[13px] text-gray-500 mb-4">
            전체 {TEAM_MEMBERS.length}명 중 <span className="font-bold text-primary-600">{records.length}명</span>이 기도에 동참했습니다.
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {TEAM_MEMBERS.map((member, index) => {
              const hasPrayed = records.some(r => r.name === member);
              return (
                <div key={`${member}-${index}`} className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all ${
                    hasPrayed 
                      ? 'bg-gradient-to-br from-primary-600 to-primary-400 text-white border-2 border-primary-200' 
                      : 'bg-gray-200 text-gray-400 opacity-60'
                  }`}>
                    {member.charAt(0)}
                  </div>
                  <div className={`text-[12px] truncate w-full text-center ${hasPrayed ? 'font-bold text-gray-800' : 'font-medium text-gray-400'}`}>
                    {member}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="text-[14px] font-bold text-gray-800 mb-4 mt-8">⏱ 기도 시간 통계</div>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-white border border-gray-100 rounded-[16px] p-5 shadow-sm text-center">
            <div className="text-2xl font-extrabold text-primary-600 mb-1">{myMinutes}<span className="text-sm font-medium text-gray-500 ml-1">분</span></div>
            <div className="text-[12px] text-gray-500 font-medium">나의 누적 기도</div>
          </div>
          <div className="flex-1 bg-white border border-gray-100 rounded-[16px] p-5 shadow-sm text-center">
            <div className="text-2xl font-extrabold text-gray-800 mb-1">{totalMinutes}<span className="text-sm font-medium text-gray-500 ml-1">분</span></div>
            <div className="text-[12px] text-gray-500 font-medium">전체 누적 기도</div>
          </div>
        </div>

        {/* Thermometer */}
        <div className="bg-white border border-gray-100 rounded-[16px] p-6 shadow-sm mb-6 relative overflow-hidden backdrop-blur-md">
          <div className="text-[14px] font-bold text-gray-500 mb-6 text-center tracking-wide">🔥 기도 온도계</div>
          <div className="flex items-center justify-center gap-8">
            {/* Thermo tube */}
            <div className="relative w-12 h-40">
              <div className="absolute right-full mr-3 h-full flex flex-col justify-between text-[11px] text-gray-400 font-medium py-1">
                <span>목표</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
              </div>
              <div className="w-4 h-full bg-gray-100 rounded-t-full mx-auto relative z-10 shadow-inner">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-500 to-blue-400 rounded-t-full transition-all duration-1000"
                  style={{ height: `${pct}%` }}
                ></div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-primary-500 rounded-full z-20 shadow-md flex items-center justify-center">
                <div className="w-6 h-6 bg-white/30 rounded-full"></div>
              </div>
            </div>
            
            {/* Info */}
            <div className="text-center">
              <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-blue-500 mb-2 leading-none">
                {pct}%
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{totalMinutes}<span className="text-sm font-medium text-gray-500 ml-1">분</span></div>
              <div className="text-[13px] text-gray-400 mb-4">/ 목표 {TOTAL_GOAL_MINUTES}분</div>
              
              <div className="inline-block bg-gradient-to-r from-primary-100 to-blue-50 border border-primary-200 text-primary-800 text-[12px] font-bold px-4 py-2 rounded-full shadow-sm">
                우리의 기도가 쌓이고 있습니다!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitedCampDashboardScreen;
