import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trash2, CheckCircle2, Circle, X, Search, Clock } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  completed: boolean;
  time?: string;
}

const NotesQuickAddTile = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Review Q3 goals tomorrow',
      completed: false,
      time: '10:00',
    },
    {
      id: '2',
      content: 'Finish dashboard project',
      completed: true,
      time: '14:30',
    },
  ]);
  const [input, setInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState('');
  const [modalTimeInput, setModalTimeInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const addNote = () => {
    if (input.trim()) {
      setNotes([
        {
          id: Date.now().toString(),
          content: input,
          completed: false,
          time: timeInput || undefined,
        },
        ...notes,
      ]);
      setInput('');
      setTimeInput('');
    }
  };

  const addModalNote = () => {
    if (modalInput.trim()) {
      setNotes([
        {
          id: Date.now().toString(),
          content: modalInput,
          completed: false,
          time: modalTimeInput || undefined,
        },
        ...notes,
      ]);
      setModalInput('');
      setModalTimeInput('');
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const toggleComplete = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
  };

  // Close modal on escape key
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Disable body scroll when modal is open
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

  // Format 24h string (e.g. "14:30") to 12h string (e.g. "2:30 PM")
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    const [hoursStr, minutesStr] = timeStr.split(':');
    const hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutesStr} ${ampm}`;
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'active') return !note.completed;
    if (filter === 'completed') return note.completed;
    return true;
  });

  return (
    <div className="md:col-span-3 row-span-1 h-[220px] rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Tasks</h3>
          <span className="px-3 py-1 bg-blue-100 dark:bg-[#B6F500]/20 text-blue-600 dark:text-[#B6F500] text-sm font-bold rounded-full">
            {notes.filter(n => !n.completed).length} pending
          </span>
        </div>

        {/* Clickable "View all" button, styled like the Celsius slider */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-1 text-xs font-bold rounded-full bg-blue-500 dark:bg-[#B6F500] text-white dark:text-gray-900 shadow-sm hover:bg-blue-600 dark:hover:bg-[#88d400] transition-all cursor-pointer shrink-0 ml-auto"
        >
          View all
        </button>
      </div>

      {/* Input area */}
      <div className="flex gap-3 mb-3 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 pr-36 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border-2 border-transparent focus:border-blue-500/30 dark:focus:border-[#B6F500]/40 focus:bg-white dark:focus:bg-gray-800 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-inner"
        />
        <input
          type="time"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          className="absolute right-12 top-2 bottom-2 w-22 px-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-700/80 border border-transparent focus:border-blue-500/30 dark:focus:border-[#B6F500]/40 outline-none text-gray-700 dark:text-gray-200 cursor-pointer font-semibold transition-all"
        />
        <button
          onClick={addNote}
          className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-blue-500 hover:bg-blue-600 dark:bg-[#B6F500] dark:hover:bg-[#88d400] text-white dark:text-gray-900 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20 dark:shadow-[#B6F500]/20"
          aria-label="Add note"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 pr-2 custom-scrollbar content-start">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-300 group ${note.completed
                  ? 'bg-gray-50/50 dark:bg-gray-800/30 border-transparent'
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md'
                }`}
            >
              <button
                onClick={() => toggleComplete(note.id)}
                className="flex-shrink-0 focus:outline-none"
              >
                {note.completed ? (
                  <CheckCircle2 size={24} className="text-green-500" />
                ) : (
                  <Circle size={24} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-400 dark:group-hover:text-[#B6F500] transition-colors" />
                )}
              </button>

              <div className="flex-1 flex flex-col min-w-0">
                <p className={`text-base break-words transition-all duration-300 ${note.completed
                    ? 'text-gray-400 dark:text-gray-500 line-through'
                    : 'text-gray-700 dark:text-gray-200 font-medium'
                  }`}>
                  {note.content}
                </p>
                {note.time && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500 dark:text-[#B6F500] mt-1 tracking-wider uppercase bg-blue-50 dark:bg-[#B6F500]/10 px-2 py-0.5 rounded-full w-fit">
                    <Clock size={10} />
                    <span>{formatTime(note.time)}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => deleteNote(note.id)}
                className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                aria-label="Delete note"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-8">
            <CheckCircle2 size={48} className="mb-4 opacity-20" />
            <p className="font-medium">All caught up!</p>
          </div>
        )}
      </div>

      {/* Modal/Pop-up displaying all tasks */}
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">All Tasks</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {notes.filter(n => !n.completed).length} pending • {notes.filter(n => n.completed).length} completed
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

            {/* Input & Filters & Search Area */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col gap-4 shrink-0 bg-gray-50/50 dark:bg-gray-800/10">
              {/* Add Task Input */}
              <div className="flex gap-3 relative">
                <input
                  type="text"
                  value={modalInput}
                  onChange={(e) => setModalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addModalNote();
                    }
                  }}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-3 pr-36 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border-2 border-transparent focus:border-blue-500/30 dark:focus:border-[#B6F500]/40 focus:bg-white dark:focus:bg-gray-800 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-inner"
                />
                <input
                  type="time"
                  value={modalTimeInput}
                  onChange={(e) => setModalTimeInput(e.target.value)}
                  className="absolute right-12 top-2 bottom-2 w-22 px-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-700/80 border border-transparent focus:border-blue-500/30 dark:focus:border-[#B6F500]/40 outline-none text-gray-700 dark:text-gray-200 cursor-pointer font-semibold transition-all"
                />
                <button
                  onClick={addModalNote}
                  className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-blue-500 hover:bg-blue-600 dark:bg-[#B6F500] dark:hover:bg-[#88d400] text-white dark:text-gray-900 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20 dark:shadow-[#B6F500]/20"
                  aria-label="Add task"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500/30 dark:focus:border-[#B6F500]/40 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
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

                {/* Filters */}
                <div className="flex gap-2 w-full sm:w-auto">
                  {(['all', 'active', 'completed'] as const).map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl capitalize transition-all ${filter === filterType
                          ? 'bg-blue-500 text-white dark:bg-[#B6F500] dark:text-gray-900 shadow-md shadow-blue-500/10 dark:shadow-[#B6F500]/10'
                          : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/80 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                        }`}
                    >
                      {filterType}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 custom-scrollbar">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`flex items-center justify-between gap-3 p-4 rounded-2xl border transition-all duration-300 group ${note.completed
                        ? 'bg-gray-50/50 dark:bg-gray-800/30 border-transparent'
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md'
                      }`}
                  >
                    <button
                      onClick={() => toggleComplete(note.id)}
                      className="flex-shrink-0 focus:outline-none"
                    >
                      {note.completed ? (
                        <CheckCircle2 size={24} className="text-green-500" />
                      ) : (
                        <Circle size={24} className="text-gray-300 dark:text-gray-600 hover:text-blue-400 dark:hover:text-[#B6F500] transition-colors" />
                      )}
                    </button>

                    <div className="flex-1 flex flex-col min-w-0">
                      <p className={`text-base break-words transition-all duration-300 ${note.completed
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-700 dark:text-gray-200 font-medium'
                        }`}>
                        {note.content}
                      </p>
                      {note.time && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500 dark:text-[#B6F500] mt-1 tracking-wider uppercase bg-blue-50 dark:bg-[#B6F500]/10 px-2 py-0.5 rounded-full w-fit">
                          <Clock size={10} />
                          <span>{formatTime(note.time)}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all flex-shrink-0"
                      aria-label="Delete task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                  <CheckCircle2 size={48} className="mb-4 opacity-20" />
                  <p className="font-medium">No tasks found</p>
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

export default NotesQuickAddTile;
