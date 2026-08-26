export default function StepCard({ number, icon, title, description }) {

  return (
    <div className="text-center">
      
      {/* Number Circle */}
      <div className="relative flex-1 mb-6 flex justify-center">
        <div 
          className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center ${
            number === "02" ? "bg-yellow-500 text-azul" : "bg-azul text-white"
          }`}
        >
          <span className="text-xl font-bold">{number}</span>
          <div>{icon}</div>
        </div>
        {number !== "03" && (
          <div className="hidden md:flex absolute top-1/2 left-[calc(50%+4rem)] w-[calc(100%-5rem)] shrink-0 -translate-y-1/2 items-center z-0">
      
            {/* Línea punteada (dashed) */}
            <div className="w-full border-t-[3px] border-dashed border-slate-300"></div>
      
            {/* Punta de la flecha apuntando al siguiente paso */}
            <div className="text-slate-300 -ml-2">
              <svg width="24" height="24" viewBox="0 0 24 24"       fill="currentColor">
                <path d="M10 17l5-5-5-5v10z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-azul mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>

    </div>
  );
}