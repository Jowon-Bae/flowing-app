import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShieldCheck, PieChart, X, Copy, Check, ExternalLink, Building2, ChevronRight } from 'lucide-react';
import { givingItems, GivingDetailScreen } from './GivingDetailScreen';
import type { GivingItem } from './GivingDetailScreen';

const ACCOUNT = {
  bank: '하나은행',
  number: '247-910008-73704',
  holder: '해외아웃리치 4',
};

// ────────────────────────────────────────────────────
// Donation Bottom Sheet Modal
// ────────────────────────────────────────────────────
interface DonationModalProps {
  item: GivingItem;
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
    const tossUrl = `supertoss://send?bank=${encodeURIComponent(ACCOUNT.bank)}&accountNo=${ACCOUNT.number.replace(/-/g, '')}&origin=qr`;
    window.location.href = tossUrl;
    setTimeout(() => { window.open('https://toss.im', '_blank'); }, 1500);
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
        <div className="rounded-2xl mb-5 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)', fontFamily: "'Pretendard', sans-serif" }}>
          <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
            <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
              <Building2 size={14} className="text-white/80" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">입금 계좌</p>
              <p className="text-xs font-semibold text-white/80">{ACCOUNT.bank} · 예금주: {ACCOUNT.holder}</p>
            </div>
          </div>
          <div className="mx-5 h-px bg-white/10" />
          <div className="px-5 pt-4 pb-3">
            <p className="text-[20px] font-bold tracking-[0.12em] text-white whitespace-nowrap">{ACCOUNT.number}</p>
          </div>
          <div className="px-5 pb-5">
            <button
              onClick={handleCopy}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                copied ? 'bg-primary-500 text-white shadow-[0_0_16px_rgba(34,197,94,0.4)]' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? '복사 완료!' : '계좌번호 복사'}
            </button>
          </div>
        </div>

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
        <p className="text-[11px] text-gray-300 text-center">앱이 설치되어 있지 않으면 웹페이지로 이동합니다</p>
      </motion.div>
    </motion.div>
  );
};

// ────────────────────────────────────────────────────
// GivingScreen
// ────────────────────────────────────────────────────
const GivingScreen: React.FC = () => {
  const [donateItem, setDonateItem] = useState<GivingItem | null>(null);
  const [detailItem, setDetailItem] = useState<GivingItem | null>(null);

  return (
    <div className="relative h-full">
      {/* Main Giving List */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="p-6 pb-12 flex flex-col min-h-full overflow-y-auto no-scrollbar"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">후원하기</h2>
          <p className="text-gray-500 text-sm">보내주신 사랑은 현지 사역과 아이들의 미래를 위해 딱 맞는 곳에 투명하게 사용됩니다.</p>
        </div>

        {/* Stats Card */}
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
            {[
              { label: '어린이 사역 비용', pct: '45%', color: 'bg-primary-500' },
              { label: '의료/이용 봉사', pct: '30%', color: 'bg-blue-400' },
              { label: '현지 교회 지원', pct: '25%', color: 'bg-orange-300' },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${r.color}`} />
                  <span className="text-gray-700 font-medium">{r.label}</span>
                </div>
                <span className="text-gray-900 font-bold">{r.pct}</span>
              </div>
            ))}
          </div>
          <div className="h-2 w-full flex rounded-full overflow-hidden mt-6 bg-gray-100">
            <div className="h-full bg-primary-500" style={{ width: '45%' }} />
            <div className="h-full bg-blue-400" style={{ width: '30%' }} />
            <div className="h-full bg-orange-300" style={{ width: '25%' }} />
          </div>
        </motion.div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 mb-8 text-center text-gray-500">
          {[
            { Icon: ShieldCheck, label: '투명한 재정', bg: 'bg-primary-50', color: 'text-primary-600' },
            { Icon: Heart, label: '100% 현지 사용', bg: 'bg-blue-50', color: 'text-blue-500' },
            { Icon: PieChart, label: '매주 결산 보고', bg: 'bg-orange-50', color: 'text-orange-400' },
          ].map(({ Icon, label, bg, color }) => (
            <div key={label} className="flex flex-col items-center">
              <div className={`${bg} p-2 rounded-full ${color} mb-2`}>
                <Icon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase">{label}</span>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">도움이 필요한 곳</h3>
          <p className="text-xs text-gray-400 mt-1">항목을 눌러 더 자세히 알아보세요</p>
        </div>

        {/* Giving Items Catalog */}
        <div className="space-y-4">
          {givingItems.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index }}
              key={item.id}
              onClick={() => setDetailItem(item)}
              className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="h-40 w-full relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                  <ChevronRight size={14} className="text-white" />
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-4 flex-1">
                  <h4 className="text-[17px] font-bold text-gray-900 mb-1.5">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setDetailItem(item); }}
                    className="flex-1 bg-gray-50 text-gray-600 rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-1.5 transition hover:bg-gray-100"
                  >
                    자세히 보기
                    <ChevronRight size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDonateItem(item); }}
                    className="flex-1 bg-primary-600 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(22,163,74,0.3)] transition active:scale-95"
                  >
                    <Heart size={14} className="fill-white/30" />
                    사랑 흘려보내기
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Detail Page Overlay */}
      <AnimatePresence>
        {detailItem && (
          <GivingDetailScreen
            item={detailItem}
            onBack={() => setDetailItem(null)}
            onDonate={(item) => { setDonateItem(item); setDetailItem(null); }}
          />
        )}
      </AnimatePresence>

      {/* Donation Modal */}
      <AnimatePresence>
        {donateItem && (
          <DonationModal item={donateItem} onClose={() => setDonateItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GivingScreen;
