import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export interface GivingItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  detail: {
    subtitle: string;
    body: string;
    gallery: string[];     // additional image paths
    highlights: string[]; // bullet point highlights
  };
}

const BASE = import.meta.env.BASE_URL;

export const givingItems: GivingItem[] = [
  {
    id: 'meals',
    title: '마을 어린이 급식 600인분',
    desc: '영양가 있는 따뜻한 밥 한 끼가 아이들에게는 사랑의 증거가 됩니다.',
    image: `${BASE}item_meals.png`,
    detail: {
      subtitle: '배고픔이 없는 하루를 선물합니다',
      body: '빠꼬, 오가오, 코곤 마을의 어린이들 600여 명은 매일 충분한 영양을 섭취하지 못하는 환경에서 자라고 있습니다. 이번 아웃리치를 통해 우리는 사역 기간 동안 이 아이들에게 따뜻하고 든든한 한 끼를 대접할 계획입니다.\n\n쌀, 고기, 야채가 골고루 담긴 식판 하나가 아이들의 눈을 빛나게 합니다. 음식을 나누는 그 짧은 순간이, 하나님의 사랑을 먹이는 가장 직접적인 방법입니다.',
      gallery: [`${BASE}item_meals.png`],
      highlights: [
        '3개 마을 어린이 약 600명 대상',
        '쌀, 단백질, 채소가 포함된 균형 잡힌 식단 제공',
        '현지 어머니 봉사團과 함께 직접 조리',
        '식사 후 복음성가 및 놀이 시간 병행',
      ],
    },
  },
  {
    id: 'basketball',
    title: '농구공 선물 20개',
    desc: '스포츠를 통해 아이들의 굳은 마음을 열고, 건강한 교제를 나눕니다.',
    image: `${BASE}item_basketball.png`,
    detail: {
      subtitle: '공 하나로 열리는 마음의 문',
      body: '필리핀 아이들에게 농구는 단순한 운동이 아닙니다. 전국민적 스포츠인 만큼, 농구공 하나가 낯선 선교팀과 아이들 사이의 거리를 단숨에 좁혀 줍니다.\n\n마을에 남겨지는 20개의 새 농구공은 우리가 떠난 뒤에도 오랫동안 아이들과 함께 남을 선물입니다. 공을 튀기며 뛰어놀 때마다, "사랑이 이 마을을 지나갔다"는 것을 기억하게 될 것입니다.',
      gallery: [`${BASE}item_basketball.png`],
      highlights: [
        '농구공 20개 현지 마을에 영구 기증',
        '사역 기간 중 아이들과 함께하는 농구 대회 진행',
        '스포츠를 통한 자연스러운 복음 전도',
        '팀원들과의 유대감 형성에 효과적',
      ],
    },
  },
  {
    id: 'supplies',
    title: '차세대 활동 물품',
    desc: '그림 도구, 시트 등 다양한 활동 물품으로 아이들의 꿈을 칠해줍니다.',
    image: `${BASE}item_supplies.png`,
    detail: {
      subtitle: '아이들의 꿈을 위한 물감 한 통',
      body: '어린이 성경학교(VBS) 프로그램을 위해서는 다양한 활동 물품이 필요합니다. 크레파스, 물감, 색종이, 공예 재료, 스티커 등 아이들이 말씀을 보고 듣고 만지며 경험할 수 있도록 돕는 소품들입니다.\n\n이 물품들은 단순한 소모품이 아닙니다. 아이들이 직접 손으로 만들고 색칠하는 과정에서 창의성과 성취감이 싹트고, 완성된 작품을 집으로 가져가며 그날의 말씀을 오랫동안 기억하게 됩니다.',
      gallery: [`${BASE}item_supplies.png`],
      highlights: [
        '크레파스, 물감, 색종이, 공예 재료 세트 구성',
        '총 3개 마을 어린이 성경학교(VBS)에 활용',
        '말씀 암기 카드, 활동 시트 포함',
        '사역 후 남은 물품은 현지 교회 주일학교에 기증',
      ],
    },
  },
  {
    id: 'blessing',
    title: '선교사님 블레싱',
    desc: '척박한 환경에서 묵묵히 헌신하시는 현지 선교사님 가정을 힘껏 위로합니다.',
    image: `${BASE}item_blessing.png`,
    detail: {
      subtitle: '보내는 자가 드리는 감사의 마음',
      body: '이번 아웃리치를 현지에서 가능하게 해 주시는 선교사님 가정이 계십니다. 언어적, 문화적 장벽을 넘어 수년간 그 땅에서 묵묵히 씨앗을 뿌리신 분들입니다.\n\n선교사님과 그 가족에게 드리는 블레싱은 단순한 물질 이상의 의미입니다. "당신의 헌신을 우리가 알고 있고, 함께합니다"라는 교회 공동체의 마음입니다. 생필품, 식료품, 소정의 사례금을 정성껏 준비하여 감사와 위로를 전할 예정입니다.',
      gallery: [`${BASE}item_blessing.png`],
      highlights: [
        '현지 사역 선교사님 가정 대상',
        '생필품 및 식료품 패키지 준비',
        '팀 전체가 함께 감사 편지 작성',
        '사역지 연결 및 현지 통역 지원에 대한 감사',
      ],
    },
  },
  {
    id: 'healing',
    title: '현지 청년들을 위한 힐링캠프',
    desc: '필리핀의 미래를 책임질 청년들이 영적으로 회복되는 1박 2일 캠프를 지원합니다.',
    image: `${BASE}item_healing.png`,
    detail: {
      subtitle: '다음 세대가 일어나는 캠프',
      body: '구밧 교회와 연계된 현지 청년 20~30명을 대상으로 1박 2일의 힐링캠프를 진행합니다. 취업난, 가난, 가족 해체 등의 문제 속에서 지쳐있는 필리핀 청년들이 하나님 안에서 회복되고, 미래를 향한 소망을 다시 품을 수 있도록 돕는 것이 이 캠프의 목적입니다.\n\n워십, 나눔, 체육 활동, 비전 강의 등으로 알차게 구성된 이 캠프는 서울드림교회 청년팀과 현지 청년들이 국경을 넘어 함께 예배하는 특별한 시간이 될 것입니다.',
      gallery: [`${BASE}item_healing.png`],
      highlights: [
        '현지 청년 20~30명 대상 1박 2일 진행',
        '워십, 말씀, 나눔, 비전 특강 프로그램',
        '서울드림 청년팀과 현지 청년팀의 연합 예배',
        '캠프 후 현지 교회 셀 그룹 연결 추진',
      ],
    },
  },
];

