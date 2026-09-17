// Icons for the skills list: the real (monochrome) logo where a technology
// has one, and a hand-drawn line icon for the ideas that do not.
//
// The logo outlines live in logoPaths.js (from simple-icons, CC0).
import { LOGO_PATHS } from './logoPaths'

const stroke = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// Line icons for concepts with no logo of their own.
const drawn = {
  // scattered points being separated: supervised / unsupervised learning
  cluster: (
    <g {...stroke}>
      <circle cx="7" cy="8" r="1.6" />
      <circle cx="6" cy="14" r="1.6" />
      <circle cx="11" cy="11" r="1.6" />
      <circle cx="17" cy="9" r="1.6" />
      <circle cx="18" cy="15" r="1.6" />
      <path d="M14 4.5 9.5 19.5" />
    </g>
  ),
  // a fitted line through points: regression
  trend: (
    <g {...stroke}>
      <path d="M4 19h16" />
      <path d="M4 16.5 9 12l3.5 3L20 6.5" />
      <circle cx="9" cy="12" r="1.2" />
      <circle cx="12.5" cy="15" r="1.2" />
    </g>
  ),
  // nearest neighbours around a point
  neighbours: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="12" r="6.5" strokeDasharray="2.5 2.5" />
      <circle cx="6" cy="6" r="1.3" />
      <circle cx="18.5" cy="7" r="1.3" />
      <circle cx="17.5" cy="17.5" r="1.3" />
    </g>
  ),
  // a decision tree: boosted trees
  tree: (
    <g {...stroke}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="6.5" cy="13" r="2" />
      <circle cx="17.5" cy="13" r="2" />
      <circle cx="13.5" cy="20" r="1.7" />
      <path d="M10.7 6.6 8 11.2M13.3 6.6 16 11.2M16.6 14.7l-2 3.7" />
    </g>
  ),
  // stacked layers: deep learning
  layers: (
    <g {...stroke}>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </g>
  ),
  // a kernel sliding over a grid: convolutional networks
  grid: (
    <g {...stroke}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M9 3.5v17M15 3.5v17M3.5 9h17M3.5 15h17" />
      <rect x="9" y="9" width="6" height="6" fill="currentColor" opacity=".18" stroke="none" />
    </g>
  ),
  // a loop: recurrent networks
  loop: (
    <g {...stroke}>
      <path d="M5 9a7 7 0 0 1 12-3" />
      <path d="M19 15A7 7 0 0 1 7 18" />
      <path d="M17 2.5V6h-3.5M7 21.5V18h3.5" />
    </g>
  ),
  // attention between tokens: transformers
  attention: (
    <g {...stroke}>
      <circle cx="5" cy="6" r="1.6" />
      <circle cx="5" cy="18" r="1.6" />
      <circle cx="19" cy="6" r="1.6" />
      <circle cx="19" cy="18" r="1.6" />
      <path d="M6.6 6.6 17.4 17.4M6.6 17.4 17.4 6.6M5 7.6v8.8M19 7.6v8.8" />
    </g>
  ),
  // speech with words: natural language
  speech: (
    <g {...stroke}>
      <path d="M4 5.5h16v10H9l-5 4v-14Z" />
      <path d="M7.5 9h9M7.5 12h6" />
    </g>
  ),
  // a large model answering: LLMs
  spark: (
    <g {...stroke}>
      <rect x="3.5" y="4.5" width="17" height="13" rx="3" />
      <path d="m9 11 1.2-2.6L11.4 11l2.6 1.2-2.6 1.2-1.2 2.6L9 13.4 6.4 12.2 9 11Z" />
      <path d="M16 8.5v3.5" />
    </g>
  ),
  // a search reaching into a store: retrieval-augmented generation
  retrieve: (
    <g {...stroke}>
      <ellipse cx="8" cy="5.5" rx="4.5" ry="2" />
      <path d="M3.5 5.5v9c0 1.1 2 2 4.5 2" />
      <path d="M3.5 10c0 1.1 2 2 4.5 2" />
      <circle cx="16" cy="14" r="4" />
      <path d="m19 17 2.5 2.5" />
    </g>
  ),
  // points placed in space: vector embeddings
  vectors: (
    <g {...stroke}>
      <path d="M4 20V5M4 20h15" />
      <path d="m4 20 6-6M4 20l9-4M4 20l5-11" />
      <circle cx="10" cy="14" r="1.2" />
      <circle cx="13" cy="16" r="1.2" />
      <circle cx="9" cy="9" r="1.2" />
    </g>
  ),
  // a target: model evaluation
  target: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </g>
  ),
  // sliders: fine-tuning
  sliders: (
    <g {...stroke}>
      <path d="M5 4v6M5 14v6M12 4v3M12 11v9M19 4v9M19 17v3" />
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="9" r="2" />
      <circle cx="19" cy="15" r="2" />
    </g>
  ),
  // an eye: computer vision
  eye: (
    <g {...stroke}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </g>
  ),
  // a face inside a frame: face recognition
  face: (
    <g {...stroke}>
      <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" />
      <circle cx="12" cy="10.5" r="2.4" />
      <path d="M7.8 16.5a4.6 4.6 0 0 1 8.4 0" />
    </g>
  ),
  // frames of film: image and video analysis
  frames: (
    <g {...stroke}>
      <rect x="3" y="6" width="13" height="12" rx="2" />
      <path d="m16 10 5-2.5v9L16 14" />
      <circle cx="7.5" cy="10" r="1.2" />
      <path d="m3.5 16 3.5-3 3 2.5 2.5-2 3 3" />
    </g>
  ),
  // brackets: an editor
  brackets: (
    <g {...stroke}>
      <path d="M9 5 4 12l5 7M15 5l5 7-5 7" />
    </g>
  ),
}

// Every skill maps either to a logo or to one of the drawings above.
const DRAWN = {
  'Supervised & Unsupervised Learning': 'cluster',
  'Linear / Logistic Regression': 'trend',
  KNN: 'neighbours',
  XGBoost: 'tree',
  'Deep Learning': 'layers',
  CNNs: 'grid',
  RNNs: 'loop',
  Transformers: 'attention',
  NLP: 'speech',
  LLMs: 'spark',
  RAG: 'retrieve',
  'Vector Embeddings': 'vectors',
  'Model Evaluation': 'target',
  'Fine-Tuning': 'sliders',
  'Computer Vision': 'eye',
  DeepFace: 'face',
  'Image & Video Analysis': 'frames',
  'VS Code': 'brackets',
}

export default function SkillIcon({ name, size = 20 }) {
  const logo = LOGO_PATHS[name]
  if (logo) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={logo} />
      </svg>
    )
  }
  const art = drawn[DRAWN[name]] ?? drawn.target
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {art}
    </svg>
  )
}
