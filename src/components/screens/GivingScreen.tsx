import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShieldCheck, PieChart, X, Copy, Check, ExternalLink, Building2 } from 'lucide-react';

const ACCOUNT = {
  bank: '하나은행',
  number: '247-910008-73704',
  holder: '해외아웃리치 4',
};

const givingItems = [
  {
    id: 'meals',
    title: '마을 어린이 급식 600인분',
    desc: '영양가 있는 따뜻한 밥 한 끼가 아이들에게는 사랑의 증거가 됩니다.',
    image: `${import.meta.env.BASE_URL}item_meals.png`
  },
  {
    id: 'basketball',
    title: '농구공 선물 20개',
    desc: '스포츠를 통해 아이들의 굳은 마음을 열고, 건강한 교제를 나눕니다.',
    image: `${import.meta.env.BASE_URL}item_basketball.png`
  },
  {
    id: 'supplies',
    title: '차세대 활동 물품',
    desc: '그림 도구, 시트 등 다양한 활동 물품으로 아이들의 꿈을 칠해줍니다.',
    image: `${import.meta.env.BASE_URL}item_supplies.png`
  },
  {
    id: 'blessing',
    title: '선교사님 블레싱',
    desc: '척박한 환경에서 묵묵히 헌신하시는 현지 선교사님 가정을 힘껏 위로합니다.',
    image: `${import.meta.env.BASE_URL}item_blessing.png`
  },
  {
    id: 'healing',
    title: '현지 청년들을 위한 힐링캠프',
    desc: '필리핀의 미래를 책임질 청년들이 영적으로 회복되는 1박 2일 캠프를 지원합니다.',
    image: `${import.meta.env.BASE_URL}item_healing.png`
  }
];

interface DonationModalProps {
  item: typeof givingItems[0];
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ACCOUNT.number).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleToss = () => {
    // Toss deep link for sending money
    const tossUrl = `supertoss://send?bank=${encodeURIComponent(ACCOUNT.bank)}&accountNo=${ACCOUNT.number.replace(/-/g, '')}&origin=qr`;
    window.location.href = tossUrl;
    // Fallback to Toss web after short delay
    setTimeout(() => {
      window.open('https://toss.im', '_blank');
    }, 1500);
  };

  const handleKakaoPay = () => {
    window.open('https://kakaopay.com', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="bg-white rounded-t-[32px] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs text-primary-600 font-bold uppercase tracking-widest mb-1">후원 항목</p>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition">
            <X size={18} />
          </button>
        </div>

        {/* Account Info Card */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-5 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Building2 size={16} className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">입금 은행</p>
              <p className="text-sm font-bold text-gray-900">{ACCOUNT.bank} · 예금주: {ACCOUNT.holder}</p>
            </div>
          </div>

          {/* Account Number */}
          <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200">
            <span className="text-xl font-bold tracking-wider text-gray-900">{ACCOUNT.number}</span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                copied
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? '복사됨!' : '복사'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            위 계좌번호로 이체 후 아멘 버튼을 눌러 동참을 알려주세요 🙏
          </p>
        </div>

        {/* Quick Transfer Buttons */}
        <p className="text-xs text-gray-400 font-medium text-center mb-3">송금 앱으로 바로 이동</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleToss}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition active:scale-95"
            style={{ background: 'linear-gradient(135deg, #0064FF, #0052CC)' }}
          >
            <ExternalLink size={15} />
            토스(Toss)
          </button>
          <button
            onClick={handleKakaoPay}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition active:scale-95"
            style={{ background: '#FEE500', color: '#3C1E1E' }}
          >
            <ExternalLink size={15} />
            카카오페이
          </button>
        </div>

        <p className="text-[11px] text-gray-300 text-center">
          앱이 설치되어 있지 않으면 웹페이지로 이동합니다
        </p>
      </motion.div>
    </motion.div>
  );
};

const GivingScreen: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<typeof givingItems[0] | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 pb-12 flex flex-col min-h-full"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">후원하기</h2>
        <p className="text-gray-500 text-sm">보내주신 사랑은 현지 사역과 아이들의 미래를 위해 딱 맞는 곳에 투명하게 사용됩니다.</p>
      </div>

      {/* Main Stats Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 border border-gray-50"
      >
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-gray-500 mb-1">현재 모금액</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl font-bold text-gray-900">8,500,000</span>
            <span className="text-lg font-bold text-gray-400">원</span>
          </div>
          <p className="text-xs text-primary-600 font-medium mt-2">목표액 1,000만원 중 85% 달성</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary-500"></span>
              <span className="text-gray-700 font-medium">어린이 사역 비용</span>
            </div>
            <span className="text-gray-900 font-bold">45%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-400"></span>
              <span className="text-gray-700 font-medium">의료/이용 봉사</span>
            </div>
            <span className="text-gray-900 font-bold">30%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-300"></span>
              <span className="text-gray-700 font-medium">현지 교회 지원</span>
            </div>
            <span className="text-gray-900 font-bold">25%</span>
          </div>
        </div>
        
        <div className="h-2 w-full flex rounded-full overflow-hidden mt-6 bg-gray-100">
          <div className="h-full bg-primary-500" style={{ width: '45%' }}></div>
          <div className="h-full bg-blue-400" style={{ width: '30%' }}></div>
          <div className="h-full bg-orange-300" style={{ width: '25%' }}></div>
        </div>
      </motion.div>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 mb-8 text-center text-gray-500">
        <div className="flex flex-col items-center">
          <div className="bg-primary-50 p-2 rounded-full text-primary-600 mb-2">
            <ShieldCheck size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase">투명한 재정</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-blue-50 p-2 rounded-full text-blue-500 mb-2">
            <Heart size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase">100% 현지 사용</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-orange-50 p-2 rounded-full text-orange-400 mb-2">
            <PieChart size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase">매주 결산 보고</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">도움이 필요한 곳</h3>
      </div>

      {/* Giving Items Catalog */}
      <div className="space-y-5">
        {givingItems.map((item, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            key={item.id} 
            className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 flex flex-col"
          >
            <div className="h-40 w-full relative">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="mb-4 flex-1">
                <h4 className="text-[17px] font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
              
              <button
                onClick={() => setSelectedItem(item)}
                className="w-full bg-primary-600 text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-[0_4px_12px_rgba(22,163,74,0.3)]"
              >
                <Heart size={16} className="fill-white/30" />
                사랑 흘려보내기
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Donation Modal */}
      <AnimatePresence>
        {selectedItem && (
          <DonationModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GivingScreen;
