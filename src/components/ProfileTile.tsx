import { User } from 'lucide-react';

const ProfileTile = () => {
  return (
    <div className="flex items-center p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-sm border border-indigo-400 col-span-1 md:col-span-3 row-span-1 text-white">
      <div className="bg-white/20 p-4 rounded-full backdrop-blur-md mr-6">
        <User size={40} className="text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, Hammad & Muneeb!
        </h2>
        <p className="text-indigo-100 mt-1 font-medium text-lg">
          Ready to boost your productivity today?
        </p>
      </div>
    </div>
  );
};

export default ProfileTile;
