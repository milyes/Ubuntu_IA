
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AppID } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, LayoutGrid, List } from 'lucide-react';

interface AppMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAppSelect: (id: AppID) => void;
  icons: Record<AppID, string>;
}

const allApps = [
  { id: 'terminal' as AppID, label: 'Terminal', description: 'Terminal IA Gemini', icon: 'https://img.icons8.com/color/48/000000/terminal.png' },
  { id: 'terminal-alt' as AppID, label: 'Terminal 2', description: 'Terminal Secondaire', icon: 'https://img.icons8.com/color/48/000000/terminal.png' },
  { id: 'ai-chat' as AppID, label: 'Chat IA', description: 'Assistant Neuronal', icon: 'https://img.icons8.com/fluency/48/robot-2.png' },
  { id: 'files' as AppID, label: 'Fichiers', description: 'Gestionnaire Nautilus', icon: 'https://img.icons8.com/color/48/000000/folder-invoices.png' },
  { id: 'browser' as AppID, label: 'Navigateur', description: 'Firefox Ubuntu', icon: 'https://img.icons8.com/color/48/000000/firefox.png' },
  { id: 'neo-browser' as AppID, label: 'NÉO Explorateur', description: 'Intelligence Web', icon: 'https://img.icons8.com/fluency/48/internet.png' },
  { id: 'ubuntu-demo' as AppID, label: 'App Démo', description: 'Composants Ubuntu', icon: 'https://img.icons8.com/fluency/48/code.png' },
  { id: 'vlc' as AppID, label: 'Lecteur VLC', description: 'Multimédia', icon: 'https://img.icons8.com/color/48/000000/vlc.png' },
  { id: 'orbital' as AppID, label: 'Orbital PS4', description: 'Émulateur PS4', icon: 'https://img.icons8.com/fluency/48/controller.png' },
  { id: 'settings' as AppID, label: 'Paramètres', description: 'Configuration', icon: 'https://img.icons8.com/color/48/000000/settings.png' },
  { id: 'about' as AppID, label: 'À propos', description: 'Infos système', icon: 'https://img.icons8.com/color/48/000000/info--v1.png' },
];

const AppMenu: React.FC<AppMenuProps> = ({ isOpen, onClose, onAppSelect, icons }) => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const filteredApps = useMemo(() => {
    return allApps.filter(app => 
      app.label.toLowerCase().includes(search.toLowerCase()) || 
      app.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <motion.div 
            ref={menuRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-4 left-[76px] w-[400px] h-[600px] bg-[#2c001e]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Header / Search */}
            <div className="p-4 border-b border-white/5 bg-black/20">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#E95420] transition-colors" />
                <input 
                  ref={inputRef}
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-8 text-white text-sm outline-none focus:bg-white/10 focus:border-[#E95420]/50 transition-all placeholder:text-white/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* View Controls */}
            <div className="px-4 py-2 flex items-center justify-between text-white/40 border-b border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider">Applications</span>
              <div className="flex space-x-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-3 gap-2">
                  {filteredApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        onAppSelect(app.id);
                        onClose();
                      }}
                      className="flex flex-col items-center p-3 rounded-xl hover:bg-white/10 transition-all group active:scale-95"
                    >
                      <img 
                        src={icons[app.id] || app.icon} 
                        alt={app.label} 
                        className="w-12 h-12 mb-2 drop-shadow-lg group-hover:scale-110 transition-transform" 
                      />
                      <span className="text-white text-[11px] font-medium text-center line-clamp-1">{app.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        onAppSelect(app.id);
                        onClose();
                      }}
                      className="w-full flex items-center p-3 rounded-xl hover:bg-white/10 transition-all group active:scale-[0.98]"
                    >
                      <img 
                        src={icons[app.id] || app.icon} 
                        alt={app.label} 
                        className="w-8 h-8 mr-4 drop-shadow-md" 
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-white text-sm font-medium">{app.label}</span>
                        <span className="text-white/40 text-[10px]">{app.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {filteredApps.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-white/20 py-20">
                  <Search className="w-12 h-12 mb-4 opacity-10" />
                  <p className="text-sm italic">Aucun résultat</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#E95420]"></div>
                <span className="text-[10px] text-white/60 font-medium uppercase tracking-widest">Ubuntu Intelligence</span>
              </div>
              <button 
                onClick={onClose}
                className="text-[10px] text-white/40 hover:text-white transition-colors uppercase font-bold"
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AppMenu;
