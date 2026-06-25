const fs = require('fs');

// 1. Resume page
let resumeFile = 'src/app/dashboard/resume/page.tsx';
let resumeContent = fs.readFileSync(resumeFile, 'utf-8');
if (!resumeContent.includes('lucide-react')) {
  resumeContent = resumeContent.replace(
    "import { useState, useEffect } from 'react'",
    "import { useState, useEffect } from 'react'\nimport { Target, Zap, TriangleAlert, X, Clipboard, BarChart, CheckCircle, XCircle, Dumbbell, TrendingDown, PenTool, Rocket } from 'lucide-react'"
  );
}
fs.writeFileSync(resumeFile, resumeContent);

// 2. Skill Tree Page
let skillFile = 'src/app/dashboard/skill-tree/page.tsx';
let skillContent = fs.readFileSync(skillFile, 'utf-8');
if (!skillContent.includes('import { Crown')) {
  skillContent = skillContent.replace(
    "import { XPBar } from '@/components/skill-tree/xp-bar'",
    "import { XPBar } from '@/components/skill-tree/xp-bar'\nimport { Crown, Star, X } from 'lucide-react'"
  );
}
// Fix TS errors in skill tree
skillContent = skillContent
  .replace(/icon: targetPrestige === 2 \? <Crown className="w-4 h-4 inline" \/> : <Star className="w-4 h-4 inline" \/>/g, 'icon: targetPrestige === 2 ? <Crown className="w-4 h-4 inline" /> as React.ReactNode : <Star className="w-4 h-4 inline" /> as React.ReactNode')
fs.writeFileSync(skillFile, skillContent);

// 3. Career Profile
let profileFile = 'src/components/career-twin/career-profile.tsx';
let profileContent = fs.readFileSync(profileFile, 'utf-8');
if (!profileContent.includes('lucide-react')) {
  profileContent = profileContent.replace(
    "import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'",
    "import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'\nimport { GraduationCap, Lightbulb, Plus, Minus } from 'lucide-react'"
  );
}
fs.writeFileSync(profileFile, profileContent);

// 4. Internship company cards
let companyFile = 'src/components/internship-predictor/company-cards.tsx';
let companyContent = fs.readFileSync(companyFile, 'utf-8');
if (!companyContent.includes('lucide-react')) {
  companyContent = companyContent.replace(
    "import { Card, CardContent } from '@/components/ui/card'",
    "import { Card, CardContent } from '@/components/ui/card'\nimport { Plus, Minus, Lightbulb } from 'lucide-react'"
  );
}
fs.writeFileSync(companyFile, companyContent);

// 5. Roadmap career node
let careerNodeFile = 'src/components/roadmap/career-node.tsx';
let careerNodeContent = fs.readFileSync(careerNodeFile, 'utf-8');
if (!careerNodeContent.includes('lucide-react')) {
  careerNodeContent = careerNodeContent.replace(
    "import { Handle, Position } from '@xyflow/react'",
    "import { Handle, Position } from '@xyflow/react'\nimport { Coins, Wrench } from 'lucide-react'"
  );
}
fs.writeFileSync(careerNodeFile, careerNodeContent);

// 6. Roadmap timeline
let timelineFile = 'src/components/roadmap/roadmap-timeline.tsx';
let timelineContent = fs.readFileSync(timelineFile, 'utf-8');
if (!timelineContent.includes('lucide-react')) {
  timelineContent = timelineContent.replace(
    "import { Button } from '@/components/ui/button'",
    "import { Button } from '@/components/ui/button'\nimport { Check, PartyPopper } from 'lucide-react'"
  );
}
fs.writeFileSync(timelineFile, timelineContent);
