"use client";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-green-100 via-emerald-200 to-green-300">

      <div className="backdrop-blur-xl bg-white/30 border border-white/40 
      shadow-2xl rounded-3xl p-12 text-center space-y-6 w-[420px]
      animate-[fadeInUp_0.7s_ease-out]">

        <h1 className="text-4xl font-extrabold text-green-900">
          Appliance System
        </h1>

        <p className="text-green-800 text-sm opacity-80">
          Manage your home appliances efficiently
        </p>

        <div className="space-y-4">

          {[
            { name: "Add Appliance", link: "/add" },
            { name: "Search Appliance", link: "/search" },
            { name: "Update Appliance", link: "/update" },
            { name: "Delete Appliance", link: "/delete" },
          ].map((item, i) => (
            <a
              key={i}
              href={item.link}
              className="block text-xl font-semibold text-green-800 
              bg-white/40 rounded-xl py-3 backdrop-blur-md border border-white/30
              hover:bg-white/60 hover:scale-105 transition duration-300 shadow-md"
            >
              {item.name}
            </a>
          ))}

        </div>
      </div>
    </div>
  );
}


