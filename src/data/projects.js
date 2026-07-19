// src/data/projects.js
export const projects = [
  {
    id: 'hindi-word-problem-solver',
    index: '01',
    title: 'Hindi Mathematical Word Problem Solver',
    tagline: 'Multilingual NLP model for Hindi math problems',
    description:
      'Multilingual NLP model that turns Hindi word problems into mathematical equations; extended with 7,000 custom problems and benchmarked against existing results.',
    stack: ['NLP', 'mT5', 'mBART50', 'Custom Transformer'],
    featured: false,
    status: 'shipped',
    github: 'https://github.com/AdityaKumarJoshi',
  },
  {
    id: 'smart-attendance-system',
    index: '02',
    title: 'Smart Attendance Marking System',
    tagline: 'Real-time face-recognition attendance with live stats',
    description:
      'Real-time face-recognition attendance system with snapshot logging and live stats; FastAPI backend + React frontend; planned motion-liveness check to prevent spoofed attendance.',
    stack: ['FaceNet', 'DeepFace', 'FastAPI', 'React'],
    featured: true,
    status: 'shipped',
    github: 'https://github.com/AdityaKumarJoshi',
  },
  {
    id: 'hazardhawk-ai',
    index: '03',
    title: 'HazardHawk AI',
    tagline: 'YOLO-based surveillance: fall / sit / stand detection',
    description:
      'Surveillance tool detecting fall / sit / stand / person in images, video, and IP-webcam feeds; shows known/unknown object snapshots and stats; planned CCTV integration for higher accuracy.',
    stack: ['YOLOv11', 'XGBoost', 'FastAPI', 'React'],
    featured: true,
    status: 'shipped',
    github: 'https://github.com/AdityaKumarJoshi',
  },
  {
    id: 'personal-stock-assistant',
    index: '04',
    title: 'Personal Stock Assistant',
    tagline: 'MERN-stack stock recommendations & finance tracker',
    description:
      'MERN-stack app for stock recommendations, personal finance tracking, and user-specific investment strategies.',
    stack: ['MongoDB', 'React', 'Node', 'Google Sheets API'],
    featured: false,
    status: 'shipped',
    github: 'https://github.com/AdityaKumarJoshi',
  },
]
