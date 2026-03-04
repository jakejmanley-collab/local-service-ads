'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('flyer_orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  };

  const handleGenerate = async (order: any) => {
    if (!order.details) {
      alert("Missing customer details! They may not have completed the intake form yet.");
      return;
    }

    setProcessingId(order.id);
    
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, details: order.details }) 
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      alert('Success! 5 Premium Flyers Generated and saved.');
      fetchOrders(); 
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
    
    setProcessingId(null);
  };

  if (loading) return <div className="p-10 font-bold text-slate-500">Loading Orders...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black uppercase italic mb-8">Admin HQ: Flyer Orders</h1>
        
        <div className="space-y-4">
          {orders.length === 0 && <p className="text-slate-500">No orders yet.</p>}
          
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1">{new Date(order.created_at).toLocaleString()}</p>
                <p className="font-bold text-lg">{order.customer_email}</p>
                <p className="text-sm font-medium text-slate-500">{order.trade || 'Unknown Trade'}</p>
                <div className="mt-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {order.status === 'needs_generation' && (
                <button 
                  onClick={() => handleGenerate(order)}
                  disabled={processingId === order.id}
                  className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 whitespace-nowrap transition-all"
                >
                  {processingId === order.id ? 'Generating 5 Images (30s)...' : 'Run AI Generation'}
                </button>
              )}

              {order.status === 'delivered' && (
                <div className="flex gap-2">
                  {[order.image_1, order.image_2, order.image_3, order.image_4, order.image_5].map((img, i) => (
                    img ? <a key={i} href={img} target="_blank" rel="noreferrer" className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden border border-slate-200 hover:scale-110 transition-transform"><img src={img} className="w-full h-full object-cover" alt="Premium flyer thumbnail" /></a> : null
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
