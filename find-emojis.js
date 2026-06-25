const fs = require('fs');
const files = [
  'src/app/dashboard/resume/page.tsx',
  'src/app/dashboard/skill-tree/page.tsx',
  'src/components/career-twin/career-profile.tsx',
  'src/components/internship-predictor/company-cards.tsx',
  'src/components/roadmap/career-node.tsx',
  'src/components/roadmap/roadmap-timeline.tsx',
  'src/lib/career-ladder-data.ts'
];
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2B50}]/u;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8').split('\n');
  content.forEach((line, i) => {
    if (emojiRegex.test(line)) {
      console.log(file + ':' + (i+1) + ': ' + line.trim());
    }
  });
});
