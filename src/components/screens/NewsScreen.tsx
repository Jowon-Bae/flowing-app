import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, PenLine, X, Smile, ImagePlus, Trash2 } from 'lucide-react';
import { useNewsContext } from '../../context/NewsContext';

const EMOJIS = ['🙌', '🙏', '❤️', '✈️', '😊', '🌟', '📖', '🎉', '🌿', '🔥'];

// NewsScreen receives isAdmin flag from App.tsx
const NewsScreen: React.FC<{ isAdmin?: boolean }> = ({ isAdmin = false }) => {
  const { posts, addPost } = useNewsContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emoji, setEmoji] = useState('🙌');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      addPost(title, content, emoji, imagePreview ?? undefined);
      setTitle('');
      setContent('');
      setEmoji('🙌');
      setImagePreview(null);
      setIsModalOpen(false);
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setEmoji('🙌');
    setImagePreview(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 pb-12 flex flex-col min-h-full relative"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">현장 소식</h2>
        <p className="text-gray-500 text-sm">필리핀 현장에서 보내는 생생한 은혜를 확인하세요.</p>
      </div>

      {posts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-400 font-medium">아직 등록된 소식이 없습니다.</p>
          <p className="text-gray-300 text-sm mt-1">현지에서 첫 소식을 기다려 주세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * index }}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-gray-50"
            >
              {/* Photo if exists */}
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full object-cover max-h-56"
                />
              )}
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-xl shrink-0">
                    {post.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base leading-snug">{post.title}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">{post.time}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{post.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Admin Write FAB — only shown when in admin mode */}
      {isAdmin && (
        <motion.button
          drag
          dragMomentum={false}
          whileDrag={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-[0_4px_12px_rgba(22,163,74,0.4)] flex items-center justify-center z-40 touch-none"
          style={{ touchAction: 'none' }}
        >
          <PenLine size={22} />
        </motion.button>
      )}

      {/* Write Post Bottom Sheet */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
          >
            <div className="absolute inset-0" onClick={resetModal} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="bg-white rounded-t-[32px] p-6 shadow-xl relative z-10 max-h-[88dvh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Newspaper size={20} className="text-primary-600" />
                  현장 소식 작성
                </h3>
                <button onClick={resetModal} className="p-2 text-gray-400 bg-gray-50 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Emoji */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    <Smile size={14} /> 이모지 선택
                  </label>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {EMOJIS.map((e) => (
                      <button
                        key={e} type="button" onClick={() => setEmoji(e)}
                        className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition ${emoji === e ? 'bg-primary-100 ring-2 ring-primary-400' : 'bg-gray-50 hover:bg-gray-100'}`}
                      >{e}</button>
                    ))}
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    <ImagePlus size={14} /> 사진 첨부 (선택)
                  </label>
                  {imagePreview ? (
                    <div className="relative mt-2">
                      <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="mt-2 flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                      <ImagePlus size={24} className="text-gray-300 mb-1" />
                      <span className="text-xs text-gray-400">눌러서 사진 선택</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">제목</label>
                  <input
                    type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="소식 제목을 입력해주세요"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition"
                    required
                  />
                </div>

                {/* Content */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">내용</label>
                  <textarea
                    value={content} onChange={(e) => setContent(e.target.value)}
                    placeholder="현장에서의 은혜를 자유롭게 나눠주세요."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition min-h-[110px] resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!title.trim() || !content.trim()}
                  className="w-full bg-primary-600 text-white rounded-xl py-4 font-bold text-base disabled:opacity-50 disabled:bg-gray-400 transition"
                >
                  소식 올리기
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NewsScreen;
