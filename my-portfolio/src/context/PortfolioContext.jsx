import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const PortfolioContext = createContext(null);

const initialAboutData = {
  basicInfo: {
    name:       '김규리',
    education:  'Youngsan University',
    major:      '관광컨벤션학과',
    experience: '신입',
    photo:      '',
  },
  sections: [
    {
      id:         'dev-story',
      title:      '나의 개발 스토리',
      content:    '웹디자인을 배우기 위해 시작했지만, 지금은 디자인보다 개발의 영역인 코딩이 더욱 재미를 느끼게 되어 둘다 성실히 배워 나가는 중입니다.',
      showInHome: true,
    },
    {
      id:         'philosophy',
      title:      '개발 철학',
      content:    '느리더라도 최대한 에러가 나지 않게 하기,애니메이션같은 효과들은 과하게 넣지 않기',
      showInHome: true,
    },
    {
      id:         'personal',
      title:      '개인적인 이야기',
      content:    '저는 혼자서 영화를 보는 것과, 다이어리를 꾸미는 것을 제일 좋아합니다.\n가끔 혼자만의 시간이 필요하다고 느끼면, 극장으로 가 영화를 보고 그날의 감상평을 다이어리에 작성 후 내용과 어울리는 종이나 스티커들로 여백을 꾸밉니다. 별 것 없는 소소한 것뿐이지만, 오늘을 잘 살았다는 충족감을 느낄 수 있는 취미들입니다.',
      showInHome: false,
    },
  ],
};

const initialSkills = [
  { id: 1, icon: 'html',  name: 'HTML',       level: 80, category: 'Frontend',  showInMain: true  },
  { id: 2, icon: 'css',   name: 'CSS',         level: 75, category: 'Frontend',  showInMain: true  },
  { id: 3, icon: 'js',    name: 'JavaScript',  level: 70, category: 'Frontend',  showInMain: true  },
  { id: 4, icon: 'react', name: 'React',       level: 60, category: 'Framework', showInMain: false },
  { id: 5, icon: 'figma', name: 'Figma',       level: 65, category: 'Design',    showInMain: false },
];

export function PortfolioProvider({ children }) {
  const [aboutData, setAboutData] = useState(initialAboutData);
  const [skills,    setSkills]    = useState(initialSkills);

  // ── 홈 탭용 데이터 — aboutData 또는 skills가 바뀔 때만 재계산 ────────────
  const homeData = useMemo(() => {
    const content = aboutData.sections
      .filter((s) => s.showInHome)
      .map((s) => ({
        id:      s.id,
        title:   s.title,
        summary: s.content.length > 120
          ? s.content.substring(0, 120) + '...'
          : s.content,
      }));

    const topSkills = [...skills]
      .sort((a, b) => b.level - a.level)
      .slice(0, 4);

    return { content, skills: topSkills, basicInfo: aboutData.basicInfo };
  }, [aboutData, skills]);

  // ── 핸들러 — setSkills/setAboutData는 useState에서 안정적으로 제공됨 ──────
  const updatePhoto = useCallback((url) => {
    setAboutData((prev) => ({ ...prev, basicInfo: { ...prev.basicInfo, photo: url } }));
  }, []);

  const toggleSkillMain  = useCallback((id) =>
    setSkills((prev) => prev.map((s) => s.id === id ? { ...s, showInMain: !s.showInMain } : s)),
  []);

  const addSkill    = useCallback((skill) => setSkills((prev) => [...prev, skill]), []);
  const deleteSkill = useCallback((id)    => setSkills((prev) => prev.filter((s) => s.id !== id)), []);

  // ── context value — 레퍼런스 안정화 ────────────────────────────────────────
  const value = useMemo(() => ({
    aboutData,
    setAboutData,
    skills,
    setSkills,
    homeData,
    updatePhoto,
    toggleSkillMain,
    addSkill,
    deleteSkill,
  }), [aboutData, skills, homeData, updatePhoto, toggleSkillMain, addSkill, deleteSkill]);

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio는 PortfolioProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
}
