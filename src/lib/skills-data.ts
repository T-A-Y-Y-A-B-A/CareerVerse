export type SkillCategory = 'ai' | 'fullstack' | 'devops'
export type SkillStatus   = 'locked' | 'available' | 'unlocked' | 'needs-ascension'

export interface Skill {
  id:          string
  label:       string
  description: string
  xpReward:    number
  category:    SkillCategory
  requires:    string[]     // IDs of prerequisite skills
  icon:        string
  position:    { x: number; y: number }
  tier?:       number       // 1 (default) or 2
}

export const SKILLS: Skill[] = [

  //  AI ENGINEER PATH (x: 50450) 
  {
    id: 'python',
    label: 'Python',
    description: 'Core Python: syntax, functions, OOP, file I/O',
    xpReward: 100,
    category: 'ai',
    requires: [],
    icon: 'Terminal',
    position: { x: 200, y: 40 },
  },
  {
    id: 'numpy-pandas',
    label: 'NumPy & Pandas',
    description: 'Arrays, dataframes, and data manipulation',
    xpReward: 120,
    category: 'ai',
    requires: ['python'],
    icon: 'Database',
    position: { x: 200, y: 220 },
  },
  {
    id: 'ml-fundamentals',
    label: 'ML Fundamentals',
    description: 'Regression, classification, cross-validation',
    xpReward: 150,
    category: 'ai',
    requires: ['numpy-pandas'],
    icon: 'Cpu',
    position: { x: 200, y: 400 },
  },
  {
    id: 'deep-learning',
    label: 'Deep Learning',
    description: 'Neural nets, backprop, CNNs, RNNs',
    xpReward: 200,
    category: 'ai',
    requires: ['ml-fundamentals'],
    icon: 'BrainCircuit',
    position: { x: 80, y: 580 },
  },
  {
    id: 'mlops',
    label: 'MLOps',
    description: 'Model serving, monitoring, pipelines',
    xpReward: 175,
    category: 'ai',
    requires: ['ml-fundamentals'],
    icon: 'Cloud',
    position: { x: 320, y: 580 },
  },
  {
    id: 'llm-engineering',
    label: 'LLM Engineering',
    description: 'RAG, prompt engineering, fine-tuning LLMs',
    xpReward: 250,
    category: 'ai',
    requires: ['deep-learning'],
    icon: 'Code',
    position: { x: 80, y: 760 },
  },
  {
    id: 'computer-vision',
    label: 'Computer Vision',
    description: 'Image classification, detection, segmentation',
    xpReward: 225,
    category: 'ai',
    requires: ['deep-learning'],
    icon: 'Server',
    position: { x: 300, y: 760 },
  },

  //  FULL STACK PATH (x: 580980) 
  {
    id: 'javascript',
    label: 'JavaScript',
    description: 'ES6+, async/await, the DOM, fetch API',
    xpReward: 100,
    category: 'fullstack',
    requires: [],
    icon: 'Zap',
    position: { x: 730, y: 40 },
  },
  {
    id: 'react',
    label: 'React',
    description: 'Components, hooks, context, and state',
    xpReward: 130,
    category: 'fullstack',
    requires: ['javascript'],
    icon: 'Layers',
    position: { x: 610, y: 220 },
  },
  {
    id: 'nodejs',
    label: 'Node.js',
    description: 'Server-side JS, Express, REST APIs',
    xpReward: 130,
    category: 'fullstack',
    requires: ['javascript'],
    icon: 'Box',
    position: { x: 850, y: 220 },
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    description: 'App Router, SSR, server actions, deployment',
    xpReward: 160,
    category: 'fullstack',
    requires: ['react'],
    icon: 'GitBranch',
    position: { x: 610, y: 400 },
  },
  {
    id: 'databases',
    label: 'Databases',
    description: 'PostgreSQL, SQL queries, ORMs like Drizzle',
    xpReward: 140,
    category: 'fullstack',
    requires: ['nodejs'],
    icon: 'Monitor',
    position: { x: 850, y: 400 },
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    description: 'Static types, generics, utility types',
    xpReward: 150,
    category: 'fullstack',
    requires: ['nextjs'],
    icon: 'Terminal',
    position: { x: 610, y: 580 },
  },
  {
    id: 'system-design',
    label: 'System Design',
    description: 'Scalability, caching, queues, microservices',
    xpReward: 250,
    category: 'fullstack',
    requires: ['databases', 'typescript'],
    icon: 'Database',
    position: { x: 730, y: 760 },
  },

  //  DEVOPS PATH (x: 10601380) 
  {
    id: 'linux',
    label: 'Linux',
    description: 'CLI, permissions, processes, shell scripting',
    xpReward: 100,
    category: 'devops',
    requires: [],
    icon: 'Cpu',
    position: { x: 1180, y: 40 },
  },
  {
    id: 'git',
    label: 'Git',
    description: 'Branching, merging, rebasing, GitHub workflows',
    xpReward: 100,
    category: 'devops',
    requires: ['linux'],
    icon: 'BrainCircuit',
    position: { x: 1180, y: 220 },
  },
  {
    id: 'docker',
    label: 'Docker',
    description: 'Images, containers, volumes, Docker Compose',
    xpReward: 150,
    category: 'devops',
    requires: ['git'],
    icon: 'Cloud',
    position: { x: 1180, y: 400 },
  },
  {
    id: 'cicd',
    label: 'CI/CD',
    description: 'GitHub Actions, automated testing, deployments',
    xpReward: 175,
    category: 'devops',
    requires: ['docker'],
    icon: 'Code',
    position: { x: 1060, y: 580 },
  },
  {
    id: 'cloud',
    label: 'Cloud (AWS)',
    description: 'EC2, S3, Lambda, IAM, VPC fundamentals',
    xpReward: 225,
    category: 'devops',
    requires: ['docker'],
    icon: 'Server',
    position: { x: 1300, y: 580 },
  },
  {
    id: 'kubernetes',
    label: 'Kubernetes',
    description: 'Pods, services, deployments, Helm charts',
    xpReward: 300,
    category: 'devops',
    requires: ['cicd', 'cloud'],
    icon: 'Zap',
    position: { x: 1180, y: 760 },
  },

  //  AI ENGINEER PATH TIER 2 
  {
    id: 'rlhf-alignment',
    label: 'RLHF & Alignment',
    description: 'Alignment, DPO, RLHF, reward models, and policy optimization',
    xpReward: 300,
    category: 'ai',
    requires: ['llm-engineering'],
    icon: 'Layers',
    position: { x: 80, y: 940 },
    tier: 2,
  },
  {
    id: 'agentic-workflows',
    label: 'Agentic Workflows',
    description: 'Autonomous agents, tool-use, multi-agent coordination (LangGraph/CrewAI)',
    xpReward: 350,
    category: 'ai',
    requires: ['llm-engineering'],
    icon: 'Box',
    position: { x: 200, y: 1120 },
    tier: 2,
  },
  {
    id: 'diffusion-models',
    label: 'Diffusion Models',
    description: 'Generative image & video modeling, Stable Diffusion, flow matching',
    xpReward: 300,
    category: 'ai',
    requires: ['computer-vision'],
    icon: 'GitBranch',
    position: { x: 320, y: 940 },
    tier: 2,
  },
  {
    id: 'edge-ai',
    label: 'Edge AI',
    description: 'Model quantization (GGUF, AWQ), ONNX, mobile and local deployments',
    xpReward: 320,
    category: 'ai',
    requires: ['mlops'],
    icon: 'Monitor',
    position: { x: 440, y: 1120 },
    tier: 2,
  },

  //  FULL STACK PATH TIER 2 
  {
    id: 'websockets-realtime',
    label: 'Real-time & WebRTC',
    description: 'WebSockets, Socket.io, WebRTC peer-to-peer connection, and real-time syncing',
    xpReward: 300,
    category: 'fullstack',
    requires: ['system-design'],
    icon: 'Terminal',
    position: { x: 610, y: 940 },
    tier: 2,
  },
  {
    id: 'micro-frontends',
    label: 'Micro-Frontends',
    description: 'Module federation, monorepos, and independent deployments',
    xpReward: 320,
    category: 'fullstack',
    requires: ['nextjs'],
    icon: 'Database',
    position: { x: 850, y: 940 },
    tier: 2,
  },
  {
    id: 'pwa-offline',
    label: 'PWAs & Offline-First',
    description: 'Service workers, IndexedDB, local-first syncing architectures',
    xpReward: 300,
    category: 'fullstack',
    requires: ['typescript'],
    icon: 'Cpu',
    position: { x: 610, y: 1120 },
    tier: 2,
  },
  {
    id: 'graphql-federation',
    label: 'GraphQL Federation',
    description: 'GraphQL schemas, Apollo Federation, gateways, and schema stitching',
    xpReward: 300,
    category: 'fullstack',
    requires: ['system-design'],
    icon: 'BrainCircuit',
    position: { x: 850, y: 1120 },
    tier: 2,
  },

  //  DEVOPS PATH TIER 2 
  {
    id: 'terraform-iac',
    label: 'Terraform (IaC)',
    description: 'Infrastructure as Code, declarative cloud provisioning with Terraform',
    xpReward: 300,
    category: 'devops',
    requires: ['kubernetes'],
    icon: 'Cloud',
    position: { x: 1060, y: 940 },
    tier: 2,
  },
  {
    id: 'gitops',
    label: 'GitOps (ArgoCD)',
    description: 'Continuous delivery via Git sources, ArgoCD, and Flux',
    xpReward: 300,
    category: 'devops',
    requires: ['kubernetes'],
    icon: 'Code',
    position: { x: 1300, y: 940 },
    tier: 2,
  },
  {
    id: 'service-mesh',
    label: 'Service Mesh (Istio)',
    description: 'Traffic management, security, and observability inside Kubernetes via Istio',
    xpReward: 320,
    category: 'devops',
    requires: ['kubernetes'],
    icon: 'Server',
    position: { x: 1060, y: 1120 },
    tier: 2,
  },
  {
    id: 'chaos-engineering',
    label: 'Chaos Engineering',
    description: 'Resiliency testing, injecting failures using Gremlin or Chaos Mesh',
    xpReward: 350,
    category: 'devops',
    requires: ['kubernetes'],
    icon: 'Zap',
    position: { x: 1300, y: 1120 },
    tier: 2,
  },

  //  AI ENGINEER PATH TIER 3 (FINAL TIER) 
  {
    id: 'multimodal-architectures',
    label: 'Multimodal Systems',
    description: 'Vision-language models, audio embeddings, cross-modal attention, and unified embeddings',
    xpReward: 400,
    category: 'ai',
    requires: ['rlhf-alignment', 'diffusion-models'],
    icon: 'Layers',
    position: { x: 200, y: 1300 },
    tier: 3,
  },
  {
    id: 'llmops-scale',
    label: 'LLMOps at Scale',
    description: 'GPU cluster orchestration, vLLM/TGI hosting, distributed fine-tuning (Megatron/DeepSpeed)',
    xpReward: 450,
    category: 'ai',
    requires: ['agentic-workflows', 'edge-ai'],
    icon: 'Box',
    position: { x: 320, y: 1480 },
    tier: 3,
  },

  //  FULL STACK PATH TIER 3 (FINAL TIER) 
  {
    id: 'web3-dapps',
    label: 'Web3 & DApps',
    description: 'Smart contracts, Solidity, Ethereum interactions via Ethers.js, and decentralized storage',
    xpReward: 400,
    category: 'fullstack',
    requires: ['websockets-realtime', 'pwa-offline'],
    icon: 'GitBranch',
    position: { x: 610, y: 1300 },
    tier: 3,
  },
  {
    id: 'high-frequency-systems',
    label: 'High-Frequency Systems',
    description: 'Distributed transactions, event sourcing, low-latency queues, and partition tolerance',
    xpReward: 450,
    category: 'fullstack',
    requires: ['micro-frontends', 'graphql-federation'],
    icon: 'Monitor',
    position: { x: 850, y: 1300 },
    tier: 3,
  },

  //  DEVOPS PATH TIER 3 (FINAL TIER) 
  {
    id: 'security-devsecops',
    label: 'Zero-Trust DevSecOps',
    description: 'Zero-Trust security models, automated vulnerability scanning, policy-as-code (OPA)',
    xpReward: 400,
    category: 'devops',
    requires: ['terraform-iac', 'gitops'],
    icon: 'Terminal',
    position: { x: 1060, y: 1300 },
    tier: 3,
  },
  {
    id: 'site-reliability',
    label: 'SRE & Platform Eng',
    description: 'Advanced SRE practices, defining SLA/SLI/SLO, auto-healing platforms, telemetry at scale',
    xpReward: 450,
    category: 'devops',
    requires: ['service-mesh', 'chaos-engineering'],
    icon: 'Database',
    position: { x: 1300, y: 1300 },
    tier: 3,
  },
]

