const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
content = content.replace(
  /<img src={characterDetails.avatarUrl} alt={characterDetails.title} className="w-full h-full object-cover opacity-90 scale-125" \/>/g,
  `<CharacterScene characterClass={user.characterClass || 'Swordsman'} element={user.element || 'ARCANE'} level={user.level || 1} interactive={false} />`
);
fs.writeFileSync('src/pages/Dashboard.tsx', content);
