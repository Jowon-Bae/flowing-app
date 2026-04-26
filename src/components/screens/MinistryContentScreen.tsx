import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';

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
  {
    id: 'medical', title: '의료 선교 사역', image: `${BASE}item_medical.png`,
    subtitle: '치유의 손길로 전하는 복음',
    body: '의료 혜택을 받기 어려운 현지 마을 주민들을 찾아가 사랑으로 진료하며 하나님의 치유와 회복을 전합니다. 단순한 신체적 치료를 넘어 마음의 상처까지 보듬는 사역입니다.',
    highlights: ['의료 취약 지역 주민 대상 무료 진료', '기본 의약품 제공 및 건강 상담', '진료 대기 중 복음 제시 및 기도'],
  },
];

// ── Detail Page ──
interface DetailProps { item: typeof ministryItems[0]; onBack: () => void; }
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
        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">사역 내용</p>
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

// ── Main MinistryContentScreen ──
const MinistryContentScreen: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<typeof ministryItems[0] | null>(null);

  return (
    <div className="relative h-full">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="p-6 pb-12 min-h-full overflow-y-auto no-scrollbar"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">사역 내용</h2>
          <p className="text-gray-500 text-sm">각 사역 현장의 이야기를 소개합니다. 카드를 눌러보세요.</p>
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
              <div className="h-40 w-full relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                  <ChevronRight size={14} className="text-white" />
                </div>
                <div className="absolute bottom-3 left-4">
                  <h4 className="text-white font-bold text-[15px] drop-shadow-sm">{item.title}</h4>
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm text-primary-600 font-semibold">{item.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <MinistryDetail item={selectedItem} onBack={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MinistryContentScreen;
