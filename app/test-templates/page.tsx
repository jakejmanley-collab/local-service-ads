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
  ],
  painting: [
    'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
  ],
  welding: [
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1533552755457-5b481238fb01?auto=format&fit=crop&w=800&q=80'
  ],
  carpentry: [
    'https://images.unsplash.com/photo-1584999970366-eb1fc677f594?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505015920881-0f83c2f7c95e?auto=format&fit=crop&w=800&q=80'
  ],
  moving: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582269438706-93049b106e2c?auto=format&fit=crop&w=800&q=80'
  ],
  pool: [
    'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80'
  ],
  pest: [
    'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558223616-566b6c7ec2af?auto=format&fit=crop&w=800&q=80'
  ],
  tree: [
    'https://images.unsplash.com/photo-1596708453535-c38c11bb8d96?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80'
  ],
  concrete: [
    'https://images.unsplash.com/photo-1541888087519-9ee146f8fb01?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590483861877-c9de32f8ebf9?auto=format&fit=crop&w=800&q=80'
  ],
  default: [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541888087519-9ee146f8fb01?auto=format&fit=crop&w=800&q=80'
  ]
};

const parseZone = (csvString: any) => {
  if (!csvString || typeof csvString !== 'string') return null;
  const parts = csvString.split(',').map(s => s.trim());
  if (parts.length < 4) return null;
  
  let fontSize = parts[4] || '30px';
  if (!fontSize.includes('px') && !fontSize.includes('rem') && !fontSize.includes('em')) {
    fontSize += 'px';
  }

  let color = parts[5] || '#000000';
  if (color && !color.startsWith('#') && (color.length === 6 || color.length === 3)) {
    color = `#${color}`;
  }

  return {
    x: parts[0], y: parts[1], width: parts[2], height: parts[3],
    style: { 
      fontSize: fontSize, 
      color: color, 
      fontWeight: parts[6] || '400', 
      fontStyle: parts[7] || 'normal', 
      fontFamily: parts[8] || 'Anton' 
    }
  };
};

