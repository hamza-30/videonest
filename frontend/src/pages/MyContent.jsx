import { useEffect, useState } from "react";
import { useAuthContext } from "../context/auth/AuthContextProvider";
import {
  LuCloudUpload,
  LuEye,
  LuUsers,
  LuHeart,
  LuVideo,
} from "react-icons/lu";
import { dashboardService } from "../services/dashboardService";
import { toast } from "react-hot-toast";
import ChannelStatsCard from "../components/ChannelStatsCard";
import ContentTable from "../components/ContentTable";
import UploadVideoModal from "../components/UploadVideoModal";

function MyContent() {
  const { user } = useAuthContext();
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [videosCount, setVideosCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const getStats = async () => {
      setStatsLoading(true);
      try {
        const response = await dashboardService.getChannelStats();
        const data = response.data;
        setTotalViews(data.totalVideoViews);
        setTotalLikes(data.totalLikes);
        setSubscribersCount(data.subscribers);
        setVideosCount(data.totalVideos);
      } catch (err) {
        toast.error(err.message || "Failed to load stats");
      } finally {
        setStatsLoading(false);
      }
    };

    const getVideos = async () => {
      setVideosLoading(true);
      try {
        const response = await dashboardService.getChannelVideos();
        setVideos(response.data || []);
      } catch (err) {
        toast.error(err.message || "Failed to load channel videos");
      } finally {
        setVideosLoading(false);
      }
    };

    getStats();
    getVideos();
  }, []);

  const handleVideoDeleted = (deletedVideoId) => {
    setVideos((prev) => prev.filter((v) => v._id !== deletedVideoId));
    setVideosCount((prev) => Math.max(0, prev - 1));
  };

  const handleVideoUpdated = (updatedVideoId, updates) => {
    setVideos((prev) =>
      prev.map((v) => (v._id === updatedVideoId ? { ...v, ...updates } : v))
    );
  };

  const handleVideoUploaded = (newVideo) => {
    setVideos((prev) => [newVideo, ...prev]);
    setVideosCount((prev) => prev + 1);
  };

  return (
    <>
      <div className="p-4 sm:p-6 w-full space-y-7">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-y-3">
          <h1 className="text-2xl font-semibold text-slate-900">
            Welcome back, {user.fullName}!
          </h1>
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-[0.55rem] bg-[#8132e5] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#7026c8] active:bg-[#7026c8] cursor-pointer"
          >
            <LuCloudUpload className="text-lg" />
            <span>Upload video</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <ChannelStatsCard
            icon={LuEye}
            description="Total Views"
            value={totalViews}
            loading={statsLoading}
          />
          <ChannelStatsCard
            icon={LuUsers}
            description="Total Subscribers"
            value={subscribersCount}
            loading={statsLoading}
          />
          <ChannelStatsCard
            icon={LuHeart}
            description="Total Likes"
            value={totalLikes}
            loading={statsLoading}
          />
          <ChannelStatsCard
            icon={LuVideo}
            description="Total Videos"
            value={videosCount}
            loading={statsLoading}
          />
        </div>

        {/* Channel Videos Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Channel Videos
            </h2>
          </div>

          <ContentTable
            videos={videos}
            loading={videosLoading}
            onVideoDeleted={handleVideoDeleted}
            onVideoUpdated={handleVideoUpdated}
          />
        </div>
      </div>

      <UploadVideoModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onVideoUploaded={handleVideoUploaded}
      />
    </>
  );
}

export default MyContent;
