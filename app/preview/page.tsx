const [status, setStatus] = useState(''); // New state for debugging

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFetching(true);
    setCopy(null);
    setStatus('Starting...');

    try {
      setStatus('Fetching Images...');
      const imgRes = await fetch('/api/generate-trade', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ trade: form.field }) 
      });
      
      if (imgRes.ok) {
        const imgData = await imgRes.json();
        setPhotos([imgData.photo1, imgData.photo2]);
        setStatus('Images OK. Fetching Ad Copy...');
      }

      const copyRes = await fetch('/api/generate-listing', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          businessName: form.businessName, 
          trade: form.field, 
          services: [form.service1, form.service2, form.service3, form.service4].filter(Boolean) 
        }) 
      });

      if (copyRes.ok) {
        const copyData = await copyRes.json();
        setCopy(copyData);
        setStatus('All Assets Ready!');
      } else {
        const errData = await copyRes.json();
        setStatus(`Text API Error: ${copyRes.status} - ${errData.error || 'Unknown'}`);
      }

    } catch (err: any) { 
      setStatus(`Network Error: ${err.message}`);
    }
    
    setIsFetching(false);
    setShow(true);
  };
