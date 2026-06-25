const fs = require('fs');

function replaceInFile(file, replacements) {
  let content = fs.readFileSync(file, 'utf-8');
  for (const [search, replace] of replacements) {
    if (search instanceof RegExp) {
      content = content.replace(search, replace);
    } else {
      content = content.split(search).join(replace);
    }
  }
  fs.writeFileSync(file, content);
}

// 1. Resume page
let resumeFile = 'src/app/dashboard/resume/page.tsx';
let resumeContent = fs.readFileSync(resumeFile, 'utf-8');
if (!resumeContent.includes('lucide-react')) {
  resumeContent = resumeContent.replace(
    "import { useState } from 'react'",
    "import { useState } from 'react'\nimport { Target, Zap, TriangleAlert, X, Clipboard, BarChart, CheckCircle, XCircle, Dumbbell, TrendingDown, PenTool, Rocket } from 'lucide-react'"
  );
}
resumeContent = resumeContent
  .replace(/icon: '🎯'/g, 'icon: <Target className="w-4 h-4" />')
  .replace(/icon: '⚡'/g, 'icon: <Zap className="w-4 h-4" />')
  .replace(/icon: '⚠️'/g, 'icon: <TriangleAlert className="w-4 h-4" />')
  .replace(/icon: '❌'/g, 'icon: <X className="w-4 h-4" />')
  .replace(/<span className="text-xl">⚠️<\/span>/g, '<TriangleAlert className="w-5 h-5 text-amber-500" />')
  .replace(/<span>⚠️<\/span>/g, '<span><TriangleAlert className="w-4 h-4 inline mr-1 text-amber-500" /></span>')
  .replace(/icon="📋"/g, 'icon={<Clipboard className="w-5 h-5" />}')
  .replace(/icon="📊"/g, 'icon={<BarChart className="w-5 h-5" />}')
  .replace(/icon="✅"/g, 'icon={<CheckCircle className="w-5 h-5" />}')
  .replace(/icon="❌"/g, 'icon={<XCircle className="w-5 h-5" />}')
  .replace(/icon="💪"/g, 'icon={<Dumbbell className="w-5 h-5" />}')
  .replace(/icon="🔻"/g, 'icon={<TrendingDown className="w-5 h-5" />}')
  .replace(/icon="✍️"/g, 'icon={<PenTool className="w-5 h-5" />}')
  .replace(/icon="🚀"/g, 'icon={<Rocket className="w-5 h-5" />}')
  .replace(/icon: string;/g, 'icon: React.ReactNode;')
  .replace(/<span className="text-base">\{icon\}<\/span>/g, '<span className="text-base flex items-center">{icon}</span>');
fs.writeFileSync(resumeFile, resumeContent);

// 2. Skill Tree Page
let skillFile = 'src/app/dashboard/skill-tree/page.tsx';
let skillContent = fs.readFileSync(skillFile, 'utf-8');
if (!skillContent.includes('Crown')) {
  skillContent = skillContent.replace(
    "import { XPBar } from '@/components/skill-tree/xp-bar'",
    "import { XPBar } from '@/components/skill-tree/xp-bar'\nimport { Crown, Star, X } from 'lucide-react'"
  );
}
skillContent = skillContent
  .replace(/icon: targetPrestige === 2 \? '👑' : '🌟'/g, 'icon: targetPrestige === 2 ? <Crown className="w-4 h-4 inline" /> : <Star className="w-4 h-4 inline" />')
  .replace(/★ Tier/g, 'Tier')
  .replace(/let icon = '🌟'/g, 'let icon: React.ReactNode = <Star className="w-4 h-4 inline" />')
  .replace(/icon = '👑'/g, 'icon = <Crown className="w-4 h-4 inline" />')
  .replace(/>✕</g, '><X className="w-4 h-4" /><')
  .replace(/>👑</g, '><Crown className="w-4 h-4" /><')
  .replace(/>🌟</g, '><Star className="w-4 h-4" /><');
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
profileContent = profileContent
  .replace(/✦ Strengths/g, '<Plus className="w-4 h-4 mr-1 inline" /> Strengths')
  .replace(/✗ Weaknesses/g, '<Minus className="w-4 h-4 mr-1 inline" /> Weaknesses')
  .replace(/Recommended Courses & Certificates 👨‍🎓/g, 'Recommended Courses & Certificates <GraduationCap className="w-5 h-5 ml-2 inline text-muted-foreground" />')
  .replace(/Bonus Video Guides 💡/g, 'Bonus Video Guides <Lightbulb className="w-5 h-5 ml-2 inline text-muted-foreground" />');
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
companyContent = companyContent
  .replace(/✦ Why you match/g, '<Plus className="w-4 h-4 inline mr-1" /> Why you match')
  .replace(/✗ What's holding you back/g, '<Minus className="w-4 h-4 inline mr-1" /> What' + "'s holding you back")
  .replace(/💡 Tip/g, '<Lightbulb className="w-4 h-4 inline mr-1" /> Tip');
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
careerNodeContent = careerNodeContent
  .replace(/💰 Salary Range/g, '<Coins className="w-3 h-3 inline mr-1" /> Salary Range')
  .replace(/🛠️ Required Skills/g, '<Wrench className="w-3 h-3 inline mr-1" /> Required Skills');
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
timelineContent = timelineContent
  .replace(/Complete ✓/g, 'Complete <Check className="w-4 h-4 inline ml-1" />')
  .replace(/<p className="text-2xl">🎉<\/p>/g, '<PartyPopper className="w-8 h-8 text-foreground" />');
fs.writeFileSync(timelineFile, timelineContent);

// 7. Career ladder data
let ladderFile = 'src/lib/career-ladder-data.ts';
let ladderContent = fs.readFileSync(ladderFile, 'utf-8');
ladderContent = ladderContent
  .replace(/icon: '🌱'/g, "icon: 'Leaf'")
  .replace(/icon: '⚙️'/g, "icon: 'Cog'")
  .replace(/icon: '🔷'/g, "icon: 'Diamond'")
  .replace(/icon: '🏛️'/g, "icon: 'Landmark'")
  .replace(/icon: '👑'/g, "icon: 'Crown'");
fs.writeFileSync(ladderFile, ladderContent);
