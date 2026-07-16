import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  completed: boolean;
}

const NotesQuickAddTile = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Review Q3 goals tomorrow',
      completed: false,
    },
    {
      id: '2',
      content: 'Finish dashboard project',
      completed: true,
    },
  ]);
  const [input, setInput] = useState('');

  const addNote = () => {
    if (input.trim()) {
      setNotes([
        {
          id: Date.now().toString(),
          content: input,
          completed: false,
        },
        ...notes,
      ]);
      setInput('');
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

  return (
    <div className="md:col-span-3 row-span-1 h-[220px] rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Tasks</h3>
        <span className="px-3 py-1 bg-blue-100 dark:bg-[#B6F500]/20 text-blue-600 dark:text-[#B6F500] text-sm font-bold rounded-full">
          {notes.filter(n => !n.completed).length} pending
        </span>
      </div>

      {/* Input area */}
      <div className="flex gap-3 mb-3 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 pr-14 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border-2 border-transparent focus:border-blue-500/30 dark:focus:border-[#B6F500]/40 focus:bg-white dark:focus:bg-gray-800 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-inner"
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
              className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all duration-300 group ${
                note.completed 
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
              
              <p className={`text-base flex-1 break-words transition-all duration-300 ${
                note.completed 
                  ? 'text-gray-400 dark:text-gray-500 line-through' 
                  : 'text-gray-700 dark:text-gray-200 font-medium'
              }`}>
                {note.content}
              </p>
              
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
    </div>
  );
};

export default NotesQuickAddTile;