//  Helpers 

/** Given a set of unlocked skill IDs, compute each skill's current status */
export function computeStatuses(
  skills: Skill[],
  unlockedIds: Set<string>,
  prestigeLevels: { ai?: number; fullstack?: number; devops?: number } = {}
): Record<string, SkillStatus> {
  const result: Record<string, SkillStatus> = {}
  const aiPrestige = prestigeLevels.ai ?? 0
  const fsPrestige = prestigeLevels.fullstack ?? 0
  const devopsPrestige = prestigeLevels.devops ?? 0

  for (const skill of skills) {
    if (unlockedIds.has(skill.id)) {
      result[skill.id] = 'unlocked'
    } else if (skill.requires.every((r) => unlockedIds.has(r))) {
      const isTier2 = skill.tier === 2
      const isTier3 = skill.tier === 3
      const userPrestige = skill.category === 'ai'
        ? aiPrestige
        : skill.category === 'fullstack'
        ? fsPrestige
        : devopsPrestige

      if (isTier3 && userPrestige < 2) {
        result[skill.id] = 'needs-ascension'
      } else if (isTier2 && userPrestige < 1) {
        result[skill.id] = 'needs-ascension'
      } else {
        result[skill.id] = 'available'
      }
    } else {
      result[skill.id] = 'locked'
    }
  }
  return result
}

/** XP thresholds per level (cumulative). Level N needs XP[N-1] total XP. */
export const LEVEL_XP = [0, 300, 700, 1200, 1800, 2500, 3300, 4200, 5200, 6300,
                  7500, 8800, 10200, 11700, 13300, 15000, 16800, 18700, 20700, 22800]

export function getXpForLevel(level: number) {
  return LEVEL_XP[Math.min(Math.max(1, level), 20) - 1] ?? 0;
}

export function getLevelInfo(totalXP: number) {
  let level = 1
  for (let i = 1; i < LEVEL_XP.length; i++) {
    if (totalXP >= LEVEL_XP[i]) level = i + 1
    else break
  }
  level = Math.min(level, 20)
  const currentThreshold = LEVEL_XP[level - 1] ?? 0
  const nextThreshold    = LEVEL_XP[level] ?? LEVEL_XP[LEVEL_XP.length - 1]
  return {
    level,
    currentXP:  totalXP - currentThreshold,
    xpForNext:  nextThreshold - currentThreshold,
    totalXP,
  }
}
