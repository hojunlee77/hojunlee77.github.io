'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, ArrowsOut, Check,
  EnvelopeSimple, Funnel, Moon, Plus, Sun, X,
} from '@phosphor-icons/react';
import PaperWorkbench from './PaperWorkbench';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const ease = [0.22, 1, 0.36, 1] as const;
type ThemePreference = 'system' | 'light' | 'dark';

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    try {
      const saved = localStorage.getItem('junho-portfolio-theme');
      return saved === 'light' || saved === 'dark' ? saved : 'system';
    } catch { return 'system'; }
  });
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const dark = preference === 'dark' || (preference === 'system' && systemDark);

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    try { localStorage.setItem('junho-portfolio-theme', preference); } catch { /* Theme remains usable without storage. */ }
  }, [preference, dark]);

  return (
    <div className="theme-control">
      <button
        className="icon-button theme-toggle"
        aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
        aria-pressed={dark}
        onClick={() => setPreference(dark ? 'light' : 'dark')}
      >
        {dark ? <Sun size={19} /> : <Moon size={19} />}
      </button>
      {preference !== 'system' && <button className="system-reset" onClick={() => setPreference('system')}>시스템</button>}
    </div>
  );
}

function Hero() {
  const reduced = useReducedMotion();
  return (
    <section className="hero page-width" aria-labelledby="hero-title">
      <div className="hero-copy">
        <motion.p className="hero-intro" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          이준호 <span>B2B 기술영업 / 업무 자동화</span>
        </motion.p>
        <h1 id="hero-title">
          <span className="headline-line"><motion.span initial={reduced ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.08, ease }}>반복 업무를</motion.span></span>
          <span className="headline-line"><motion.span initial={reduced ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.2, ease }}>쓸 수 있는 <em>도구로.</em></motion.span></span>
        </h1>
        <motion.p className="hero-description" initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.4, ease }}>
          현업에서 문제를 찾고, AI 코딩 도구로 구현하고,<br className="desktop-break" /> 실제 실행 결과로 확인합니다.
        </motion.p>
        <motion.div className="hero-actions" initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.52, ease }}>
          <a className="button button-primary" href="#work">프로젝트 보기 <ArrowDown size={18} /></a>
          <a className="text-link" href="#experience">경력 보기 <ArrowRight size={19} /></a>
        </motion.div>
      </div>
      <div className="hero-art">
        <PaperWorkbench />
      </div>
    </section>
  );
}

type Bid = { id: string; title: string; organization: string };
// These are intentionally synthetic, local-only examples, unrelated to the operating metrics below.
const sampleBids: Bid[] = [
  { id: 'DEMO-A', title: '보행 동작분석 시스템 구매', organization: '가상 연구소' },
  { id: 'DEMO-B', title: '연구용 고속 카메라 구매', organization: '가상 대학교' },
  { id: 'DEMO-C', title: '연구장비 유지보수 용역', organization: '가상 연구소' },
  { id: 'DEMO-A', title: '보행 동작분석 시스템 구매', organization: '가상 연구소' },
  { id: 'DEMO-D', title: '사무용 가구 구매', organization: '가상 기관' },
  { id: 'DEMO-E', title: '교육용 소프트웨어 구매', organization: '가상 대학교' },
  { id: 'DEMO-B', title: '연구용 고속 카메라 구매', organization: '가상 대학교' },
];
const workflowSteps = ['공고 수집', '키워드 선별', '중복 확인', '알림 준비'];

