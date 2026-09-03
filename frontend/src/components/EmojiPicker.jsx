import { useState, useRef, useEffect } from "react";
import { RiEmotionLine } from "react-icons/ri";
import { EMOJI_CATEGORIES } from "../constants/emojis";

function EmojiPicker({ onSelectEmoji, align = "right", placement = "top" }) {
  const [showPicker, setShowPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  // Close on outside click or escape key
  useEffect(() => {
    if (!showPicker) return;

    const handleClickOutside = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowPicker(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPicker]);

  const handleSelect = (emoji) => {
    if (onSelectEmoji) {
      onSelectEmoji(emoji);
    }
  };

  // Compute position classes based on align & placement
  const positionClasses = [
    placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2.5",
    align === "left" ? "left-0" : "right-0",
  ].join(" ");

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setShowPicker((prev) => !prev)}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer ${
          showPicker
            ? "bg-[#8132e5]/10 text-[#8132e5]"
            : "text-[#8132e5] hover:bg-[#8132e5]/10"
        }`}
        aria-label="Add emoji"
        aria-expanded={showPicker}
      >
        <RiEmotionLine className="h-5 w-5" />
      </button>

      {showPicker && (
        <div
          ref={pickerRef}
          className={`absolute z-50 w-72 sm:w-80 rounded-2xl border border-gray-200 bg-white p-2.5 shadow-xl shadow-slate-300/40 ${positionClasses}`}
        >
          {/* Category Switcher Tabs */}
          <div className="flex items-center justify-between gap-1 border-b border-gray-100 pb-2 mb-2 px-1 overflow-x-auto no-scrollbar">
            {EMOJI_CATEGORIES.map((cat, idx) => (
              <button
                key={cat.id}
                type="button"
                title={cat.name}
                onClick={() => setActiveCategory(idx)}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm transition-all cursor-pointer ${
                  activeCategory === idx
                    ? "bg-[#8132e5]/15 scale-110"
                    : "hover:bg-gray-100 opacity-60 hover:opacity-100"
                }`}
              >
                {cat.icon}
              </button>
            ))}
          </div>

          {/* Active Category Title */}
          <div className="px-1 mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {EMOJI_CATEGORIES[activeCategory].name}
            </span>
          </div>

          {/* Emoji Grid */}
          <div className="grid grid-cols-7 sm:grid-cols-8 gap-1 overflow-y-auto max-h-48 p-1">
            {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(emoji)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-transform hover:scale-125 hover:bg-gray-100 active:scale-95 cursor-pointer select-none"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmojiPicker;
