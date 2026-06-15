import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const defaultTheme = {
  appBg: ['#F1F0F5', '#E8E5F0', '#DFDAEC', '#E7DDF2'],
  tableBg: ['rgba(226, 232, 240, 0.6)', 'rgba(243, 232, 255, 0.4)', 'rgba(236, 253, 245, 0.3)'],
  borderGradient: ['rgba(20, 184, 166, 0.7)', 'rgba(99, 102, 241, 0.45)', 'rgba(236, 72, 153, 0.6)'],
  statusColors: {
    Received: { bg: "rgba(219, 234, 254, 0.55)", hoverBg: "rgba(191, 219, 254, 0.65)", color: "#1d4ed8", borderColor: "rgba(59, 130, 246, 0.25)" },
    Cut:      { bg: "rgba(254, 243, 199, 0.55)", hoverBg: "rgba(253, 230, 138, 0.65)", color: "#b45309", borderColor: "rgba(245, 158, 11, 0.25)" },
    Lasered:  { bg: "rgba(254, 202, 202, 0.5)",  hoverBg: "rgba(252, 165, 165, 0.6)",  color: "#b91c1c", borderColor: "rgba(239, 68, 68, 0.25)" },
    Stained:  { bg: "rgba(233, 213, 255, 0.55)", hoverBg: "rgba(216, 180, 254, 0.65)", color: "#6d28d9", borderColor: "rgba(139, 92, 246, 0.25)" },
    Painted:  { bg: "rgba(204, 251, 241, 0.55)", hoverBg: "rgba(153, 246, 228, 0.65)", color: "#0f766e", borderColor: "rgba(20, 184, 166, 0.25)" },
    Lacquered: { bg: "rgba(254, 215, 170, 0.55)", hoverBg: "rgba(253, 186, 116, 0.65)", color: "#c2410c", borderColor: "rgba(249, 115, 22, 0.25)" },
    Ready:    { bg: "rgba(220, 252, 231, 0.55)", hoverBg: "rgba(187, 247, 208, 0.65)", color: "#047857", borderColor: "rgba(16, 185, 129, 0.25)" },
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('nexus-custom-theme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultTheme,
          ...parsed,
          statusColors: { ...defaultTheme.statusColors, ...parsed.statusColors }
        };
      } catch (e) {
        return defaultTheme;
      }
    }
    return defaultTheme;
  });

  const updateTheme = (updater) => {
    setTheme(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem('nexus-custom-theme', JSON.stringify(next));
      return next;
    });
  };

  const resetTheme = () => {
    localStorage.removeItem('nexus-custom-theme');
    setTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
