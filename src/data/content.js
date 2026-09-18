// Every word shown on the site lives here, so the 3D estate and the
// simple page always stay in sync.

export const person = {
  name: 'Aditya Kumar Joshi',
  words: 'What Is Learned, Is Built',
  title: 'AI/ML Engineer · Full-Stack Developer',
  seat: 'Indore, Madhya Pradesh',
  email: 'adityakjoshi01@gmail.com',
  resume: '/Aditya_Kumar_Joshi_Resume.pdf',
  // The photo lives in public/ (a head-and-shoulders shot works best).
  // If it is missing, a monogram is shown in its place.
  photo: '/aditya_joshi.jpg',
  initials: 'AKJ',
  links: [
    { label: 'GitHub', handle: 'adityakjoshi2004', href: 'https://github.com/adityakjoshi2004' },
    { label: 'LinkedIn', handle: 'aditya-kumar-joshi', href: 'https://www.linkedin.com/in/aditya-kumar-joshi-3919bb255' },
    { label: 'LeetCode', handle: 'adityajoshi04', href: 'https://leetcode.com/u/adityajoshi04/' },
  ],
}

export const contact = {
  openTo: ['AI/ML engineering roles', 'Full-stack roles', 'Research collaborations', 'Freelance ML projects'],
}

export const about = {
  lede: 'Building applied machine learning, end to end.',
  // The hero headline cycles through these: "…systems that see / read / …"
  verbs: ['see', 'read', 'reason', 'ship'],
  intro:
    'I build machine learning systems end to end: from the dataset and the model to the API and the interface people actually use. Computer vision, multilingual NLP and agentic AI, shipped as real products.',
  paragraphs: [
    'I am a Computer Science & Engineering graduate of IES IPS Academy, Indore (B.Tech, class of 2026). My work sits where machine learning meets full-stack engineering: systems that do not merely run inference, but ship as products people actually use.',
    'Recent work spans real-time computer vision (YOLO-based fall detection and face-recognition attendance), multilingual NLP (solving Hindi mathematical word problems with a fine-tuned mT5), and agentic AI tooling with LangChain and LangGraph. I care about the whole pipeline: the data, the model, the API and the interface on top.',
    'Beyond the code, I have led the non-technical team at Google Developers Group on Campus and the curation team at Bad Talks, because a good engineering culture matters as much as technical craft.',
  ],
}

export const projects = [
  {
    id: 'securevision',
    tagline: 'Agentic weapon detection that acts, not just alerts',
    volume: 'I',
    title: 'SecureVision X — Agentic AI-Based Weapon Detection System',
    spine: 'SecureVision X',
    stack: ['YOLOv8', 'LangGraph', 'Gemini', 'FastAPI', 'React'],
    summary:
      'A custom YOLOv8 weapon detector wired into a multi-agent security pipeline that assesses risk, retrieves the right emergency SOP and sends the notifications itself.',
    detail:
      'LangGraph orchestrates the agents over Gemini 2.5 Flash Vision and a Chroma RAG store; a FastAPI + React interface handles image and video detection and streams live workflow updates over SSE.',
    figures: [
      { value: '98.8%', label: 'mAP@0.5 · 90.4% mAP@0.5:0.95' },
      { value: '98.8%', label: 'precision · 96.9% recall' },
      { value: '275', label: 'test images' },
    ],
    cloth: '#3a2b4a',
  },
  {
    id: 'hindi-solver',
    tagline: 'Turns Hindi word problems into equations',
    volume: 'II',
    title: 'Mathematical Equation Generator',
    spine: 'Math Equations',
    stack: ['NLP', 'mT5', 'Transformers'],
    summary:
      'Fine-tuned an mT5 model on 12,744 Hindi math word problems to generate symbolic equations from natural-language questions.',
    detail:
      'Trained for 15 epochs with validation-loss-based model selection, then evaluated on 1,412 validation samples.',
    figures: [
      { value: '97.73%', label: 'exact-match accuracy' },
      { value: '99.56%', label: 'BLEU-1' },
      { value: '1,380 / 1,412', label: 'correct predictions' },
    ],
    cloth: '#6b1e23',
  },
  {
    id: 'hazardhawk',
    tagline: 'Real-time fall detection from live cameras',
    volume: 'III',
    title: 'HazardHawk AI',
    spine: 'HazardHawk AI',
    stack: ['YOLOv11', 'XGBoost', 'FastAPI', 'React'],
    summary:
      'An end-to-end surveillance system detecting fall, sit, stand and person in images, video and IP-camera streams.',
    detail:
      'A YOLOv11 detector is double-checked by an XGBoost verification model built on bounding-box spatial features, with a FastAPI + React dashboard for real-time visualisation and analytics.',
    figures: [
      { value: '88.3%', label: 'mAP@50 · 66.7% mAP@50-95' },
      { value: '85.1%', label: 'precision · 80.5% recall' },
      { value: '98.2%', label: 'fall verification accuracy (F1 0.98)' },
    ],
    cloth: '#1f3a2e',
  },
  {
    id: 'attendance',
    tagline: 'Face-recognition attendance, live',
    volume: 'IV',
    title: 'Smart Attendance Marking System',
    spine: 'Attendance',
    stack: ['FaceNet', 'DeepFace', 'FastAPI', 'React'],
    summary:
      'Real-time face-recognition attendance with snapshot logging and live statistics, for classrooms and meetings.',
    detail:
      'Built as the MVP during my ML internship. A FastAPI backend and React frontend work as one system; motion-based liveness checks are planned so attendance cannot be faked with a photograph.',
    figures: [
      { value: 'Real-time', label: 'identity verification' },
      { value: 'FaceNet', label: 'embeddings + DeepFace' },
    ],
    cloth: '#1d2a3a',
  },
  {
    id: 'stock-assistant',
    tagline: 'Personal finance and stock insights',
    volume: 'V',
    title: 'Personal Stock Assistant',
    spine: 'Stock Assistant',
    stack: ['MongoDB', 'Express', 'React', 'Node', 'Google Sheets API'],
    summary:
      'A MERN-stack application for stock recommendations, personal finance tracking and user-specific investment strategies.',
    detail:
      'Google Sheets serves as a lightweight data bridge for portfolio tracking alongside a MongoDB store.',
    figures: [{ value: 'MERN', label: 'full-stack application' }],
    cloth: '#5a4632',
  },
]

