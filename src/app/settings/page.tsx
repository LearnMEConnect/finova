export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account preferences and application settings.</p>
      </header>
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
         <div className="col-span-12 lg:col-span-6 p-8 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-xl flex flex-col gap-4">
           <h3 className="text-xl text-white font-medium">Profile Settings</h3>
           <p className="text-slate-400">Configure your dashboard preferences, toggle analytics, or connect your bank feeds (premium).</p>
           <button className="bg-emerald-500 text-slate-950 font-medium px-6 py-2.5 rounded-lg mt-4 w-fit hover:bg-emerald-600 transition-colors">
             Save Preferences
           </button>
         </div>
      </div>
    </div>
  );
}
