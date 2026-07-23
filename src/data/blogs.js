// src/data/blogs.js
// Replace link: '#' with your actual blog post URLs (Medium, Dev.to, Hashnode, personal blog, etc.)

export const blogs = [
  {
    id: 'face-recognition-attendance',
    date: 'July 2025',
    title: 'Building a Real-Time Face Recognition Attendance System with FaceNet & FastAPI',
    excerpt:
      'A deep-dive into architecting a production-ready smart attendance system - how we combined FaceNet embeddings, DeepFace verification, and OpenCV streams into a FastAPI backend that processes live webcam frames and updates attendance in real time.',
    readTime: '9 min read',
    tags: ['FaceNet', 'DeepFace', 'FastAPI', 'OpenCV', 'Computer Vision'],
    link: '#',
  },
  {
    id: 'hindi-word-problem-mT5',
    date: 'June 2025',
    title: 'Hindi Mathematical Word Problem Solving: Fine-Tuning mT5 on a Custom 7K Dataset',
    excerpt:
      'How I extended a multilingual NLP dataset by 7,000 hand-crafted Hindi word problems, preprocessed them with SentencePiece tokenization, and fine-tuned mT5 and mBART50 to translate natural-language math into structured equations - with benchmark comparisons.',
    readTime: '12 min read',
    tags: ['NLP', 'mT5', 'mBART50', 'Fine-Tuning', 'Multilingual'],
    link: '#',
  },
  {
    id: 'yolov11-fall-detection',
    date: 'May 2025',
    title: 'YOLOv11 for Fall & Posture Detection: From Training to IP Webcam Integration',
    excerpt:
      'A practical walkthrough of training YOLOv11 on a custom fall/sit/stand/person dataset, boosting accuracy with XGBoost on top of bounding-box features, and wiring the full pipeline into a live IP-webcam feed with a React dashboard.',
    readTime: '10 min read',
    tags: ['YOLOv11', 'XGBoost', 'Object Detection', 'React', 'FastAPI'],
    link: '#',
  },
  {
    id: 'agentic-ai-langchain-mcp',
    date: 'March 2025',
    title: 'Agentic AI Pipelines with LangChain, LangGraph, and the Model Context Protocol',
    excerpt:
      'Beyond simple RAG: how I composed multi-step agentic workflows using LangGraph state machines, surfaced external tools via MCP servers, and handled memory and context across long-running agent sessions - including failure modes I discovered the hard way.',
    readTime: '14 min read',
    tags: ['LangChain', 'LangGraph', 'MCP', 'RAG', 'Agentic AI'],
    link: '#',
  },
  {
    id: 'mern-to-fastapi',
    date: 'January 2025',
    title: 'From MERN to FastAPI: When to Switch Your Backend Stack for ML Applications',
    excerpt:
      'Lessons from maintaining a PHP CodeIgniter CMS and later shipping two ML-powered FastAPI services - where Express falls short when your endpoint is doing inference, and how async Python + Pydantic validation changed how I think about API design.',
    readTime: '7 min read',
    tags: ['FastAPI', 'Node.js', 'Architecture', 'Python', 'REST'],
    link: '#',
  },
]