function WorkflowDemo() {
  const reduced = useReducedMotion();
  const [keywordInput, setKeywordInput] = useState('동작분석, 카메라');
  const [phase, setPhase] = useState<'idle' | 'working' | 'done'>('idle');
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const keywords = useMemo(() => keywordInput.split(',').map(word => word.trim().toLocaleLowerCase()).filter(Boolean), [keywordInput]);
  const filtered = useMemo(() => sampleBids.filter(bid => keywords.some(word => bid.title.toLocaleLowerCase().includes(word))), [keywords]);
  const unique = useMemo(() => filtered.filter((bid, index, list) => list.findIndex(item => item.id === bid.id) === index), [filtered]);

  useEffect(() => {
    if (phase !== 'working') return;
    const timer = window.setTimeout(() => {
      if (step === 3) setPhase('done');
      else setStep(previous => previous + 1);
    }, reduced ? 100 : 480);
    return () => window.clearTimeout(timer);
  }, [phase, step, reduced]);

  const run = () => {
    if (!keywords.length) { setError('선별할 키워드를 하나 이상 입력해 주세요.'); return; }
    setError(''); setStep(0); setPhase('working');
  };
  const reset = () => { setKeywordInput('동작분석, 카메라'); setStep(0); setPhase('idle'); setError(''); };
  const visible = phase === 'idle' || step === 0 ? sampleBids : step === 1 ? filtered : unique;
  const counts = [sampleBids.length, filtered.length, unique.length, unique.length];

  return (
    <div className="workflow-demo">
      <div className="demo-topline"><Funnel size={21} weight="duotone" /><strong>검색을 알림으로 바꾸는 흐름</strong></div>
      <p className="demo-disclaimer">가상 공고를 사용하는 동작 예시</p>
      <form className="demo-form" onSubmit={event => { event.preventDefault(); run(); }}>
        <label htmlFor="demo-keywords">선별 키워드 <span>쉼표로 구분</span></label>
        <div className="demo-input-row">
          <input id="demo-keywords" value={keywordInput} disabled={phase === 'working'} onChange={event => { setKeywordInput(event.target.value); setPhase('idle'); setStep(0); setError(''); }} aria-describedby={error ? 'demo-error' : 'demo-help'} aria-invalid={Boolean(error)} />
          <button className="button button-primary demo-run" type="submit" disabled={phase === 'working'}>{phase === 'working' ? '실행 중' : '흐름 실행'} <ArrowRight size={18} /></button>
        </div>
        <p id="demo-help" className="demo-help">‘연구장비’나 ‘소프트웨어’로 바꾸어 보세요. 모든 처리는 이 페이지 안에서 실행됩니다.</p>
        {error && <p id="demo-error" className="demo-error" role="alert">{error}</p>}
      </form>
      <ol className="workflow-rail" aria-label="공고 처리 흐름">
        {workflowSteps.map((label, index) => (
          <li key={label} className={phase !== 'idle' && index <= step ? 'is-active' : ''} aria-current={phase === 'working' && index === step ? 'step' : undefined}>
            <span>{label}</span><b className="english">{phase !== 'idle' && index <= step ? counts[index] : <span aria-hidden="true">/</span>}</b>
          </li>
        ))}
      </ol>
      <div className="demo-result" aria-live="polite" aria-atomic="true">
        <div className="result-header">
          <strong>{phase === 'done' ? `${unique.length}건의 신규 알림 준비 완료` : phase === 'working' ? `${workflowSteps[step]} 중` : '수집할 가상 공고 7건'}</strong>
          {phase !== 'working' && <button className="reset-button" onClick={reset}>초기화</button>}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`${phase}-${step}-${keywordInput}`} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -6 }} transition={{ duration: 0.16 }}>
            {visible.length ? (
              <ul className="bid-list">
                {visible.slice(0, phase === 'done' ? 7 : 3).map((bid, index) => <li key={`${bid.id}-${index}`}><span className="bid-icon">{phase === 'done' ? <Check size={16} /> : <ArrowUpRight size={16} />}</span><span><b>{bid.title}</b><small>{bid.organization} <span className="english">{bid.id}</span></small></span></li>)}
              </ul>
            ) : <div className="demo-empty"><Funnel size={25} /><p>키워드에 맞는 가상 공고가 없습니다.<br />다른 키워드로 다시 실행해 보세요.</p></div>}
          </motion.div>
        </AnimatePresence>
        <p className="result-note">{phase === 'done' ? `키워드 일치 ${filtered.length}건에서 중복 ${filtered.length - unique.length}건을 제외했습니다. 실제 알림은 발송하지 않습니다.` : '공고번호를 기준으로 중복을 제외합니다. 이 예시의 수치는 아래 실제 운영 기록과 별개입니다.'}</p>
      </div>
    </div>
  );
}

function CaseDetails({ children, label = '판단과 구현 자세히 보기' }: { children: ReactNode; label?: string }) {
  return <details className="case-details"><summary>{label}<Plus size={20} aria-hidden="true" /></summary><div className="details-body">{children}</div></details>;
}

