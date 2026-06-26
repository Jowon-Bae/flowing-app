import React, { useState, useEffect } from 'react';
import loadBg from '../assets/load.jpg';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

const PRAYER_TOPICS = [
  "1. 하나님 아버지, 오늘 하루도 주님의 은혜 안에서 살게 하소서.",
  "2. 우리 아웃리치 팀이 성령으로 하나되어 맡겨진 사역을 잘 감당하게 하소서.",
  "3. 만나는 영혼들에게 그리스도의 사랑을 진실하게 전할 수 있는 용기를 주소서.",
  "4. 현지 사역자들과 교회가 든든히 세워지며, 지속적인 부흥이 있게 하소서.",
  "5. 모든 팀원들의 건강과 안전을 지켜주시고 기쁨으로 섬기게 하소서."
];

export default function OutreachHomeScreen({ name, onBackToTeamSelection }) {
  const [completedTopics, setCompletedTopics] = useState([]);
  
  // 날짜 구하기
  const today = new Date();
  const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  const toggleTopic = (index) => {
    if (completedTopics.includes(index)) {
      setCompletedTopics(completedTopics.filter(i => i !== index));
    } else {
      setCompletedTopics([...completedTopics, index]);
    }
  };

  const isAllCompleted = completedTopics.length === PRAYER_TOPICS.length;

  return (
    <div 
      className="outreach-home-screen"
      style={{
        backgroundImage: `url(${loadBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingTop: '20px'
      }}>
        <button 
          onClick={onBackToTeamSelection}
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            padding: '8px 12px',
            borderRadius: '20px',
            backdropFilter: 'blur(5px)'
          }}
        >
          <ArrowLeft size={16} />
          팀 선택
        </button>
        <div style={{ fontSize: '14px', opacity: 0.9 }}>{dateString}</div>
      </div>

      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: '30px 20px',
        borderRadius: '24px',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '20px'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          marginBottom: '8px',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          {name}님,
        </h1>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '400', 
          opacity: 0.9,
          marginBottom: '32px'
        }}>
          오늘도 함께 기도해요 🙏
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {PRAYER_TOPICS.map((topic, index) => {
            const isCompleted = completedTopics.includes(index);
            return (
              <div 
                key={index}
                onClick={() => toggleTopic(index)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: isCompleted ? 'rgba(74, 144, 226, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: isCompleted ? '1px solid rgba(74, 144, 226, 0.5)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ marginTop: '2px', color: isCompleted ? '#4A90E2' : 'rgba(255,255,255,0.5)' }}>
                  {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <div style={{ 
                  flex: 1, 
                  fontSize: '15px', 
                  lineHeight: '1.5',
                  color: isCompleted ? 'rgba(255,255,255,0.7)' : '#fff',
                  textDecoration: isCompleted ? 'line-through' : 'none'
                }}>
                  {topic}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isAllCompleted && (
        <div style={{
          backgroundColor: '#4A90E2',
          padding: '20px',
          borderRadius: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
          animation: 'fadeIn 0.5s ease'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
            오늘의 기도를 완료하셨습니다! 🎉
          </h3>
        </div>
      )}
    </div>
  );
}
