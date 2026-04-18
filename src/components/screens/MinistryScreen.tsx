import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin, Users, ArrowLeft } from 'lucide-react';

// ────── Schedule Data ──────
const scheduleData = [
  {
    day: 'Day 1', date: '8월 14일 (금)', title: '출국 및 현지 도착', status: 'completed',
    details: [
      { id: 1, time: '05:00', task: '공항도착 및 탑승수속' },
      { id: 2, time: '08:00', task: '국제선 탑승 (7:50am)' },
      { id: 3, time: '13:00', task: '국내선 탑승 (13:50pm)' },
      { id: 4, time: '15:00', task: '짐찾기 및 숙소 이동' },
      { id: 5, time: '20:00', task: '전체모임 (2일차 사역 준비)', icon: Users },
    ]
  },
  {
    day: 'Day 2', date: '8월 15일 (토)', title: '어린이 사역 (빠꼬/오가오 마을)', status: 'current',
    details: [
      { id: 6, time: '08:00', task: '사역지 이동 및 경건회' },
      { id: 7, time: '09:00', task: '어린이 사역 (빠꼬 마을)', icon: MapPin },
      { id: 8, time: '13:00', task: '어린이 사역 (오가오 마을)', icon: MapPin },
      { id: 9, time: '20:00', task: '나눔 (3일차 사역 준비)' },
    ]
  },
  {
    day: 'Day 3', date: '8월 16일 (주일)', title: '주일 예배 및 청년 사역', status: 'upcoming',
    details: [
      { id: 10, time: '09:00', task: '주일 예배 (구밧장로교회)' },
      { id: 11, time: '13:00', task: '청년 사역 (구밧교회)', icon: Users },
      { id: 12, time: '20:00', task: '나눔 (4일차 사역 준비)' },
    ]
  },
  {
    day: 'Day 4', date: '8월 17일 (월)', title: '마을 보수 및 어린이 사역', status: 'upcoming',
    details: [
      { id: 13, time: '09:00', task: '마을 보수' },
      { id: 14, time: '15:00', task: '어린이 사역 (코곤 마을)', icon: MapPin },
      { id: 15, time: '20:00', task: '저녁 예배 및 나눔' },
    ]
  },
  {
    day: 'Day 5', date: '8월 18일 (화)', title: '자유시간 및 귀국', status: 'upcoming',
    details: [
      { id: 16, time: '08:30', task: '자유시간' },
      { id: 17, time: '13:00', task: '공항 이동 (국내선 탑승)' },
      { id: 18, time: '21:00', task: '국제선 탑승 (대한항공/아시아나)' },
    ]
  }
];

// ────── Ministry Story Cards ──────
const BASE = import.meta.env.BASE_URL;

const ministryItems = [
  {
    id: 'meals', title: '마을 전도 및 피딩 사역', image: `${BASE}item_meals.png`,
    subtitle: '배고픔이 없는 하루를 선물합니다',
    body: '빠꼬, 오가오, 코곤 마을의 어린이들 600여 명에게 따뜻한 밥 한 끼를 나눕니다. 음식을 나누는 그 짧은 순간이 하나님의 사랑을 먹이는 가장 직접적인 방법입니다.',
    highlights: ['3개 마을 어린이 약 600명 대상', '균형 잡힌 식단 제공', '현지 어머니 봉사단과 함께 직접 조리'],
  },
  {
    id: 'basketball', title: '농구 경기를 통한 교제 및 전도', image: `${BASE}item_basketball.png`,
    subtitle: '공 하나로 열리는 마음의 문',
    body: '필리핀 아이들에게 농구는 전국민적 스포츠입니다. 농구 경기를 함께하며 낯선 선교팀과 아이들 사이의 거리를 단숨에 좁혀, 자연스럽게 복음을 전하는 시간이 됩니다.',
    highlights: ['농구공 20개 현지 마을에 영구 기증', '사역 기간 중 아이들과 농구 대회 진행', '스포츠를 통한 자연스러운 복음 전도'],
  },

  {
    id: 'blessing', title: '선교사님 블레싱', image: `${BASE}item_blessing.png`,
    subtitle: '보내는 자가 드리는 감사의 마음',
    body: '이번 아웃리치를 가능하게 해 주시는 현지 선교사님 가정을 위로합니다. "당신의 헌신을 우리가 알고 있고, 함께합니다"라는 공동체의 마음을 생필품과 감사 편지로 전합니다.',
    highlights: ['현지 사역 선교사님 가정 대상', '생필품 및 식료품 패키지 준비', '팀 전체가 함께 감사 편지 작성'],
  },
  {
    id: 'healing', title: '현지 청년들을 위한 힐링캠프', image: `${BASE}item_healing.png`,
    subtitle: '다음 세대가 일어나는 캠프',
    body: '구밧 교회와 연계된 현지 청년 20~30명을 대상으로 1박 2일 힐링캠프를 진행합니다. 취업난, 가난, 가족 해체 속에서 지쳐있는 필리핀 청년들이 하나님 안에서 회복되도록 돕습니다.',
    highlights: ['현지 청년 20~30명 대상 1박 2일 진행', '워십, 말씀, 나눔, 비전 특강 프로그램', '서울드림 청년팀과 현지 청년팀의 연합 예배'],
  },
];

