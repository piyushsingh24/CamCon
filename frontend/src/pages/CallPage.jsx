import react, { useState } from "react"
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt"
import { useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const CallPage = () => {

  const { sessionId } = useParams()
  const { user } = useAuth()

  const meeting = async (element) => {
    const appId = 2090852606
    const Secret = "2b66dc8668be36807150aa67547028ca"
    const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, Secret, sessionId, user?._id, user?.name)

    const zp = ZegoUIKitPrebuilt.create(KitToken)
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference
      }
    })

  };
  return (
    <div>
      <div ref={meeting} style={{ width: "100%", height: "100vh", backgroundColor: "#000" }} />
    </div>
  )

}

export default CallPage