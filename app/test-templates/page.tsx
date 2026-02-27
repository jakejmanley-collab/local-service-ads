'use client';

import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';

const DUMMY_DATA = {
  businessName: 'APEX PROFESSIONAL',
  services: ['Water Heater Repair', 'Pipe Replacement', 'Drain Cleaning', '24/7 Emergency'],
  phone: '519-555-0199'
};

const tradePhotos: Record<string, string[]> = {
  plumbing: [
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1607472586893-edb57cbce4ea?auto=format&fit=crop&w=800&q=80'
  ],
  hvac: [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
  ],
  landscaping: [
    'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1592424001807-6c2e361239c4?auto=format&fit=crop&w=800&q=80'
  ],
  cleaning: [
    'https://images.unsplash.com/photo-1581578731117-104f2a863a39?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80'
  ],
  drywall: [
    'https://images.unsplash.com/photo-1505082823024-00d346e9dd98?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
  ],
  electrical: [
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80'
  ],
  roofing: [
    'https://images.unsplash.com/photo-1632758999321-df621a50a1eb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
  ]
};

// CSV Columns exactly as they appear in your file
const CSV_COLUMNS = [
  "Template ID", "Canvas Dimensions", "Photo Hole", "Photo Hole 2", 
  "Header Top", "Header Bottom", "Service 1", "Service 2", "Service 3", "Service 4", 
  "Phone", "Website", "Location"
];

// Zones we want to show nudge controls for
const EDITABLE_ZONES = [
  "Header Top", "Header Bottom", "Service 1", "Service 2", "Service 3", "Service 4", "Phone"
];

const parseZone = (csvString: any) => {
  if (!csvString || typeof csvString !== 'string') return null;
  const parts = csvString.split(',').map(s => s.trim());
  if (parts.length < 4) return null;
  
  let fontSize = parts[4] || '30px';
  if (!fontSize.includes('px') && !fontSize.includes('rem') && !fontSize.includes('em')) fontSize += 'px';
  let color = parts[5] || '#000000';
  if (color && !color.startsWith('#') && (color.length === 6 || color.length === 3)) color = `#${color}`;

  return {
    x: parts[0], y: parts[1], width: parts[2], height: parts[3],
    style: { 
      fontSize, color, 
      fontWeight: parts[6] || '400', fontStyle: parts[7] || 'normal', fontFamily: parts[8] || 'Anton' 
    }
  };
};