// ────── Detail Page ──────
interface DetailProps {
  item: typeof ministryItems[0];
  onBack: () => void;
}
const MinistryDetail: React.FC<DetailProps> = ({ item, onBack }) => (
  <motion.div
    initial={{ opacity: 0, x: 60 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 60 }}
    transition={{ type: 'spring', damping: 28, stiffness: 320 }}
    className="absolute inset-0 bg-white z-30 overflow-y-auto no-scrollbar pb-16"
  >
    <div className="relative h-60 w-full">
      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <button onClick={onBack} className="absolute top-5 left-5 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white">
        <ArrowLeft size={18} />
      </button>
      <div className="absolute bottom-5 left-5 right-5">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">사역 소개</p>
        <h1 className="text-white text-2xl font-bold leading-tight">{item.title}</h1>
      </div>
    </div>
    <div className="px-6 pt-6">
      <p className="text-primary-600 font-bold text-[15px] mb-4">{item.subtitle}</p>
      <p className="text-gray-600 text-[15px] leading-relaxed mb-6">{item.body}</p>
      <div className="bg-primary-50 rounded-2xl p-5">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">📌 주요 내용</h3>
        <ul className="space-y-2.5">
          {item.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </motion.div>
);

// ────── Main MinistryScreen ──────
const MinistryScreen: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<typeof ministryItems[0] | null>(null);

  return (
    <div className="relative h-full">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="p-6 pb-12 min-h-full overflow-y-auto no-scrollbar"
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">사역 소개</h2>
          <p className="text-gray-500 text-sm">2026 필리핀 아웃리치의 일정과 사역 현장을 소개합니다.</p>
        </div>

        {/* ── Schedule Timeline ── */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900">사역 일정</h3>
        </div>
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent mb-10">
          {scheduleData.map((day, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={day.day}
              className="relative flex items-start"
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 ${
                day.status === 'completed' ? 'bg-primary-500 text-white' :
                day.status === 'current' ? 'bg-white border-primary-500 text-primary-500 ring-2 ring-primary-100 ring-offset-2' :
                'bg-gray-100 text-gray-400'}`}
              >
                <span className="text-xs font-bold">{index + 1}</span>
              </div>
              <div className="ml-4 flex-1 shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-600">{day.day}</span>
                  <span className="text-xs text-gray-400 font-medium">{day.date}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-3">{day.title}</h3>
                <ul className="space-y-2">
                  {day.details.map((detail) => {
                    const Icon = detail.icon || ChevronRight;
                    return (
                      <li key={detail.id} className="flex items-start text-sm">
                        <div className="mt-0.5 mr-2 text-gray-300"><Icon size={14} /></div>
                        <div>
                          <span className="text-gray-900 font-medium block">{detail.task}</span>
                          <span className="text-gray-400 text-xs">{detail.time}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {day.status === 'current' && (
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                    </div>
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest">현재 진행중</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Ministry Stories ── */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">사역 현장</h3>
          <p className="text-xs text-gray-400 mt-1">카드를 눌러 자세히 알아보세요</p>
        </div>
        <div className="space-y-4">
          {ministryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index }}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="h-36 w-full relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                  <ChevronRight size={14} className="text-white" />
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-900 text-[15px] mb-1">{item.title}</h4>
                <p className="text-sm text-gray-500 text-primary-600 font-medium">{item.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <MinistryDetail item={selectedItem} onBack={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MinistryScreen;