// Forthcoming essays: titles only until they are published.
export const manuscripts = [
  'Building a Real-Time Face Recognition Attendance System with FaceNet & FastAPI',
  'Fine-Tuning mT5 for Hindi Mathematical Word Problems',
  'YOLOv11 for Fall & Posture Detection: From Training to IP Camera',
  'Agentic AI Pipelines with LangChain and LangGraph',
  'From MERN to FastAPI: Choosing a Backend for ML Applications',
]

export const experience = [
  {
    id: 'technouniverse',
    role: 'AI/ML Engineer (Intern)',
    org: 'Technouniverse Softtech India Pvt. Ltd.',
    place: 'Indore, Madhya Pradesh',
    period: 'May 2025 – July 2025',
    duties: [
      'Developed an MVP Smart Attendance Marking System using face detection and recognition, integrating deep learning and computer vision (OpenCV, Transformers) to automate real-time identity verification.',
      'Assisted in designing user interfaces and backend services with React and FastAPI for seamless system integration.',
    ],
    stack: ['Python', 'OpenCV', 'Transformers', 'FastAPI', 'React'],
  },
  {
    id: 'ies-ips',
    role: 'Full Stack Developer',
    org: 'IES IPS Academy',
    place: 'Indore, Madhya Pradesh',
    period: 'May 2024 – April 2025',
    duties: [
      'Developed and maintained the College Management System (CMS) built on PHP CodeIgniter.',
      'Designed and implemented the Faculty Development Program (FDP) and Research Paper Management modules.',
    ],
    stack: ['PHP', 'CodeIgniter', 'MySQL', 'JavaScript'],
  },
]

export const honours = {
  laurel: { title: 'Smart India Hackathon 2025', note: 'Winner' },
  education: {
    degree: 'Bachelor of Technology, Computer Science & Engineering',
    school: 'IES IPS Academy, Indore',
    year: 'Class of 2026',
  },
  certificates: ['Python Programming', 'Database Management Systems (DBMS)'],
  offices: [
    { role: 'Non-Tech Team Lead', body: 'Google Developers Group (GDG) on Campus' },
    { role: 'Curation Team Lead', body: 'Bad Talks' },
  ],
}

// Quotes from people you have worked with, shown under "What others say" on
// the portfolio page. The section stays hidden until at least one is added.
// Only add real quotes, used with the person's permission. For example:
//   { quote: 'Aditya shipped the attendance MVP ahead of schedule…',
//     name: 'Full Name', role: 'Engineering Manager', org: 'Technouniverse Softtech' },
export const testimonials = []

// Presented as a botanical collection in the Conservatory.
export const skills = [
  {
    genus: 'Machine Learning & AI',
    common: 'The rare specimens',
    items: [
      'Supervised & Unsupervised Learning', 'Linear / Logistic Regression', 'KNN', 'XGBoost',
      'Deep Learning', 'CNNs', 'RNNs', 'Transformers', 'NLP', 'LLMs', 'RAG',
      'LangChain', 'LangGraph', 'Vector Embeddings', 'Model Evaluation', 'Fine-Tuning',
      'Computer Vision', 'YOLO Object Detection', 'Image & Video Analysis',
    ],
  },
  {
    genus: 'Frameworks & Libraries',
    common: 'The cultivated beds',
    items: ['PyTorch', 'Hugging Face Transformers', 'OpenCV', 'DeepFace', 'NumPy', 'Pandas', 'React', 'FastAPI'],
  },
  {
    genus: 'Languages',
    common: 'The old roots',
    items: ['Python', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    genus: 'Databases',
    common: 'The cellar stock',
    items: ['MySQL', 'MongoDB'],
  },
  {
    genus: 'Tools & Platforms',
    common: 'The potting shed',
    items: ['Git', 'VS Code', 'Postman', 'Google Colab', 'Kaggle', 'Google Sheets'],
  },
]

// The rooms of the estate. Positions are world coordinates on the island.
export const rooms = [
  { id: 'manor', name: 'The Manor', purpose: 'About', position: [0, 0, -7.5] },
  { id: 'library', name: 'The Library', purpose: 'Projects', position: [-8.6, 0, -2.6] },
  { id: 'study', name: 'The Study', purpose: 'Experience', position: [8.6, 0, -2.6] },
  { id: 'trophy', name: 'The Trophy Hall', purpose: 'Honours', position: [-7.2, 0, 5.6] },
  { id: 'conservatory', name: 'The Conservatory', purpose: 'Skills', position: [7.2, 0, 5.6] },
  { id: 'post', name: 'The Post Lodge', purpose: 'Contact', position: [0, 0, 9.6] },
]