// ────────────────────────────────────────────────────
// Image Gallery component (simple prev/next)
// ────────────────────────────────────────────────────
const Gallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [idx, setIdx] = useState(0);
  if (images.length === 0) return null;
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className="relative rounded-2xl overflow-hidden mb-6 bg-gray-100">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={images[idx]}
          alt=""
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="w-full h-56 object-cover"
        />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-white scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────
// GivingDetailScreen
// ────────────────────────────────────────────────────
interface GivingDetailProps {
  item: GivingItem;
  onBack: () => void;
  onDonate: (item: GivingItem) => void;
}

const GivingDetailScreen: React.FC<GivingDetailProps> = ({ item, onBack, onDonate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      className="absolute inset-0 bg-white z-30 overflow-y-auto no-scrollbar pb-32"
    >
      {/* Hero Image */}
      <div className="relative h-64 w-full">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-5 left-5 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">후원 항목</p>
          <h1 className="text-white text-2xl font-bold leading-tight">{item.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6">
        {/* Subtitle */}
        <p className="text-primary-600 font-bold text-[15px] mb-4">{item.detail.subtitle}</p>

        {/* Gallery */}
        <Gallery images={item.detail.gallery} />

        {/* Body Text */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">사역 소개</h2>
          <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">{item.detail.body}</p>
        </div>

        {/* Highlights */}
        <div className="bg-primary-50 rounded-2xl p-5 mb-8">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">📌 주요 내용</h3>
          <ul className="space-y-2.5">
            {item.detail.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sticky Donate Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 pb-8 pt-4 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={() => onDonate(item)}
          className="w-full bg-primary-600 text-white rounded-2xl py-4 font-bold text-base shadow-[0_4px_16px_rgba(22,163,74,0.35)] flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <Heart size={18} className="fill-white/30" />
          이 사역을 위해 사랑 흘려보내기
        </button>
      </div>
    </motion.div>
  );
};

export { GivingDetailScreen };
