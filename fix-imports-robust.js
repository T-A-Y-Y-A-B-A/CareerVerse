const fs = require('fs');

// Helper to prepend import if it doesn't exist
function ensureImport(file, importStr) {
  let content = fs.readFileSync(file, 'utf-8');
  // Check if any of the items in importStr are already imported from 'lucide-react'
  // If not, just prepend it
  if (!content.includes('import {') || !content.includes('lucide-react')) {
    // very naive, but works for our case if we just put it after 'use client'
    if (content.startsWith("'use client'")) {
      content = content.replace("'use client'", "'use client'\n" + importStr);
    } else {
      content = importStr + '\n' + content;
    }
  } else {
    // If lucide-react is already imported, we might have duplicate imports, but TS will just complain about unused if so. 
    // Wait, let's just prepend it. Redundant imports are fine for a quick fix.
    if (content.startsWith("'use client'")) {
      content = content.replace("'use client'", "'use client'\n" + importStr);
    } else {
      content = importStr + '\n' + content;
    }
  }
  fs.writeFileSync(file, content);
}

function replaceInFile(file, search, replace) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.split(search).join(replace);
  fs.writeFileSync(file, content);
}

// 1. Resume page
let resumeFile = 'src/app/dashboard/resume/page.tsx';
ensureImport(resumeFile, "import { Target, Zap, TriangleAlert, X, Clipboard, BarChart, CheckCircle, XCircle, Dumbbell, TrendingDown, PenTool, Rocket } from 'lucide-react';");
replaceInFile(resumeFile, 'glow: string; icon: string', 'glow: string; icon: React.ReactNode');

// 2. Skill Tree Page
let skillFile = 'src/app/dashboard/skill-tree/page.tsx';
ensureImport(skillFile, "import { Crown, Star, X } from 'lucide-react';");

// 3. Career Profile
let profileFile = 'src/components/career-twin/career-profile.tsx';
ensureImport(profileFile, "import { GraduationCap, Lightbulb, Plus, Minus } from 'lucide-react';");

// 4. Internship company cards
let companyFile = 'src/components/internship-predictor/company-cards.tsx';
ensureImport(companyFile, "import { Plus, Minus, Lightbulb } from 'lucide-react';");

// 5. Roadmap career node
let careerNodeFile = 'src/components/roadmap/career-node.tsx';
ensureImport(careerNodeFile, "import { Coins, Wrench } from 'lucide-react';");

// 6. Roadmap timeline
let timelineFile = 'src/components/roadmap/roadmap-timeline.tsx';
ensureImport(timelineFile, "import { Check, PartyPopper } from 'lucide-react';");