const MasterTemplate = ({ id, data, fieldName, photoUrl, photoUrl2, configKey, rawDatabase, isDebug }: any) => {
  const rawConfig = rawDatabase[configKey];
  if (!rawConfig) return null;

  const photoConfig = parseZone(rawConfig['Photo Hole']);
  const photoConfig2 = parseZone(rawConfig['Photo Hole 2']);
  
  const headerTopConfig = parseZone(rawConfig['Header Top']);
  const headerBottomConfig = parseZone(rawConfig['Header Bottom']);
  const phoneConfig = parseZone(rawConfig['Phone']);
  
  const serviceConfigs = [
    parseZone(rawConfig['Service 1']), 
    parseZone(rawConfig['Service 2']),
    parseZone(rawConfig['Service 3']), 
    parseZone(rawConfig['Service 4'])
  ];

  const mainTitle = data.businessName || fieldName || 'PROFESSIONAL';
  const tradeWords = mainTitle.split(' ');
  const firstWord = tradeWords[0];
  const remainingWords = tradeWords.slice(1).join(' ');

  const viewBoxStr = rawConfig['Canvas Dimensions'] ? `0 0 ${rawConfig['Canvas Dimensions'].replace('x', ' ')}` : "0 0 1080 1080";

  const isHex = configKey.includes('hex');
  const isCircle = configKey.includes('circle');
  
  const clipStyle = isHex 
    ? { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' } 
    : isCircle 
      ? { borderRadius: '50%', overflow: 'hidden' } 
      : {};

  const debugClasses = isDebug ? "border-2 border-red-500 bg-red-500/20" : "";

  return (
    <div id={id} className="relative w-full bg-white overflow-hidden shadow-2xl border-4 border-slate-200">
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
        
        {/* All flex and alignment hacks removed. Follows strict Canva X/Y top-left positioning. */}
        {headerTopConfig && (
          <foreignObject x={headerTopConfig.x} y={headerTopConfig.y} width={headerTopConfig.width} height={headerTopConfig.height}>
            <div xmlns="http://www.w3.org/1999/xhtml" className={`w-full h-full uppercase tracking-tighter ${debugClasses}`} style={headerTopConfig.style}>{firstWord}</div>
          </foreignObject>
        )}
        
        {headerBottomConfig && (
          <foreignObject x={headerBottomConfig.x} y={headerBottomConfig.y} width={headerBottomConfig.width} height={headerBottomConfig.height}>
            <div xmlns="http://www.w3.org/1999/xhtml" className={`w-full h-full uppercase tracking-tighter ${debugClasses}`} style={headerBottomConfig.style}>{remainingWords}</div>
          </foreignObject>
        )}
        
        {data.services.slice(0, 4).map((service: string, index: number) => {
          const sConf = serviceConfigs[index];
          if (!sConf || !service) return null;
          return (
            <foreignObject key={index} x={sConf.x} y={sConf.y} width={sConf.width} height={sConf.height}>
              <div xmlns="http://www.w3.org/1999/xhtml" className={`w-full h-full uppercase ${debugClasses}`} style={sConf.style}>✓ {service}</div>
            </foreignObject>
          );
        })}
        
        {phoneConfig && (
          <foreignObject x={phoneConfig.x} y={phoneConfig.y} width={phoneConfig.width} height={phoneConfig.height}>
            <div xmlns="http://www.w3.org/1999/xhtml" className={`w-full h-full ${debugClasses}`} style={phoneConfig.style}>{data.phone}</div>
          </foreignObject>
        )}
        
      </svg>
    </div>
  );
};

export default function TestTemplatesPage() {
  const [rawDatabase, setRawDatabase] = useState<Record<string, any>>({});
  const [selectedTrade, setSelectedTrade] = useState('plumbing');
  const [isDebug, setIsDebug] = useState(false);
  
  useEffect(() => {
    fetch('/templates.csv?v=' + new Date().getTime())
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true, 
          skipEmptyLines: true, 
          transformHeader: (h) => h.trim(),
          complete: (results) => {
            const newDb: Record<string, any> = {};
            results.data.forEach((row: any) => {
              if (row['Template ID']) newDb[row['Template ID']] = row;
            });
            setRawDatabase(newDb);
          }
        });
      });
  }, []);

  const templateKeys = Object.keys(rawDatabase);

  const activePhotos = useMemo(() => {
    const photos = tradePhotos[selectedTrade] || tradePhotos['plumbing'];
    return [...photos].sort(() => 0.5 - Math.random());
  }, [selectedTrade]);

  if (templateKeys.length === 0) {
    return <div className="p-12 text-center text-xl font-bold">Loading templates from CSV...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-12 border-b-2 border-slate-900 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">Template Test Dashboard</h1>
            <p className="text-slate-600 mt-2 font-medium">Viewing {templateKeys.length} templates. Edit your CSV and refresh this page to see changes instantly.</p>
            <button 
              onClick={() => setIsDebug(!isDebug)}
              className={`mt-4 px-4 py-2 font-bold rounded-lg transition-colors ${isDebug ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-900'}`}
            >
              {isDebug ? 'Hide Debug Boxes' : 'Show Debug Boxes'}
            </button>
          </div>
          
          <div className="w-64">
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Test Photo Trade</label>
            <select 
              value={selectedTrade} 
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="w-full border-2 border-slate-900 p-3 rounded-lg bg-white font-bold cursor-pointer shadow-sm"
            >
              {Object.keys(tradePhotos).map(trade => (
                <option key={trade} value={trade}>{trade.charAt(0).toUpperCase() + trade.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {templateKeys.map((key) => (
            <div key={key} className="flex flex-col gap-4">
              <div className="bg-slate-900 text-white font-bold py-2 px-4 rounded-t-lg text-center uppercase tracking-widest text-sm">
                {key}
              </div>
              <MasterTemplate 
                id={`test-${key}`} 
                data={DUMMY_DATA} 
                fieldName={selectedTrade.toUpperCase()}
                photoUrl={activePhotos[0]} 
                photoUrl2={activePhotos[1] || activePhotos[0]}
                configKey={key} 
                rawDatabase={rawDatabase}
                isDebug={isDebug}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