function ProcurementCase() {
  return (
    <article className="procurement-case case-section" id="procurement" aria-labelledby="procurement-title">
      <Reveal className="case-header">
        <p className="case-type">본인 업무 자동화 <span>초기 운영 검증</span></p>
        <h3 id="procurement-title">찾는 일을 줄이고,<br />새 공고만 받도록.</h3>
        <p className="case-subtitle">입찰공고 자동 알림</p>
      </Reveal>
      <div className="procurement-layout">
        <Reveal className="procurement-story">
          <p className="case-description">필요한 공고가 드물어도 매일 검색해야 했습니다. 확인을 잊는 날이 생길 수 있어, 검색 횟수를 늘리는 대신 새 공고만 전달하는 흐름을 만들었습니다.</p>
          <div className="operating-record">
            <p className="record-period">실제 초기 운영 기록 <time>2026.06.24-07.26</time></p>
            <div className="record-primary"><strong className="english">69<span>회</span></strong><p>자동 실행<br /><span>하루 두 차례, 공개 API 조회</span></p></div>
            <dl className="record-secondary"><div><dt>실행 성공 / 실패</dt><dd><b className="english">66 / 3</b><span>회</span></dd></div><div><dt>고유 공고</dt><dd><b className="english">5</b><span>건</span></dd></div><div><dt>수신자</dt><dd><b className="english">4</b><span>명</span></dd></div></dl>
            <p className="evidence-note">실행 결과를 공고 탐지 정확도나 수주 성과로 해석하지 않습니다.</p>
          </div>
        </Reveal>
        <Reveal className="demo-wrap" delay={0.12}><WorkflowDemo /></Reveal>
      </div>
      <CaseDetails>
        <div className="detail-columns"><div><h4>문제와 선택</h4><p>자동화 이전 제 수동 검색은 하루 약 10분이었습니다. 공고를 더 많이 읽기보다 조건에 맞는 신규 공고만 확인하도록 업무를 바꿨습니다.</p></div><div><h4>제가 맡은 일</h4><p>현업 담당자로서 검색 조건과 수신 규칙을 정하고 AI 코딩 도구를 활용해 구현했습니다. 키워드와 수신자를 바꾸는 관리 화면도 제작했습니다.</p></div><div><h4>실행과 확인</h4><p>공개 API를 하루 두 차례 조회하고, 키워드 선별과 공고번호별 발송 상태 확인을 거쳐 수신자별 알림을 보냅니다. 실행 결과와 발송 상태를 확인했습니다.</p></div></div>
        <p className="detail-footnote">본인 업무를 위한 자동화와 초기 운영 측정입니다. 수신자 모두의 시간 절감이나 전사 AX 도입 성과를 주장하지 않습니다.</p>
      </CaseDetails>
    </article>
  );
}

type Screenshot = { src: string; alt: string; title: string; caption: string };
type OpenScreenshot = (shot: Screenshot, trigger: HTMLButtonElement) => void;
const influencerShot: Screenshot = {
  src: asset('assets/influencer-review.png'),
  alt: '인플루언서 후보의 활동 데이터와 비교 근거를 보여주는 실제 컴포넌트 렌더, 가상 데이터 데모',
  title: '인플루언서 후보 검토',
  caption: '실제 컴포넌트 렌더, 가상 데이터 데모(2026.09.26).',
};
const beanlogShots: Screenshot[] = [
  { src: asset('assets/beanlog-record.png'), alt: 'Beanlog 커피 추출 기록 화면', title: 'Beanlog 추출 기록', caption: 'Beanlog 시뮬레이터 캡처(2026.03).' },
  { src: asset('assets/beanlog-flavor.png'), alt: 'Beanlog 커피의 향미와 맛을 기록하는 화면', title: 'Beanlog 향미 기록', caption: 'Beanlog 시뮬레이터 캡처(2026.03).' },
];

function ScreenshotButton({ shot, onOpen, className = '', width, height }: { shot: Screenshot; onOpen: OpenScreenshot; className?: string; width: number; height: number }) {
  return (
    <button className={`screenshot-button ${className}`} onClick={event => onOpen(shot, event.currentTarget)} aria-label={`${shot.title} 화면 크게 보기`} aria-haspopup="dialog">
      <img src={shot.src.replace('.png', '-preview.webp')} alt={shot.alt} width={width} height={height} loading="lazy" />
    </button>
  );
}