const LiveTemplate = ({ data, fieldName, photoUrl, photoUrl2, configKey, configRow }: any) => {
  if (!configRow) return null;

  const photoConfig = parseZone(configRow['Photo Hole']);
  const photoConfig2 = parseZone(configRow['Photo Hole 2']);
  const headerTopConfig = parseZone(configRow['Header Top']);
  const headerBottomConfig = parseZone(configRow['Header Bottom']);
  const phoneConfig = parseZone(configRow['Phone']);
  const serviceConfigs = [
    parseZone(configRow['Service 1']), parseZone(configRow['Service 2']),
    parseZone(configRow['Service 3']), parseZone(configRow['Service 4'])
  ];

  const mainTitle = data.businessName || fieldName || 'PROFESSIONAL';
  const tradeWords = mainTitle.split(' ');
  const firstWord = tradeWords[0];
  const remainingWords = tradeWords.slice(1).join(' ');

  const viewBoxStr = configRow['Canvas Dimensions'] ? `0 0 ${configRow['Canvas Dimensions'].replace('x', ' ')}` : "0 0 1080 1080";
  const isHex = configKey.includes('hex');
  const isCircle = configKey.includes('circle');
  
  const clipStyle = isHex 
    ? { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' } 
    : isCircle 
      ? { borderRadius: '50%', overflow: 'hidden' } 
      : {};

  const debugBox = "border-2 border-red-500 bg-red-500/20";

  return (
    <div className="relative w-full bg-white overflow-hidden shadow-2xl border-4 border-slate-200">
      <svg viewBox={viewBoxStr} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <image href={`/${configKey}.png`} x="0" y="0" width="1080" height="1080" preserveAspectRatio="xMidYMid slice" />
        
        {photoConfig && (
          <foreignObject x={photoConfig.x} y={photoConfig.y} width={photoConfig.width} height={photoConfig.height}>
            <div style={{ width: '100%', height: '100%', ...clipStyle }}>
              <img src={photoUrl} alt="Trade 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
            </div>
          </foreignObject>
        )}
        {photoConfig2 && (
          <foreignObject x={photoConfig2.x} y={photoConfig2.y} width={photoConfig2.width} height={photoConfig2.height}>
            <div style={{ width: '100%', height: '100%', ...clipStyle }}>
              <img src={photoUrl2} alt="Trade 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
            </div>
          </foreignObject>
        )}
        
        {headerTopConfig && (
          <foreignObject x={headerTopConfig.x} y={headerTopConfig.y} width={headerTopConfig.width} height={headerTopConfig.height}>
            <div className={`w-full h-full uppercase tracking-tighter ${debugBox}`} style={headerTopConfig.style}>{firstWord}</div>
          </foreignObject>
        )}
        
        {headerBottomConfig && (
          <foreignObject x={headerBottomConfig.x} y={headerBottomConfig.y} width={headerBottomConfig.width} height={headerBottomConfig.height}>
            <div className={`w-full h-full uppercase tracking-tighter ${debugBox}`} style={headerBottomConfig.style}>{remainingWords}</div>
          </foreignObject>
        )}
        
        {data.services.slice(0, 4).map((service: string, index: number) => {
          const sConf = serviceConfigs[index];
          if (!sConf || !service) return null;
          return (
            <foreignObject key={index} x={sConf.x} y={sConf.y} width={sConf.width} height={sConf.height}>
              <div className={`w-full h-full uppercase ${debugBox}`} style={sConf.style}>✓ {service}</div>
            </foreignObject>
          );
        })}
        
        {phoneConfig && (
          <foreignObject x={phoneConfig.x} y={phoneConfig.y} width={phoneConfig.width} height={phoneConfig.height}>
            <div className={`w-full h-full ${debugBox}`} style={phoneConfig.style}>{data.phone}</div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

export default function NudgeToolPage() {
  const [rawDatabase, setRawDatabase] = useState<Record<string, any>>({});
  const [selectedTrade, setSelectedTrade] = useState('plumbing');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [activeRow, setActiveRow] = useState<any>(null);

  useEffect(() => {
    fetch('/templates.csv?v=' + new Date().getTime())
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true, skipEmptyLines: true, transformHeader: (h) => h.trim(),
          complete: (results) => {
            const newDb: Record<string, any> = {};
            results.data.forEach((row: any) => {
              if (row['Template ID']) newDb[row['Template ID']] = row;
            });
            setRawDatabase(newDb);
            if (results.data.length > 0) {
              setSelectedTemplate(results.data[0]['Template ID']);
              setActiveRow(results.data[0]);
            }
          }
        });
      });
  }, []);

  const templateKeys = Object.keys(rawDatabase);

  const activePhotos = useMemo(() => {
    const photos = tradePhotos[selectedTrade] || tradePhotos['plumbing'];
    return [...photos].sort(() => 0.5 - Math.random());
  }, [selectedTrade]);

  const handleTemplateChange = (e: any) => {
    const id = e.target.value;
    setSelectedTemplate(id);
    setActiveRow(rawDatabase[id]);
  };

  const updateCoordinate = (zoneName: string, index: number, newValue: number) => {
    if (!activeRow[zoneName]) return;
    const parts = activeRow[zoneName].split(',').map((s: string) => s.trim());
    parts[index] = newValue.toString();
    setActiveRow({ ...activeRow, [zoneName]: parts.join(', ') });
  };

  const getCoordinate = (zoneName: string, index: number) => {
    if (!activeRow || !activeRow[zoneName]) return 0;
    const parts = activeRow[zoneName].split(',').map((s: string) => s.trim());
    return parseFloat(parts[index]) || 0;
  };

  const generateOutputCsv = () => {
    if (!activeRow) return '';
    const rowString = CSV_COLUMNS.map(col => {
      let val = activeRow[col] || '';
      if (val.includes(',')) return `"${val}"`;
      return val;
    }).join(',');
    return rowString;
  };

  if (templateKeys.length === 0 || !activeRow) {
    return <div className="p-12 text-center text-xl font-bold">Loading templates from CSV...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto bg-white p-8 rounded-2xl shadow-xl border-2 border-slate-900">
        
        <div className="flex flex-col lg:flex-row gap-6 mb-8 border-b-2 border-slate-200 pb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Visual Nudge Tool</h1>
            <p className="text-slate-600 font-medium">Align your text perfectly, then copy the generated CSV row.</p>
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Test Photo Trade</label>
              <select value={selectedTrade} onChange={(e) => setSelectedTrade(e.target.value)} className="border-2 border-slate-300 p-2 rounded-lg font-bold">
                {Object.keys(tradePhotos).map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Template to Edit</label>
              <select value={selectedTemplate} onChange={handleTemplateChange} className="border-2 border-slate-900 bg-slate-900 text-white p-2 rounded-lg font-bold">
                {templateKeys.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT: Live Preview */}
          <div className="flex-1 lg:max-w-[800px]">
            <div className="sticky top-10">
              <LiveTemplate 
                data={DUMMY_DATA} fieldName={selectedTrade.toUpperCase()} 
                photoUrl={activePhotos[0]} photoUrl2={activePhotos[1] || activePhotos[0]}
                configKey={selectedTemplate} configRow={activeRow} 
              />
            </div>
          </div>

          {/* RIGHT: Nudge Controls */}
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-xl font-bold border-b pb-2">Nudge Coordinates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EDITABLE_ZONES.map(zone => {
                if (!activeRow[zone]) return null;
                const x = getCoordinate(zone, 0);
                const y = getCoordinate(zone, 1);
                const w = getCoordinate(zone, 2);
                const h = getCoordinate(zone, 3);
                
                return (
                  <div key={zone} className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 uppercase text-sm mb-3">{zone}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {/* X Nudge */}
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-bold">X (Left/Right)</span>
                        <div className="flex items-center gap-1 mt-1">
                          <button onClick={() => updateCoordinate(zone, 0, x - 5)} className="bg-slate-300 w-8 h-8 rounded font-bold hover:bg-slate-400">-</button>
                          <input type="number" value={x} onChange={e => updateCoordinate(zone, 0, parseFloat(e.target.value) || 0)} className="w-full text-center p-1 rounded border font-mono text-sm" />
                          <button onClick={() => updateCoordinate(zone, 0, x + 5)} className="bg-slate-300 w-8 h-8 rounded font-bold hover:bg-slate-400">+</button>
                        </div>
                      </div>
                      {/* Y Nudge */}
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 font-bold">Y (Up/Down)</span>
                        <div className="flex items-center gap-1 mt-1">
                          <button onClick={() => updateCoordinate(zone, 1, y - 5)} className="bg-slate-300 w-8 h-8 rounded font-bold hover:bg-slate-400">-</button>
                          <input type="number" value={y} onChange={e => updateCoordinate(zone, 1, parseFloat(e.target.value) || 0)} className="w-full text-center p-1 rounded border font-mono text-sm" />
                          <button onClick={() => updateCoordinate(zone, 1, y + 5)} className="bg-slate-300 w-8 h-8 rounded font-bold hover:bg-slate-400">+</button>
                        </div>
                      </div>
                      {/* W Nudge */}
                      <div className="flex flex-col mt-2">
                        <span className="text-xs text-slate-500 font-bold">Width</span>
                        <div className="flex items-center gap-1 mt-1">
                          <button onClick={() => updateCoordinate(zone, 2, w - 10)} className="bg-slate-300 w-8 h-8 rounded font-bold hover:bg-slate-400">-</button>
                          <input type="number" value={w} onChange={e => updateCoordinate(zone, 2, parseFloat(e.target.value) || 0)} className="w-full text-center p-1 rounded border font-mono text-sm" />
                          <button onClick={() => updateCoordinate(zone, 2, w + 10)} className="bg-slate-300 w-8 h-8 rounded font-bold hover:bg-slate-400">+</button>
                        </div>
                      </div>
                      {/* H Nudge */}
                      <div className="flex flex-col mt-2">
                        <span className="text-xs text-slate-500 font-bold">Height</span>
                        <div className="flex items-center gap-1 mt-1">
                          <button onClick={() => updateCoordinate(zone, 3, h - 5)} className="bg-slate-300 w-8 h-8 rounded font-bold hover:bg-slate-400">-</button>
                          <input type="number" value={h} onChange={e => updateCoordinate(zone, 3, parseFloat(e.target.value) || 0)} className="w-full text-center p-1 rounded border font-mono text-sm" />
                          <button onClick={() => updateCoordinate(zone, 3, h + 5)} className="bg-slate-300 w-8 h-8 rounded font-bold hover:bg-slate-400">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Code Output */}
            <div className="mt-8 bg-slate-900 p-6 rounded-xl shadow-inner">
              <h2 className="text-white font-bold mb-2 flex justify-between">
                <span>Copy to CSV</span>
                <span className="text-slate-400 text-xs font-normal">Editing: {selectedTemplate}</span>
              </h2>
              <textarea 
                readOnly 
                value={generateOutputCsv()} 
                className="w-full h-32 bg-slate-800 text-green-400 font-mono text-xs p-4 rounded-lg focus:outline-none"
              />
              <button 
                onClick={() => navigator.clipboard.writeText(generateOutputCsv())}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Copy Row to Clipboard
              </button>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
