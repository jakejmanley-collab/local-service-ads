'use client';

import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';

const DUMMY_DATA = {
  businessName: 'APEX PROFESSIONAL',
  services: ['Water Heater Repair', 'Pipe Replacement', 'Drain Cleaning', '24/7 Emergency'],
  phone: '519-555-0199'
};

const tradePhotos: Record<string, string[]> = {
  plumbing: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80']
};

const CSV_COLUMNS = ["Template ID", "Canvas Dimensions", "Photo Hole", "Photo Hole 2", "Header Top", "Header Bottom", "Service 1", "Service 2", "Service 3", "Service 4", "Phone", "Website", "Location"];
const EDITABLE_ZONES = ["Header Top", "Header Bottom", "Service 1", "Service 2", "Service 3", "Service 4", "Phone", "Website", "Location"];

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
      fontSize, 
      color, 
      fontWeight: parts[6] || '400', 
      fontStyle: parts[7] || 'normal', 
      fontFamily: parts[8] || 'Anton',
      lineHeight: '1',
      display: 'flex',
      alignItems: 'center'
    }
  };
};

const LiveTemplate = ({ data, fieldName, photoUrl, configKey, configRow }: any) => {
  if (!configRow) return null;
  
  const zones = {
    photo: parseZone(configRow['Photo Hole']),
    headerTop: parseZone(configRow['Header Top']),
    headerBottom: parseZone(configRow['Header Bottom']),
    phone: parseZone(configRow['Phone']),
    website: parseZone(configRow['Website']),
    location: parseZone(configRow['Location']),
    services: [
      parseZone(configRow['Service 1']), 
      parseZone(configRow['Service 2']), 
      parseZone(configRow['Service 3']), 
      parseZone(configRow['Service 4'])
    ]
  };

  const mainTitle = data.businessName || fieldName || 'PROFESSIONAL';
  const firstWord = mainTitle.split(' ')[0];
  const remainingWords = mainTitle.split(' ').slice(1).join(' ');

  return (
    <div className="relative w-full bg-white overflow-hidden shadow-2xl border-4 border-slate-200">
      <svg viewBox="0 0 1080 1080" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <image href={`/${configKey}.png`} x="0" y="0" width="1080" height="1080" preserveAspectRatio="xMidYMid slice" />
        
        {zones.photo && (
          <foreignObject x={zones.photo.x} y={zones.photo.y} width={zones.photo.width} height={zones.photo.height}>
            <img src={photoUrl} alt="Trade" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          </foreignObject>
        )}

        {[
          { conf: zones.headerTop, text: firstWord },
          { conf: zones.headerBottom, text: remainingWords },
          { conf: zones.phone, text: data.phone },
          { conf: zones.website, text: 'WWW.ARETIFI.COM' },
          { conf: zones.location, text: 'LOCAL AREA' },
          ...zones.services.map(s => ({ conf: s, text: '✓ SERVICE' }))
        ].map((item, i) => item.conf && (
          <foreignObject key={i} x={item.conf.x} y={item.conf.y} width={item.conf.width} height={item.conf.height}>
            <div className="w-full h-full flex items-center border-2 border-red-500 bg-red-500/20 uppercase" style={item.conf.style}>
              {item.text}
            </div>
          </foreignObject>
        ))}
      </svg>
    </div>
  );
};

export default function NudgeToolPage() {
  const [rawDatabase, setRawDatabase] = useState<Record<string, any>>({});
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [activeRow, setActiveRow] = useState<any>(null);

  useEffect(() => {
    fetch(`/templates.csv?v=${new Date().getTime()}`)
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true, skipEmptyLines: true, transformHeader: (h) => h.trim(),
          complete: (results: any) => {
            const newDb: Record<string, any> = {};
            results.data.forEach((row: any) => { if (row['Template ID']) newDb[row['Template ID']] = row; });
            setRawDatabase(newDb);
            if (results.data[0]) { setSelectedTemplate(results.data[0]['Template ID']); setActiveRow(results.data[0]); }
          }
        });
      });
  }, []);

  const updateCoordinate = (zoneName: string, index: number, newValue: any) => {
    if (!activeRow[zoneName]) return;
    const parts = activeRow[zoneName].split(',').map((s: string) => s.trim());
    parts[index] = newValue.toString();
    setActiveRow({ ...activeRow, [zoneName]: parts.join(', ') });
  };

  const getCoordinate = (zoneName: string, index: number) => {
    if (!activeRow || !activeRow[zoneName]) return 0;
    const parts = activeRow[zoneName].split(',').map((s: string) => s.trim());
    return index === 4 ? parseInt(parts[index]) || 30 : parseFloat(parts[index]) || 0;
  };

  if (!activeRow) return <div className="p-12 text-center font-bold">Loading...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1600px] mx-auto bg-white p-8 rounded-2xl shadow-xl border-2 border-slate-900">
        <div className="flex justify-between mb-8 border-b pb-4">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Visual Nudge Tool</h1>
          <select value={selectedTemplate} onChange={(e) => { setSelectedTemplate(e.target.value); setActiveRow(rawDatabase[e.target.value]); }} className="border-2 border-slate-900 bg-slate-900 text-white p-2 rounded-lg font-bold">
            {Object.keys(rawDatabase).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div className="flex gap-12">
          <div className="flex-1 max-w-[800px]">
            <LiveTemplate data={DUMMY_DATA} photoUrl={tradePhotos.plumbing[0]} configKey={selectedTemplate} configRow={activeRow} />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {EDITABLE_ZONES.map(zone => (
              <div key={zone} className="bg-slate-100 p-4 rounded-xl border">
                <h3 className="font-bold text-sm mb-3 uppercase tracking-wider">{zone}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['X', 'Y', 'W', 'H', 'Size'].map((label, i) => (
                    <div key={label}>
                      <span className="text-[10px] font-black uppercase text-slate-500">{label}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateCoordinate(zone, i, (getCoordinate(zone, i) - (i === 4 ? 1 : 2)) + (i === 4 ? 'px' : ''))} className="bg-slate-300 w-6 h-6 rounded text-xs">-</button>
                        <input type="number" value={getCoordinate(zone, i)} onChange={e => updateCoordinate(zone, i, e.target.value + (i === 4 ? 'px' : ''))} className="w-full text-center p-1 rounded border text-xs" />
                        <button onClick={() => updateCoordinate(zone, i, (getCoordinate(zone, i) + (i === 4 ? 1 : 2)) + (i === 4 ? 'px' : ''))} className="bg-slate-300 w-6 h-6 rounded text-xs">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="col-span-2 mt-4 bg-slate-900 p-6 rounded-xl">
              <textarea readOnly value={CSV_COLUMNS.map(col => activeRow[col]?.includes(',') ? `"${activeRow[col]}"` : activeRow[col]).join(',')} className="w-full h-24 bg-slate-800 text-green-400 font-mono text-xs p-4 rounded focus:outline-none" />
              <button onClick={() => navigator.clipboard.writeText(CSV_COLUMNS.map(col => activeRow[col]?.includes(',') ? `"${activeRow[col]}"` : activeRow[col]).join(','))} className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-500">Copy New CSV Row</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