function InfluencerCase({ onOpen }: { onOpen: OpenScreenshot }) {
  return (
    <article className="influencer-case case-section" id="influencer" aria-labelledby="influencer-title">
      <div className="influencer-heading">
        <Reveal>
          <p className="case-type">개인 프로젝트 <span>배포·동선 검증</span></p>
          <h3 id="influencer-title">숫자만으로<br />고르지 않도록.</h3>
          <p className="case-subtitle">인플루언서 후보 검토</p>
          <p className="case-description">공개 게시물과 댓글을 수집하고 LLM으로 구조화해, 후보의 활동 근거를 비교하는 서비스를 구현했습니다.</p>
        </Reveal>
        <Reveal className="influencer-fact" delay={0.1}><ArrowUpRight size={48} weight="light" /><p>순위 다음에 필요한<br /><strong>판단 근거와 질문.</strong></p><span>2026.09.27 production 배포</span></Reveal>
      </div>
      <Reveal className="influencer-visual">
        <ScreenshotButton shot={influencerShot} onOpen={onOpen} width={2880} height={1800} />
        <div className="screen-caption"><p>{influencerShot.caption}</p><button className="text-link" onClick={event => onOpen(influencerShot, event.currentTarget)}>화면 크게 보기 <ArrowsOut size={16} /></button></div>
      </Reveal>
      <CaseDetails>
        <div className="detail-columns two"><div><h4>판단의 근거를 함께</h4><p>후보 검색과 비교에서 활동 숫자만 보여주지 않고, 판단 근거와 확인이 필요한 질문을 함께 볼 수 있도록 구성했습니다.</p></div><div><h4>확인한 범위</h4><p>2026.09.27 production 배포 후 입력과 탐색 동선을 검증했습니다. 실제 브랜드의 도입 성과나 선정 개선 효과는 별도로 입증하지 않았습니다.</p></div></div>
      </CaseDetails>
    </article>
  );
}

function BeanlogCase({ onOpen }: { onOpen: OpenScreenshot }) {
  return (
    <article className="beanlog-case case-section" id="beanlog" aria-labelledby="beanlog-title">
      <div className="beanlog-layout">
        <Reveal className="beanlog-visuals">
          {beanlogShots.map((shot, index) => <ScreenshotButton key={shot.title} shot={shot} onOpen={onOpen} width={1206} height={2622} className={`phone-shot phone-shot-${index}`} />)}
          <p className="beanlog-caption">Beanlog 시뮬레이터 캡처(2026.03).<br />화면을 누르면 크게 볼 수 있습니다.</p>
        </Reveal>
        <Reveal className="beanlog-copy" delay={0.1}>
          <p className="case-type">개인 프로젝트 <span>스토어 출시</span></p>
          <h3 id="beanlog-title">출시한 다음에도,<br />사용을 관찰합니다.</h3>
          <p className="case-subtitle english">Beanlog</p>
          <p className="case-description">커피 추출 기록 앱을 기획·개발해 iOS와 Android 스토어에 출시했습니다. PostHog로 온보딩과 재방문 행동을 계측하며, 기능 구현 이후의 사용자 흐름을 확인했습니다.</p>
          <div className="release-facts"><span className="english">iOS / Android</span><span className="english">PostHog</span></div>
          <CaseDetails label="출시와 계측 자세히 보기"><h4>구현 이후의 흐름</h4><p>추출 기록을 남기는 앱을 만들고 스토어 출시까지 진행했습니다. 이후 온보딩과 재방문 행동을 계측하며 사용자 흐름을 확인했습니다.</p></CaseDetails>
        </Reveal>
      </div>
      <div className="other-releases"><p>그 밖의 출시 경험</p><ul><li><b className="english">PlaceRoll</b><span>사진 위치 검색</span></li><li><b className="english">Slate Display</b><span>iPad 확장 모니터</span></li><li><b>주식점쟁이</b><span>차트 학습 미니앱</span></li></ul></div>
    </article>
  );
}

