import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin, Users } from 'lucide-react';

const scheduleData = [
  {
    day: 'Day 1',
    date: '8월 14일 (금)',
    title: '출국 및 현지 도착',
    status: 'completed',
    details: [
      { id: 1, time: '05:00', task: '공항도착 및 탑승수속' },
      { id: 2, time: '08:00', task: '국제선 탑승 (7:50am)' },
      { id: 3, time: '13:00', task: '국내선 탑승 (13:50pm)' },
      { id: 4, time: '15:00', task: '짐찾기 및 숙소 이동' },
      { id: 5, time: '20:00', task: '전체모임 (2일차 사역 준비)', icon: Users },
    ]
  },
  {
    day: 'Day 2',
    date: '8월 15일 (토)',
    title: '어린이 사역 (빠꼬/오가오 마을)',
    status: 'current',
    details: [
      { id: 6, time: '08:00', task: '사역지 이동 및 경건회' },
      { id: 7, time: '09:00', task: '어린이 사역 (빠꼬 마을)', icon: MapPin },
      { id: 8, time: '13:00', task: '어린이 사역 (오가오 마을)', icon: MapPin },
      { id: 9, time: '20:00', task: '나눔 (3일차 사역 준비)' },
    ]
  },
  {
    day: 'Day 3',
    date: '8월 16일 (주일)',
    title: '주일 예배 및 청년 사역',
    status: 'upcoming',
    details: [
      { id: 10, time: '09:00', task: '주일 예배 (구밧장로교회)' },
      { id: 11, time: '13:00', task: '청년 사역 (구밧교회)', icon: Users },
      { id: 12, time: '20:00', task: '나눔 (4일차 사역 준비)' },
    ]
  },
  {
    day: 'Day 4',
    date: '8월 17일 (월)',
    title: '마을 보수 및 어린이 사역',
    status: 'upcoming',
    details: [
      { id: 13, time: '09:00', task: '마을 보수' },
      { id: 14, time: '15:00', task: '어린이 사역 (코곤 마을)', icon: MapPin },
      { id: 15, time: '20:00', task: '저녁 예배 및 나눔' },
    ]
  },
  {
    day: 'Day 5',
    date: '8월 18일 (화)',
    title: '자유시간 및 귀국',
    status: 'upcoming',
    details: [
      { id: 16, time: '08:30', task: '자유시간' },
      { id: 17, time: '13:00', task: '공항 이동 (국내선 탑승)' },
      { id: 18, time: '21:00', task: '국제선 탑승 (대한항공/아시아나)' },
    ]
  }
];

const ScheduleScreen: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 pb-12"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">사역 일정</h2>
        <p className="text-gray-500 text-sm">보내주신 후원금이 어떻게 쓰이는지 현장의 일정을 투명하게 공유합니다.</p>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        {scheduleData.map((day, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            key={day.day} 
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            {/* Timeline dot */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2
              ${day.status === 'completed' ? 'bg-primary-500 text-white' : 
                day.status === 'current' ? 'bg-white border-primary-500 text-primary-500 ring-2 ring-primary-100 ring-offset-2' : 
                'bg-gray-100 text-gray-400'}`}
            >
              <span className="text-xs font-bold">{index + 1}</span>
            </div>
            
            {/* Card */}
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600">{day.day}</span>
                <span className="text-xs text-gray-400 font-medium">{day.date}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{day.title}</h3>
              
              <ul className="space-y-3">
                {day.details.map((detail) => {
                  const Icon = detail.icon || ChevronRight;
                  return (
                    <li key={detail.id} className="flex items-start text-sm group/item">
                      <div className="mt-0.5 mr-2 text-gray-300 group-hover/item:text-primary-500 transition-colors">
                        <Icon size={14} />
                      </div>
                      <div>
                        <span className="text-gray-900 font-medium block">{detail.task}</span>
                        <span className="text-gray-400 text-xs">{detail.time}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
              
              {day.status === 'current' && (
                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-2">
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
    </motion.div>
  );
};

export default ScheduleScreen;
