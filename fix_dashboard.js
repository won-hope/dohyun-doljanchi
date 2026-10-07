const fs = require('fs');

let content = fs.readFileSync('src/components/admin/Dashboard.tsx', 'utf8');

// The block to extract
const blockToMove = `
      <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-pink-200 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800 text-lg">📢 행사 모드 설정</h2>
          <select 
            value={config.eventMode || 'INVITATION'} 
            onChange={e => updateConfig({ eventMode: e.target.value })}
            className="border-2 border-pink-200 rounded-lg p-2 font-bold text-pink-600 outline-none"
          >
            <option value="INVITATION">행사 전 (초대장 모드)</option>
            <option value="THANK_YOU">행사 후 (감사 모드)</option>
          </select>
        </div>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          <strong>초대장 모드</strong>: 오시는 길, 참석 여부, 퀴즈 등이 보입니다.<br/>
          <strong>감사 모드</strong>: 행사 종료 후 스냅 사진을 공유하고 감사 인사를 전합니다. 오시는 길 등은 숨겨집니다.
        </p>
        
        <div className="border-t border-gray-100 pt-4 mt-4">
          <h3 className="font-bold text-gray-700 text-sm mb-2">🎙️ 부모님 육성 감사 인사 (오디오)</h3>
          <div className="flex gap-2 items-center">
            <input 
              type="text" 
              value={config.audioGreetingUrl || ''} 
              readOnly 
              placeholder="업로드된 오디오 파일이 없습니다" 
              className="flex-1 p-2 border rounded-lg text-sm bg-gray-50 text-gray-500" 
            />
            <label className="bg-pink-100 text-pink-700 px-4 py-2 rounded-lg font-bold text-sm cursor-pointer hover:bg-pink-200 transition">
              {uploading ? '업로드 중...' : '파일 찾기'}
              <input type="file" accept="audio/*" onChange={handleAudioUpload} disabled={uploading} className="hidden" />
            </label>
            {config.audioGreetingUrl && (
              <button onClick={() => updateConfig({ audioGreetingUrl: '' })} className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg font-bold text-sm hover:bg-gray-200">
                삭제
              </button>
            )}
          </div>
        </div>
      </div>
`;

content = content.replace(blockToMove, '');

// Now insert it in Dashboard return
const dashboardReturn = `<GeneralSettingsManager config={config} updateConfig={updateConfig} />`;
content = content.replace(dashboardReturn, dashboardReturn + '\n' + blockToMove);

fs.writeFileSync('src/components/admin/Dashboard.tsx', content);
