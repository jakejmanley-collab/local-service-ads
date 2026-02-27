'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';

// We use hardcoded dummy data for the test environment
const DUMMY_DATA = {
  businessName: 'APEX PROFESSIONAL',
  field: 'Plumbing',
  services: ['Water Heater Repair', 'Pipe Replacement', 'Drain Cleaning', '24/7 Emergency'],
  phone: '555-0199',
  website: 'www.apexservices.com',
  location: '123 Main St, Springfield'
};

const DUMMY_PHOTOS = [
  'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80'
];

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

const MasterTemplate = ({ id, data, photoUrl, photoUrl2, configKey, rawDatabase }: any) => {
  const rawConfig = rawDatabase[configKey];
  if (!rawConfig) return null;

  const photoConfig = parseZone(rawConfig['Photo Hole']);
  const photoConfig2 = parseZone(rawConfig['Photo Hole 2']);
  
  const headerTopConfig = parseZone(rawConfig['Header Top']);
  const headerBottomConfig = parseZone(rawConfig['Header Bottom']);
  const phoneConfig = parseZone(rawConfig['Phone']);
  const websiteConfig = parseZone(rawConfig['Website']);
  const locationConfig = parseZone(rawConfig['Location']);
  
  const serviceConfigs = [
    parseZone(rawConfig['Service 1']), 
    parseZone(rawConfig['Service 2']),
    parseZone(rawConfig['Service 3']), 
    parseZone(rawConfig['Service 4'])
  ];

  const mainTitle = data.businessName || data.field || 'PROFESSIONAL';
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
        
        {headerTopConfig && (
          <foreignObject x={headerTopConfig.x} y={headerTopConfig.y} width={headerTopConfig.width} height={headerTopConfig.height}>
            <div className="w-full h-full flex items-center uppercase leading-none tracking-tighter" style={headerTopConfig.style}>{firstWord}</div>
          </foreignObject>
        )}
        
        {headerBottomConfig && (
          <foreignObject x={headerBottomConfig.x} y={headerBottomConfig.y} width={headerBottomConfig.width} height={headerBottomConfig.height}>
            <div className="w-full h-full flex items-center uppercase leading-none tracking-tighter" style={headerBottomConfig.style}>{remainingWords}</div>
          </foreignObject>
        )}
        
        {data.services.slice(0, 4).map((service: string, index: number) => {
          const sConf = serviceConfigs[index];
          if (!sConf || !service) return null;
          return (
            <foreignObject key={index} x={sConf.x} y={sConf.y} width={sConf.width} height={sConf.height}>
              <div className="w-full h-full flex items-center uppercase" style={sConf.style}>✓ {service}</div>
            </foreignObject>
          );
        })}
        
        {phoneConfig && (
          <foreignObject x={phoneConfig.x} y={phoneConfig.y} width={phoneConfig.width} height={phoneConfig.height}>
            <div className="w-full h-full flex items-center" style={phoneConfig.style}>{data.phone}</div>
          </foreignObject>
        )}
        
        {data.website && websiteConfig && (
          <foreignObject x={websiteConfig.x} y={websiteConfig.y} width={websiteConfig.width} height={websiteConfig.height}>
            <div className="w-full h-full flex items-center" style={websiteConfig.style}>{data.website}</div>
          </foreignObject>
        )}
        
        {(data.location || data.serviceArea) && locationConfig && (
          <foreignObject x={locationConfig.x} y={locationConfig.y} width={locationConfig.width} height={locationConfig.height}>
            <div className="w-full h-full flex items-center" style={locationConfig.style}>{data.location || data.serviceArea}</div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

export default function TestTemplatesPage() {
  const [rawDatabase, setRawDatabase] = useState<Record<string, any>>({});
  
  useEffect(() => {
    fetch('/templates.csv')
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

  if (templateKeys.length === 0) {
    return <div className="p-12 text-center text-xl font-bold">Loading templates from CSV...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-12 border-b-2 border-slate-900 pb-6">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">Template Test Dashboard</h1>
          <p className="text-slate-600 mt-2 font-medium">Viewing {templateKeys.length} templates. Edit your CSV and refresh this page to see changes instantly.</p>
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
                photoUrl={DUMMY_PHOTOS[0]} 
                photoUrl2={DUMMY_PHOTOS[1]}
                configKey={key} 
                rawDatabase={rawDatabase} 
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
