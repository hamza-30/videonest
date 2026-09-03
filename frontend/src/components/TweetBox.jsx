import { useRef, useEffect, useState } from "react";
import { RiEmotionLine } from "react-icons/ri";
import { EMOJI_CATEGORIES } from "../constants/emojis";

function TweetBox({ user, addTweet }) {
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current && textareaRef.current.scrollHeight > 0) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        52
      )}px`;
    }
  }, [content]);

  // Close emoji picker on outside click or escape key
  useEffect(() => {
    if (!showEmojiPicker) return;

    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showEmojiPicker]);

  const handleEmojiSelect = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + emoji);
      return;
    }

    const start = textarea.selectionStart ?? content.length;
    const end = textarea.selectionEnd ?? content.length;
    const updated = content.slice(0, start) + emoji + content.slice(end);

    setContent(updated);

    // Keep focus and position cursor right after inserted emoji
    requestAnimationFrame(() => {
      textarea.focus();
      const newPos = start + emoji.length;
      textarea.setSelectionRange(newPos, newPos);
    });
  };

  const [isPosting, setIsPosting] = useState(false);

  const handlePostSubmit = async () => {
    if (!content.trim() || isPosting) return;

    try {
      setIsPosting(true);
      const success = await addTweet(content);
      if (success) {
        setContent("");
        setShowEmojiPicker(false);
      }
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex gap-4 border-b border-gray-200 px-4 py-6 sm:px-8">
      {/* Current User Avatar */}
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#8132e5]/10">
        <img
          src={user?.avatar}
          alt={user?.fullName || user?.username || "Current User"}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full flex-col">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={(e) => {
            if (e.target.scrollHeight > 0) {
              e.target.style.height = `${Math.max(e.target.scrollHeight, 52)}px`;
            }
          }}
          placeholder="Write a tweet"
          className="w-full min-h-13 resize-none overflow-hidden bg-transparent pt-1 text-base text-slate-800 outline-none placeholder:text-gray-500"
          rows={2}
        />

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          {/* Left side actions */}
          <div className="flex items-center gap-2"></div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Emoji Menu Trigger & Popover */}
            <div className="relative">
              <button
                ref={emojiButtonRef}
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  showEmojiPicker
                    ? "bg-[#8132e5]/10 text-[#8132e5]"
                    : "text-[#8132e5] hover:bg-[#8132e5]/10"
                }`}
                aria-label="Add emoji"
                aria-expanded={showEmojiPicker}
              >
                <RiEmotionLine className="h-5.5 w-5.5" />
              </button>

              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-full right-0 mb-3 z-50 w-72 sm:w-80 rounded-2xl border border-gray-200 bg-white p-2.5 shadow-xl shadow-slate-300/40"
                >
                  {/* Category Switcher Tabs (9 Global Unicode Categories) */}
                  <div className="flex items-center justify-between gap-1 border-b border-gray-100 pb-2 mb-2 px-1">
                    {EMOJI_CATEGORIES.map((cat, idx) => (
                      <button
                        key={cat.id}
                        type="button"
                        title={cat.name}
                        onClick={() => setActiveCategory(idx)}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm transition-all cursor-pointer ${
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
                        onClick={() => handleEmojiSelect(emoji)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-transform hover:scale-125 hover:bg-gray-100 active:scale-95 cursor-pointer select-none"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handlePostSubmit}
              disabled={!content.trim() || isPosting}
              className="ml-2 rounded-full bg-[#8132e5] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7026c8] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {isPosting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TweetBox;
