const fs = require('fs');
let content = fs.readFileSync('src/components/themes/TemplateBlueSnake.tsx', 'utf8');

if (!content.includes('import QuizWinnerAnnounce')) {
  content = content.replace(
    "import Quiz from '@/components/common/Quiz';",
    "import Quiz from '@/components/common/Quiz';\nimport QuizWinnerAnnounce from '@/components/common/QuizWinnerAnnounce';"
  );
}

// In Thank You mode, we want to show QuizWinnerAnnounce just before the footer
content = content.replace(
  '{/* 11. THANK YOU & SHARE */}',
  `{config.eventMode === 'THANK_YOU' && <QuizWinnerAnnounce />}\n\n      {/* 11. THANK YOU & SHARE */}`
);

fs.writeFileSync('src/components/themes/TemplateBlueSnake.tsx', content);
