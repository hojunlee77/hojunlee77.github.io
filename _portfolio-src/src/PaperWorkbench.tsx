'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowCounterClockwise } from '@phosphor-icons/react';

const slips = [
  { id: 'A', title: '동작분석 장비' },
  { id: 'B', title: '사무용 가구' },
  { id: 'C', title: '고속 카메라' },
  { id: 'A', title: '동작분석 장비' },
  { id: 'D', title: '시설 유지보수' },
  { id: 'C', title: '고속 카메라' },
  { id: 'E', title: '교육 소프트웨어' },
];

export default function PaperWorkbench() {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);
  const [processed, setProcessed] = useState(false);
  const selected = useMemo(() => slips.filter(item => /동작분석|카메라/.test(item.title)).filter((item, index, all) => all.findIndex(other => other.id === item.id) === index), []);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const small = width < 600;
  const cardWidth = small ? 118 : 166;
  return (
    <div className="paper-workbench">
      <div className="paper-toolbar">
        <p>공고가 쌓이는 책상에서, <strong>필요한 알림만 남기기.</strong></p>
        <button className="paper-action" onClick={() => setProcessed(!processed)} aria-pressed={processed}>
          {processed ? <>다시 펼치기 <ArrowCounterClockwise size={17} /></> : <>종이 정리하기 <ArrowRight size={17} /></>}
        </button>
      </div>
      <div className="paper-stage" ref={stage}>
        <img className="paper-backdrop" src={`${import.meta.env.BASE_URL}assets/workbench.webp`} srcSet={`${import.meta.env.BASE_URL}assets/workbench-mobile.webp 640w, ${import.meta.env.BASE_URL}assets/workbench.webp 1254w`} sizes="(max-width: 767px) calc(100vw - 40px), 1320px" width="1254" height="1254" alt="종이와 금속 레일로 표현한 정리 작업실" fetchPriority="high" />
        <div className="paper-gate" aria-hidden="true" />
        {slips.map((item, index) => {
          const outputIndex = selected.findIndex(output => output.id === item.id);
          const isFirst = slips.findIndex(other => other.id === item.id) === index;
          const keep = outputIndex >= 0 && isFirst;
          const startX = small ? 12 + (index % 3) * 19 : 25 + (index % 3) * 58;
          const startY = 36 + (index % 4) * (small ? 32 : 39);
          const endX = keep ? width - cardWidth - (small ? 12 : 54) : startX;
          const endY = keep ? 54 + outputIndex * (small ? 95 : 90) : startY;
          return (
            <motion.div key={`${item.id}-${index}`} className={`paper-slip ${processed && keep ? 'paper-selected' : ''}`} aria-hidden="true"
              style={{ width: cardWidth, zIndex: processed && keep ? 12 : index + 1 }}
              animate={{ x: processed ? endX : startX, y: processed ? endY : startY, rotate: processed && keep ? 0 : [-12, 9, -5, 15, -8, 4, -14][index], opacity: processed && !keep ? 0.14 : 1, scale: processed && !keep ? 0.85 : 1 }}
              transition={{ duration: reduced ? 0 : 0.75, delay: reduced ? 0 : index * 0.035, ease: [0.22, 1, 0.36, 1] }}>
              <small>가상 공고 {item.id}</small><strong>{item.title}</strong>
            </motion.div>
          );
        })}
        <div className="paper-rule"><span>동작분석 · 카메라</span><p>키워드 선별<br />같은 공고는 한 번만</p></div>
        <p className="paper-count" aria-live="polite">{processed ? `7건 중 ${selected.length}건의 알림 준비` : '가상 공고 7건'}<span>{processed ? selected.map(item => item.title).join(' · ') : '버튼을 누르면 선별과 중복 제거가 실행됩니다.'}</span></p>
      </div>
      <p className="paper-caption">포트폴리오용 가상 공고입니다. 실제 API 호출이나 알림 발송은 하지 않습니다.</p>
    </div>
  );
}
