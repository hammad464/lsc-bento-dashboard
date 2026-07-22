import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Link2, Plus, Trash2, X, Search, Globe } from 'lucide-react';
import { SiGithub, SiGoogle, SiBlack, SiStackoverflow } from 'react-icons/si';
import LinkCard from './LinkCard';

interface QuickLink {
  id: string;
  name: string;
  description: string;
  url: string;
  iconType: 'github' | 'google' | 'slack' | 'stackoverflow' | 'default';
  color: string;
}

const DEFAULT_LINKS: QuickLink[] = [
  {
    id: '1',
    name: 'GitHub',
    description: 'Code & Repos',
    url: 'https://github.com',
    iconType: 'github',
    color: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
  },
  {
    id: '2',
    name: 'Google',
    description: 'Search anything',
    url: 'https://google.com',
    iconType: 'google',
    color: 'bg-blue-500 dark:bg-[#B6F500] text-white dark:text-gray-900'
  },
  {
    id: '3',
    name: 'Slack',
    description: 'Team Chat',
    url: 'https://app.slack.com',
    iconType: 'slack',
    color: 'bg-purple-600 text-white'
  },
  {
    id: '4',
    name: 'Stack Overflow',
    description: 'Q&A Community',
    url: 'https://stackoverflow.com',
    iconType: 'stackoverflow',
    color: 'bg-orange-500 text-white'
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case 'github': return <SiGithub size={22} />;
    case 'google': return <SiGoogle size={22} />;
    case 'slack': return <SiBlack size={22} />;
    case 'stackoverflow': return <SiStackoverflow size={22} />;
    default: return <Globe size={22} />;
  }
};

const QuickLinksTile = () => {
  const [links, setLinks] = useState<QuickLink[]>(() => {
    const saved = localStorage.getItem('bento-dashboard-quicklinks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse links from localStorage', e);
      }
    }
    return DEFAULT_LINKS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      localStorage.setItem('bento-dashboard-quicklinks', JSON.stringify(links));
    } else {
      isMounted.current = true;
    }
  }, [links]);

  // Handle body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const addLink = () => {
    if (newName.trim() && newUrl.trim()) {
      let formattedUrl = newUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }

      const normalized = formattedUrl.toLowerCase();
      let iconType: QuickLink['iconType'] = 'default';
      if (normalized.includes('github.com')) iconType = 'github';
      else if (normalized.includes('google.com')) iconType = 'google';
      else if (normalized.includes('slack.com')) iconType = 'slack';
      else if (normalized.includes('stackoverflow.com')) iconType = 'stackoverflow';

      let color = 'bg-emerald-500 text-white';
      if (iconType === 'github') color = 'bg-gray-900 dark:bg-white text-white dark:text-gray-900';
      else if (iconType === 'google') color = 'bg-blue-500 dark:bg-[#B6F500] text-white dark:text-gray-900';
      else if (iconType === 'slack') color = 'bg-purple-600 text-white';
      else if (iconType === 'stackoverflow') color = 'bg-orange-500 text-white';

      const newLink: QuickLink = {
        id: Date.now().toString(),
        name: newName.trim(),
        description: newDesc.trim() || 'Quick shortcut',
        url: formattedUrl,
        iconType,
        color
      };

      setLinks([...links, newLink]);
      setNewName('');
      setNewDesc('');
      setNewUrl('');
    }
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const filteredLinks = links.filter(link => 
    link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="md:col-span-1 row-span-2 rounded-[2rem] bg-[#EEF7F2] dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#d1ebd9] dark:bg-gray-800 rounded-xl text-green-800 dark:text-green-400 shrink-0">
            <Link2 size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Quick Links</h3>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer shrink-0 ml-auto focus:outline-none"
        >
          <span className="text-xs font-normal">View all</span>
          <ArrowRight size={14} />
        </button>
      </div>
      
      {/* Show top 4 links in the main tile view */}
      <div className="flex flex-col gap-3 flex-grow overflow-y-auto custom-scrollbar">
        {links.length > 0 ? (
          links.slice(0, 4).map((link) => (
            <LinkCard
              key={link.id}
              name={link.name}
              description={link.description}
              url={link.url}
              icon={getIcon(link.iconType)}
              color={link.color}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-8">
            <Link2 size={36} className="mb-2 opacity-20" />
            <p className="text-sm font-medium">No links added yet</p>
          </div>
        )}
      </div>

      {/* Modal/Pop-up displaying all links and edit controls */}
      {isModalOpen && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col max-h-[85vh] overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Quick Links</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {links.length} total shortcut links
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Add New Link Area */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col gap-4 shrink-0 bg-gray-50/50 dark:bg-gray-800/10">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Add New Shortcut</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Link Title (e.g. GitHub)"
                  className="px-4 py-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500/30 dark:focus:border-[#B6F500]/40 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm transition-all shadow-sm"
                />
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Short Description"
                  className="px-4 py-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500/30 dark:focus:border-[#B6F500]/40 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm transition-all shadow-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="URL (e.g. github.com)"
                    className="flex-1 min-w-0 px-4 py-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500/30 dark:focus:border-[#B6F500]/40 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm transition-all shadow-sm"
                  />
                  <button
                    onClick={addLink}
                    disabled={!newName.trim() || !newUrl.trim()}
                    className="p-2.5 flex items-center justify-center bg-blue-500 hover:bg-blue-600 dark:bg-[#B6F500] dark:hover:bg-[#88d400] text-white dark:text-gray-900 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-md shrink-0"
                    aria-label="Add link"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full mt-2">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shortcut links..."
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500/30 dark:focus:border-[#B6F500]/40 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 custom-scrollbar">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between gap-3 p-4 rounded-2xl border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className={`p-3 rounded-xl ${link.color} shadow-sm shrink-0 flex items-center justify-center`}>
                        {getIcon(link.iconType)}
                      </div>
                      <div className="ml-4 flex flex-col overflow-hidden">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-base text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-[#B6F500] transition-colors truncate"
                        >
                          {link.name}
                        </a>
                        <span className="text-xs text-gray-400 truncate mt-0.5 max-w-[280px]">
                          {link.url}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                          {link.description}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all flex-shrink-0"
                      aria-label="Delete link"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                  <Link2 size={48} className="mb-4 opacity-20" />
                  <p className="font-medium">No links found</p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default QuickLinksTile;