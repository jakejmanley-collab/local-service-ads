'use client';

import { useState, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';

const THEME_COLORS = ['red', 'blue', 'gold', 'green', 'purple'];

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

const MasterTemplate = ({ id, data, photoUrl, photoUrl2, configKey, rawDatabase }: any) => {
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
    <div id={id} className="relative w-full bg-white overflow-hidden shadow-2xl">
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
              <div className="w-full h-full flex items-center uppercase leading-none" style={sConf.style}>✓ {service}</div>
            </foreignObject>
          );
        })}
        
        {phoneConfig && (
          <foreignObject x={phoneConfig.x} y={phoneConfig.y} width={phoneConfig.width} height={phoneConfig.height}>
            <div className="w-full h-full flex items-center leading-none" style={phoneConfig.style}>{data.phone || '555-0123'}</div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

export default function PreviewPage() {
  const [rawDatabase, setRawDatabase] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    businessName: '', field: '', service1: '', service2: '', service3: '', service4: '', phone: '', themeColor: 'red'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [selectedPhoto2, setSelectedPhoto2] = useState<string>('');

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

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const tradeKey = Object.keys(tradePhotos).find(k => formData.field.toLowerCase().includes(k)) || 'default';
    const photos = tradePhotos[tradeKey];
    
    const shuffled = [...photos].sort(() => 0.5 - Math.random());
    setSelectedPhoto(shuffled[0]);
    setSelectedPhoto2(shuffled[1] || shuffled[0]); 
    
    setShowPreview(true);
  };

  const downloadFlyer = useCallback(async (elementId: string, shapeName: string) => {
    setDownloadingId(elementId);
    const el = document.getElementById(elementId);
    if (el) {
      const url = await toPng(el, { quality: 1.0, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${formData.businessName || 'flyer'}-${shapeName}.png`;
      link.href = url;
      link.click();
    }
    setDownloadingId(null);
  }, [formData]);

  const parsedData = { 
    ...formData, 
    services: [formData.service1, formData.service2, formData.service3, formData.service4].filter(Boolean) 
  };

  if (showPreview) {
    const shapes = ['circle', 'square', 'hex'];

    return (
      <main className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Choose Your Layout</h2>
            <button onClick={() => setShowPreview(false)} className="bg-white border-2 border-slate-900 text-slate-900 font-bold py-2 px-6 rounded-lg hover:bg-slate-100 transition-colors">← Edit Details</button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {shapes.map((shape) => {
              const configKey = `${shape}-${formData.themeColor}`;
              const elementId = `flyer-${shape}`;
              const isDownloadingThis = downloadingId === elementId;
              
              if (!rawDatabase[configKey]) return null;

              return (
                <div key={shape} className="flex flex-col gap-6">
                  <MasterTemplate 
                    id={elementId} 
                    data={parsedData} 
                    photoUrl={selectedPhoto} 
                    photoUrl2={selectedPhoto2}
                    configKey={configKey} 
                    rawDatabase={rawDatabase} 
                  />
                  <button 
                    onClick={() => downloadFlyer(elementId, shape)} 
                    disabled={downloadingId !== null} 
                    className="w-full bg-slate-900 text-white font-black py-4 rounded-lg uppercase tracking-widest disabled:opacity-50 hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    {isDownloadingThis ? 'Downloading...' : `Download ${shape} Layout`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 flex justify-center items-center">
      <div className="bg-white max-w-xl w-full p-8 rounded-2xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
        <h1 className="text-3xl font-black mb-8 uppercase italic tracking-tighter border-b pb-4">Aretifi Studio</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input required name="businessName" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg" placeholder="Business Name" />
          
          <div className="grid grid-cols-2 gap-5">
            <input required name="field" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg" placeholder="Trade (e.g. Plumbing)" />
            <input 
              required 
              name="phone" 
              minLength={9}
              title="Please enter at least 9 digits"
              onChange={handleInputChange} 
              className="w-full border-2 p-3 rounded-lg" 
              placeholder="Phone Number" 
            />
          </div>

          <div className="pt-2 pb-2">
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Services Offered</label>
            <div className="grid grid-cols-2 gap-3">
              <input required name="service1" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg text-sm" placeholder="Service 1 (e.g. Roof Repair)" />
              <input required name="service2" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg text-sm" placeholder="Service 2 (e.g. Leak Fixes)" />
              <input name="service3" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg text-sm" placeholder="Service 3 (Optional)" />
              <input name="service4" onChange={handleInputChange} className="w-full border-2 p-3 rounded-lg text-sm" placeholder="Service 4 (Optional)" />
            </div>
          </div>
          
          <select name="themeColor" onChange={handleInputChange} value={formData.themeColor} className="w-full border-2 p-3 rounded-lg bg-white">
            {THEME_COLORS.map(color => (
              <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)} Theme</option>
            ))}
          </select>
          
          <button type="submit" disabled={Object.keys(rawDatabase).length === 0} className="w-full bg-slate-900 text-white font-black py-4 rounded-lg uppercase tracking-widest disabled:opacity-50 mt-4">Generate</button>
        </form>
      </div>
    </main>
  );
}
