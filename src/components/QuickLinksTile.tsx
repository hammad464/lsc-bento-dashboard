import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Link2, Plus, Trash2, X, Search, Globe, Pencil, Check, Star } from 'lucide-react';
import { SiGithub, SiGoogle, SiBlack, SiStackoverflow } from 'react-icons/si';
import LinkCard from './LinkCard';

interface QuickLink {
  id: string;
  name: string;
  description: string;
  url: string;
  iconType: 'github' | 'google' | 'slack' | 'stackoverflow' | 'default';
  color: string;
  isPinned?: boolean;
}

const DEFAULT_LINKS: QuickLink[] = [
  {
    id: '1',
    name: 'GitHub',
    description: 'Code & Repos',
    url: 'https://github.com',
    iconType: 'github',
    color: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900',
    isPinned: true
  },
  {
    id: '2',
    name: 'Google',
    description: 'Search anything',
    url: 'https://google.com',
    iconType: 'google',
    color: 'bg-blue-500 dark:bg-[#B6F500] text-white dark:text-gray-900',
    isPinned: true
  },
  {
    id: '3',
    name: 'Slack',
    description: 'Team Chat',
    url: 'https://app.slack.com',
    iconType: 'slack',
    color: 'bg-purple-600 text-white',
    isPinned: true
  },
  {
    id: '4',
    name: 'Stack Overflow',
    description: 'Q&A Community',
    url: 'https://stackoverflow.com',
    iconType: 'stackoverflow',
    color: 'bg-orange-500 text-white',
    isPinned: true
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

const computeLinkTheme = (url: string) => {
  const normalized = url.toLowerCase();
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

  return { iconType, color };
};

const formatUrl = (rawUrl: string) => {
  let formattedUrl = rawUrl.trim();
  if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = 'https://' + formattedUrl;
  }
  return formattedUrl;
};

const QuickLinksTile = () => {
  const [links, setLinks] = useState<QuickLink[]>(() => {
    const saved = localStorage.getItem('bento-dashboard-quicklinks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If no links have explicitly set isPinned, migrate first 4 as pinned
          const hasAnyPinned = parsed.some((l: QuickLink) => l.isPinned === true);
          if (!hasAnyPinned) {
            return parsed.map((l: QuickLink, idx: number) => ({
              ...l,
              isPinned: idx < 4
            }));
          }
          return parsed;
        }
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

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // Pin warning state
  const [pinWarning, setPinWarning] = useState<string | null>(null);

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
      const formattedUrl = formatUrl(newUrl);
      const { iconType, color } = computeLinkTheme(formattedUrl);

      // Auto-pin new link if less than 4 links are pinned
      const pinnedCount = links.filter(l => l.isPinned).length;

      const newLink: QuickLink = {
        id: Date.now().toString(),
        name: newName.trim(),
        description: newDesc.trim() || 'Quick shortcut',
        url: formattedUrl,
        iconType,
        color,
        isPinned: pinnedCount < 4
      };

      setLinks([...links, newLink]);
      setNewName('');
      setNewDesc('');
      setNewUrl('');
    }
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    if (editingId === id) {
      cancelEditing();
    }
  };

  const startEditing = (link: QuickLink) => {
    setEditingId(link.id);
    setEditName(link.name);
    setEditDesc(link.description);
    setEditUrl(link.url);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDesc('');
    setEditUrl('');
  };

  const saveEditing = (id: string) => {
    if (editName.trim() && editUrl.trim()) {
      const formattedUrl = formatUrl(editUrl);
      const { iconType, color } = computeLinkTheme(formattedUrl);

      setLinks(links.map(link => {
        if (link.id === id) {
          return {
            ...link,
            name: editName.trim(),
            description: editDesc.trim() || 'Quick shortcut',
            url: formattedUrl,
            iconType,
            color
          };
        }
        return link;
      }));
      cancelEditing();
    }
  };

  const togglePin = (id: string) => {
    const target = links.find(l => l.id === id);
    if (!target) return;

    const currentPinned = links.filter(l => l.isPinned);
    if (!target.isPinned && currentPinned.length >= 4) {
      setPinWarning('Maximum 4 links can be pinned to the main screen. Unpin another link first.');
      setTimeout(() => setPinWarning(null), 3500);
      return;
    }

    setPinWarning(null);
    setLinks(links.map(l => l.id === id ? { ...l, isPinned: !l.isPinned } : l));
  };

  const filteredLinks = links.filter(link => 
    link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute 4 links for main screen view (pinned items first, then unpinned to fill up to 4)
  const pinnedLinks = links.filter(l => l.isPinned);
  const unpinnedLinks = links.filter(l => !l.isPinned);
  const mainScreenLinks = [...pinnedLinks, ...unpinnedLinks].slice(0, 4);

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
      
      {/* Show 4 selected/pinned links in the main tile view */}
      <div className="flex flex-col gap-3 flex-grow overflow-y-auto custom-scrollbar">
        {mainScreenLinks.length > 0 ? (
          mainScreenLinks.map((link) => (
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
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {links.length} total shortcut links
                  </span>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 flex items-center gap-1">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    {pinnedLinks.length}/4 Main Screen
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Pin Limit Alert Banner */}
            {pinWarning && (
              <div className="px-6 py-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-center justify-between animate-fade-in">
                <span>{pinWarning}</span>
                <button onClick={() => setPinWarning(null)} className="hover:opacity-75">
                  <X size={14} />
                </button>
              </div>
            )}

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
                filteredLinks.map((link) => {
                  const isEditing = editingId === link.id;

                  if (isEditing) {
                    return (
                      <div
                        key={link.id}
                        className="flex flex-col gap-3 p-4 rounded-2xl border bg-blue-50/50 dark:bg-gray-800/90 border-blue-200 dark:border-blue-500/30 shadow-md animate-fade-in"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#B6F500]">
                            Editing Link
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => saveEditing(link.id)}
                              disabled={!editName.trim() || !editUrl.trim()}
                              className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-1 text-xs font-semibold px-3"
                              title="Save changes"
                            >
                              <Check size={14} />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all flex items-center gap-1 text-xs font-semibold px-2.5"
                              title="Cancel"
                            >
                              <X size={14} />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Link Title"
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            placeholder="Description"
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            placeholder="URL"
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={link.id}
                      className={`flex items-center justify-between gap-3 p-4 rounded-2xl border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 group ${
                        link.isPinned ? 'ring-1 ring-amber-400/40 dark:ring-amber-500/30' : ''
                      }`}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <div className={`p-3 rounded-xl ${link.color} shadow-sm shrink-0 flex items-center justify-center`}>
                          {getIcon(link.iconType)}
                        </div>
                        <div className="ml-4 flex flex-col overflow-hidden">
                          <div className="flex items-center gap-2">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-base text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-[#B6F500] transition-colors truncate"
                            >
                              {link.name}
                            </a>
                            {link.isPinned && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 shrink-0">
                                Main Screen
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 truncate mt-0.5 max-w-[280px]">
                            {link.url}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                            {link.description}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => togglePin(link.id)}
                          className={`p-2 rounded-xl transition-all ${
                            link.isPinned
                              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                              : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          title={link.isPinned ? 'Unpin from main screen' : 'Pin to main screen (max 4)'}
                          aria-label="Toggle pin main screen"
                        >
                          <Star size={18} className={link.isPinned ? 'fill-amber-500' : ''} />
                        </button>
                        <button
                          onClick={() => startEditing(link)}
                          className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-[#B6F500] hover:bg-blue-50 dark:hover:bg-gray-700 rounded-xl transition-all"
                          title="Edit link"
                          aria-label="Edit link"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                          title="Delete link"
                          aria-label="Delete link"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })
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