const fs = require('fs');
let content = fs.readFileSync('src/components/admin/Dashboard.tsx', 'utf8');

content = content.replace(
  'const { submissions, loading } = useQuiz();',
  'const { submissions, loading, updateSubmission } = useQuiz();'
);

const oldSubMap = `                <div className="flex justify-between items-center font-bold">
                  <span>{sub.name}</span>
                  <span>{options[sub.answerIndex] || '?'}</span>
                </div>
                {sub.comment && <p className="text-xs mt-1 bg-white/50 p-2 rounded">{sub.comment}</p>}
              </div>`;

const newSubMap = `                <div className="flex justify-between items-center font-bold">
                  <span>{sub.name} {sub.isWinner && '🎁 (당첨)'}</span>
                  <div className="flex items-center gap-2">
                    <span>{options[sub.answerIndex] || '?'}</span>
                    {sub.isCorrect && (
                      <button 
                        onClick={() => updateSubmission(sub.id, { isWinner: !sub.isWinner })} 
                        className={\`text-xs px-2 py-1 rounded \${sub.isWinner ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}\`}
                      >
                        {sub.isWinner ? '당첨 취소' : '당첨!'}
                      </button>
                    )}
                  </div>
                </div>
                {sub.comment && <p className="text-xs mt-1 bg-white/50 p-2 rounded">{sub.comment}</p>}
                {sub.isWinner && sub.phone && <p className="text-xs text-pink-600 font-bold mt-1">연락처: {sub.phone}</p>}
              </div>`;

content = content.replace(oldSubMap, newSubMap);

fs.writeFileSync('src/components/admin/Dashboard.tsx', content);
