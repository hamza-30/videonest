import { useParams } from "react-router-dom";
import ChannelInformation from "../components/ChannelInformation";
import { useState } from "react";

function Channel() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("Videos");

  const tabs = ["Videos", "Playlists", "Tweets", "Subscribed"];

  return (
    <div>
      <ChannelInformation username={username} />
      <div className="px-4 sm:px-8">
        <div
          role="tablist"
          aria-label="Channel sections"
          className="grid min-h-10 grid-cols-4 items-stretch rounded-xl bg-[#f5f5f5] p-1"
        >
          {tabs.map((label) => {
            const isActive = activeTab === label;

            return (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(label)}
                className={`relative flex min-w-0 items-center justify-center rounded-lg px-1 text-[11px] font-medium leading-tight transition-colors sm:px-3 sm:text-sm ${
                  isActive
                    ? "bg-white text-[#8132e5] shadow-sm"
                    : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Channel;
