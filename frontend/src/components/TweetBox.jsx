import { useRef, useEffect, useState } from "react";
import EmojiPicker from "./EmojiPicker";

function TweetBox({ user, addTweet }) {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef(null);

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

  const handlePostSubmit = async () => {
    if (!content.trim() || isPosting) return;

    try {
      setIsPosting(true);
      const success = await addTweet(content);
      if (success) {
        setContent("");
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
            {/* Reusable Emoji Picker */}
            <EmojiPicker onSelectEmoji={handleEmojiSelect} />

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
