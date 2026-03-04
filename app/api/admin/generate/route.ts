const getPrompts = (details: any) => {
  const { businessName, field, phone, websiteUrl, service1, service2 } = details;
  
  const name = businessName || 'Premium Service';
  const trade = field || 'Service';
  const contact = websiteUrl ? websiteUrl : phone;
  const specialty1 = service1 || trade;
  const specialty2 = service2 || 'Professional Service';

  return [
    // Flyer 1: The Diagonal Corporate Layout (Inspired by your electrical & business examples)
    `A professional graphic design flyer layout for a ${trade} business. The background uses dynamic diagonal color blocking in modern brand colors over a clean white base. In the top half, a high-quality photograph of a professional worker. Bold, massive, perfectly spelled typography reads "${name}". A structured section with checkmarks lists "${specialty1}" and "${specialty2}". At the bottom, a solid color diagonal banner contains the text "${contact}". Corporate agency design.`,

    // Flyer 2: The Circular Cutout Design (Inspired by your pressure washing example)
    `A premium service flyer layout for a ${trade} company. The background is a dark, sophisticated texture with bright, sweeping accent shapes. The design features three circular photo frames showing close-up professional ${trade} work. Large, white, modern typography prominently displays "${name}". A bright colored circular badge graphic is included. At the bottom, clear text perfectly displays "${contact}". Highly structured graphic design template.`,

    // Flyer 3: The Grid/Block B2B Style (Inspired by your commercial floor care example)
    `A clean, corporate graphic design flyer for "${name}", a ${trade} business. The layout uses a structured grid with solid colored rectangular blocks in blue and white. A large rectangular hero image of a friendly professional at work. A distinct colored sidebar section clearly lists the services: "${specialty1}" and "${specialty2}". The typography is sans-serif, highly legible, and perfectly spelled. A bold banner at the bottom displays "${contact}". Modern B2B minimalist layout.`,

    // Flyer 4: The Three-Pillar Icon Design (Inspired by your dark "Business Creativity" example)
    `A sleek, modern business flyer layout for "${name}". The top half features a faded photograph of ${trade} equipment seamlessly integrated into a dark background. Below it, large perfect typography reads "${name}". The bottom half features three colorful, distinct rounded blocks side-by-side, each containing an icon. Bold text near the blocks reads "${specialty1}" and "${specialty2}". The contact info "${contact}" is clearly written at the very bottom. High-end printing design.`,

    // Flyer 5: The Diamond/Geometric Conference Layout (Inspired by your online business conference example)
    `An ultra-modern, dynamic graphic design flyer for a ${trade} service named "${name}". The layout features sharp diamond and chevron shapes masking professional photography of the service. High-contrast color blocking using yellow and dark blue over a white background. Clear, bold typography for the company name "${name}". A specific block highlights "${specialty1}". At the bottom, high-contrast text perfectly reads "${contact}". Clean vector graphics style.`
  ];
};
