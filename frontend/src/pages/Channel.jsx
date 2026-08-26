import { useParams } from "react-router-dom";
import ChannelInformation from "../components/ChannelInformation";

function Channel() {
  const { username } = useParams();

  return (
    <div>
      <ChannelInformation username={username} />
    </div>
  );
}

export default Channel;
