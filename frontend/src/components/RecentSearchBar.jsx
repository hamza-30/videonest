import { GoHistory } from "react-icons/go";
import { FiX } from "react-icons/fi";

function RecentSearchBar({ queryText, onSelect, onDelete }) {
  return (
    <div
      onClick={() => onSelect?.(queryText)}
      className="group hover:bg-gray-100 py-2 px-3.5 cursor-pointer flex items-center justify-between gap-x-2.5 transition-colors duration-100 ease-in-out"
    >
      <div className="flex items-center gap-x-3 min-w-0 flex-1">
        <GoHistory className="text-gray-500 shrink-0 text-base" />
        <span className="text-[14.5px] text-gray-800 truncate">
          {queryText}
        </span>
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(queryText);
          }}
          className="shrink-0 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Remove from history"
          aria-label={`Remove ${queryText} from search history`}
        >
          <FiX className="text-sm" />
        </button>
      )}    
    </div>
  );
}

export default RecentSearchBar;
