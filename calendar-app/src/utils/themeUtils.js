export const themes = [
  {
    month: 0,
    name: 'Developer Workspace',
    color: '#1e3a8a',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80'
  },
  {
    month: 1,
    name: 'Artificial Intelligence',
    color: '#7c3aed',
    banner: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=80'
  },
  {
    month: 2,
    name: 'Web Development',
    color: '#0891b2',
    banner: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80'
  },
  {
    month: 3,
    name: 'Cloud Computing',
    color: '#0ea5e9',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80'
  },
  {
    month: 4,
    name: 'Startup & Product Building',
    color: '#f59e0b',
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80'
  },
  {
    month: 5,
    name: 'Cybersecurity',
    color: '#16a34a',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80'
  },
  {
    month: 6,
    name: 'Open Source',
    color: '#475569',
    banner: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1920&q=80'
  },
  {
    month: 7,
    name: 'Data Science',
    color: '#4f46e5',
    banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80'
  },
  {
    month: 8,
    name: 'Mobile Development',
    color: '#8b5cf6',
    banner: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1920&q=80'
  },
  {
    month: 9,
    name: 'DevOps',
    color: '#ea580c',
    banner: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1920&q=80'
  },
  {
    month: 10,
    name: 'System Design',
    color: '#6b7280',
    banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80'
  },
  {
    month: 11,
    name: 'Future Tech',
    color: '#ec4899',
    banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=80'
  }
];

export const getThemeForMonth = (monthIndex) => {
  if (monthIndex < 0 || monthIndex > 11) {
    return themes[0];
  }
  return themes[monthIndex] || themes[0];
};

export const applyTheme = (color) => {
  document.documentElement.style.setProperty('--theme-color', color);
  
  // Calculate a light version of the color for backgrounds (e.g., rgba(r,g,b,0.1))
  // Simple hex to rgba conversion
  let r = 0, g = 0, b = 0;
  if (color.length === 7) {
    r = parseInt(color.substring(1, 3), 16);
    g = parseInt(color.substring(3, 5), 16);
    b = parseInt(color.substring(5, 7), 16);
  }
  
  document.documentElement.style.setProperty('--theme-color-light', `rgba(${r}, ${g}, ${b}, 0.15)`);
  document.documentElement.style.setProperty('--theme-color-hover', `rgba(${r}, ${g}, ${b}, 0.25)`);
};