function WorkingMethod() {
  return (
    <section className="working-method page-width" aria-labelledby="method-title">
      <Reveal><h2 id="method-title">기능보다 먼저,<br /><span>일의 흐름을 봅니다.</span></h2></Reveal>
      <div className="method-flow">
        <Reveal className="method-statement"><p>문제와 제약을 확인하고,<br />작게 구현하고,<br />실행 결과로 다시 판단합니다.</p></Reveal>
        <Reveal className="method-explanation" delay={0.12}><div><h3>어디가 반복되는지</h3><p>반복 빈도와 영향, 실행 가능성을 기준으로 만들 범위를 좁힙니다.</p></div><div><h3>실제로 쓸 수 있는지</h3><p>작은 흐름을 직접 구현한 뒤 실제 사용과 실행 결과를 확인합니다.</p></div><div><h3>무엇까지 확인했는지</h3><p>확인한 결과와 남은 한계를 구분해 다음 판단으로 연결합니다.</p></div></Reveal>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="experience page-width" id="experience" aria-labelledby="experience-title">
      <Reveal><h2 id="experience-title">현업에서 쌓은 감각.</h2><p className="section-description">고객의 요구를 듣고, 제품과 개발조직 사이에서 실행할 조건을 만드는 일을 해왔습니다.</p></Reveal>
      <div className="experience-list">
        <Reveal className="experience-row current-role"><div className="experience-meta"><p className="english">2024.03<span>- 현재</span></p><h3>비솔</h3><p>영업부 대리 / B2B 기술영업</p></div><div className="experience-body"><p>대학·연구소·기업 고객의 동작분석 요구를 시스템 구성과 견적으로 구체화합니다.</p><p>영국 VICON 본사와 견적·발주·기술지원 사항을 협의하고, 반복 업무를 개선하는 도구를 제작했습니다.</p></div></Reveal>
        <Reveal className="experience-row"><div className="experience-meta"><p className="english">2023.07-2024.01</p><h3>에이스웍스</h3><p>프로젝트 매니저</p></div><div className="experience-body"><p>고객사 프로젝트 10-20개를 병렬 관리하며 고객과 개발조직 사이의 납기와 우선순위를 조율했습니다.</p></div></Reveal>
        <Reveal className="experience-row"><div className="experience-meta"><p className="english">2022.03-2023.06</p><h3>바이오넷</h3><p>전략기획본부 대리</p></div><div className="experience-body"><p>동물용 의료기기 2종의 제품기획과 부서 간 일정 조율을 맡았습니다.</p><p>재직 중 신제품 1종 출시와 국내 고객사 커스텀 프로젝트 1건의 납기 내 납품을 경험했습니다.</p></div></Reveal>
      </div>
      <Reveal className="education"><span>학력</span><p><b className="english">Technische Universität Chemnitz</b><br />Sports Engineering 학사 <span className="english">2012.10-2017.02</span></p></Reveal>
    </section>
  );
}

function ScreenshotDialog({ selected, onClose }: { selected: Screenshot | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!selected || !element) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => { document.body.style.overflow = previousOverflow; if (element.open) element.close(); };
  }, [selected]);

  return (
    <dialog ref={dialog} className="screenshot-dialog" aria-labelledby="screenshot-title" aria-describedby="screenshot-caption" onClose={onClose} onCancel={event => { event.preventDefault(); dialog.current?.close(); }} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      {selected && <><header className="dialog-header"><h2 id="screenshot-title">{selected.title}</h2><button className="icon-button" autoFocus aria-label="화면 닫기" onClick={() => dialog.current?.close()}><X size={24} /></button></header><div className="dialog-image"><img src={selected.src} alt={selected.alt} /></div><p className="dialog-caption" id="screenshot-caption">{selected.caption}</p></>}
    </dialog>
  );
}

export default function App() {
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);
  const screenshotTrigger = useRef<HTMLButtonElement | null>(null);
  const openScreenshot: OpenScreenshot = (shot, trigger) => { screenshotTrigger.current = trigger; setSelectedScreenshot(shot); };
  const closeScreenshot = () => { setSelectedScreenshot(null); screenshotTrigger.current?.focus(); };

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">본문으로 이동</a>
      <header className="site-header page-width"><a className="wordmark" href="#main" aria-label="이준호 포트폴리오 처음으로">이준호<span className="english">JUNHO LEE</span></a><nav aria-label="주요 메뉴"><a href="#work">프로젝트</a><a href="#experience">경력</a><a href="#contact">연락</a></nav><ThemeToggle /></header>
      <main id="main">
        <Hero />
        <section className="work-section page-width" id="work" aria-labelledby="work-title">
          <Reveal className="work-index"><h2 id="work-title">문제에서 출발한 작업들.</h2><nav aria-label="프로젝트 바로가기"><a href="#procurement">입찰공고 자동 알림<ArrowUpRight size={19} /></a><a href="#influencer">인플루언서 후보 검토<ArrowUpRight size={19} /></a><a href="#beanlog">Beanlog<ArrowUpRight size={19} /></a></nav></Reveal>
          <ProcurementCase /><InfluencerCase onOpen={openScreenshot} /><BeanlogCase onOpen={openScreenshot} />
        </section>
        <WorkingMethod /><Experience />
      </main>
      <footer className="contact page-width" id="contact"><Reveal><p className="contact-intro">함께 풀어볼 업무가 있다면</p><a className="contact-link" href="mailto:hojunlee77@gmail.com">이야기 나눠요.<ArrowUpRight weight="light" /></a><div className="footer-bottom"><a className="email" href="mailto:hojunlee77@gmail.com"><EnvelopeSimple size={17} /><span className="english">hojunlee77@gmail.com</span></a><p>이준호 <span className="english">© 2026</span></p></div></Reveal></footer>
      <ScreenshotDialog selected={selectedScreenshot} onClose={closeScreenshot} />
    </MotionConfig>
  );
}
