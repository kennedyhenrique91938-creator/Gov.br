const GovHeader = () => {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* gov.br logo */}
        <img
          src="https://cdn-ai.onspace.ai/onspace/files/SpVBAJcvEPmjvfofNFXtJe/Gov.br_logo.svg"
          alt="gov.br"
          className="h-10 w-auto"
        />
        {/* Accessibility icons */}
        <div className="flex items-center gap-4">
          {/* Contrast icon */}
          <button
            aria-label="Alto contraste"
            className="text-[#1351b4] hover:opacity-75 transition-opacity"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#1351b4" strokeWidth="2" />
              <path d="M12 2a10 10 0 0 1 0 20V2z" fill="#1351b4" />
            </svg>
          </button>
          {/* VLibras / accessibility icon */}
          <button
            aria-label="Acessibilidade para surdos"
            className="text-[#1351b4] hover:opacity-75 transition-opacity"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 5c0-1.1.9-2 2-2h2.5l1.5 4-2 1.5c1 2 2.5 3.5 4.5 4.5L13 11l4 1.5V15c0 1.1-.9 2-2 2A14 14 0 0 1 1 5h2z"
                stroke="#1351b4"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />
              <line x1="18" y1="3" x2="21" y2="6" stroke="#1351b4" strokeWidth="2" strokeLinecap="round" />
              <line x1="21" y1="3" x2="18" y2="6" stroke="#1351b4" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default GovHeader;
