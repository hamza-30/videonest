import { useParams } from "react-router-dom";
import ChannelInformation from "../components/ChannelInformation";
import { useState, useEffect } from "react";
import { channelService } from "../services/channelService";

function Channel() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("Videos");
  const [channel, setChannel] = useState(null);
  const [channelLoading, setChannelLoading] = useState(true);
  const [channelError, setChannelError] = useState(null);

  useEffect(() => {
    const getChannel = async () => {
      setChannelLoading(true);
      setChannelError(null);
      try {
        const response = await channelService.getUserChannel(username);
        setChannel(response.data);
      } catch (error) {
        setChannelError(error);
      } finally {
        setChannelLoading(false);
      }
    };

    getChannel();
  }, [username]);

  const tabs = ["Videos", "Playlists", "Tweets", "Subscribed"];

  return (
    <div>
      <ChannelInformation
        channel={channel}
        loading={channelLoading}
        error={channelError}
        setChannel={setChannel}
      />
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
