const fs = require('fs');
let content = fs.readFileSync('src/components/themes/TemplateBlueSnake.tsx', 'utf8');

// 1. Hide BLESSING & INVITATION section
content = content.replace(
  '{/* 02. BLESSING & INVITATION — 청사의 지혜와 축복 & 초대 말씀 */}',
  `{config.eventMode !== 'THANK_YOU' && (\n      <>\n      {/* 02. BLESSING & INVITATION — 청사의 지혜와 축복 & 초대 말씀 */}`
);
content = content.replace(
  '      {/* 03. OUR STORY — 성장 타임라인 */}',
  `      </>\n      )}\n\n      {/* 03. OUR STORY — 성장 타임라인 */}`
);

// 2. Hide Guestbook
content = content.replace(
  `{config.useGuestbook !== false && <Guestbook />}`,
  `{config.eventMode !== 'THANK_YOU' && config.useGuestbook !== false && <Guestbook />}`
);

// 3. Hide ShareButton
content = content.replace(
  `<ShareButton config={config} />`,
  `{config.eventMode !== 'THANK_YOU' && <ShareButton config={config} />}`
);

fs.writeFileSync('src/components/themes/TemplateBlueSnake.tsx', content);
