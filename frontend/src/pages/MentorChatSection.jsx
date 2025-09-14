import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Input } from "../components/ui/input";
import { Image, Video, Info, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "../contexts/AuthContext";
import { io } from "socket.io-client";
import { Link } from "react-router-dom"
import { v4 as uuidv4 } from "uuid";

const socket = io(import.meta.env.VITE_SOCKET_URL); 

const MentorChatPage = () => {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const [sessionDetails, setSessionDetails] = useState(null);
  const [mentorDetails, setMentorDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [isSending, setIsSending] = useState(false);


  const profilePic = "/images/mentor.jpg";
  const navigate = useNavigate();


  useEffect(() => {
    if (user?._id) {
      socket.emit("setup", user._id);

      socket.on("setup_complete", (msg) => {
        console.log("Socket setup complete:", msg);
      });
    }

    return () => socket.off("setup_complete");
  }, [user._id]);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) return;

      try {
        const res = await fetch("http://localhost:5000/api/sessions/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch session");
        setSessionDetails(data.session);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  useEffect(() => {
    const fetchMentor = async () => {
      if (!sessionDetails?.mentorId) return;

      try {
        const res = await fetch("http://localhost:5000/api/mentors/me", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mentor: sessionDetails.mentorId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch mentor");
        setMentorDetails(data.mentor);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchMentor();
  }, [sessionDetails]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?._id || !mentorDetails?._id) return;

      const id = user.role === "mentor"
        ? sessionDetails?.studentId
        : sessionDetails?.mentorId;

      try {
        const res = await fetch(
          `http://localhost:5000/api/messages/getMessage?senderId=${user._id}&mentorId=${id}`
        );

        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();
        setMessages(data.map(msg => ({
          type: msg.image ? "file" : "text",
          content: msg.text || msg.image,
          sender: msg.senderId === user._id ? "me" : "other"
        })));
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchMessages();
  }, [user?._id, mentorDetails?._id]);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      console.log("Received message via socket:", data);
      setMessages(prev => [
        ...prev,
        {
          type: data.image ? "file" : "text",
          content: data.text || data.image,
          sender: data.senderId === user._id ? "me" : "other"
        }
      ]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" && !file) return;

    const id = user.role === "mentor"
      ? sessionDetails?.studentId
      : sessionDetails?.mentorId;

    const payload = {
      text: newMessage.trim() || undefined,
      image: file ? await convertFileToBase64(file) : undefined,
      senderId: user._id,
      receiverId: id,
    };

    try {
      setIsSending(true);  // ← Start loading state
      const res = await fetch("http://localhost:5000/api/messages/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      // Emit the message to the other user
      socket.emit("send_message", payload);

      // Append the message to your own chat immediately
      setMessages(prev => [
        ...prev,
        {
          type: payload.image ? "file" : "text",
          content: payload.text || payload.image,
          sender: "me"
        }
      ]);
        setIsSending(false);  // ← Start loading state
      setNewMessage("");
      setFile(null);

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);





  const MakeVideoCall = async () => {

    if (!user || !sessionDetails) {
      console.error("User or session details missing");
      return;
    }

    const sessionId = uuidv4();  // Generate unique session ID
    const callLink = `${window.location.origin}/call/${sessionId}`;  // Full URL link

    console.log("Generated Video Call Link:", callLink);

    try {
      // Determine recipient (another person)
      const receiverId = user.role === "mentor"
        ? sessionDetails.studentId
        : sessionDetails.mentorId;

      if (!receiverId) throw new Error("Receiver ID missing");

      // Send call link as chat message
      const res = await fetch("http://localhost:5000/api/messages/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          text: `📞 Video Call Invitation: ${callLink}`,
          image: undefined,
          senderId: user._id,
          receiverId: receiverId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send video call message");

      // Emit socket message to update in real-time
      socket.emit("send_message", {
        text: `📞 Video Call Invitation: ${callLink}`,
        image: undefined,
        senderId: user._id,
        receiverId: receiverId,
      });

      console.log("Call link sent successfully!");

      // Navigate to the video call page
      navigate(`/call/${sessionId}`);

    } catch (err) {
      console.error("Error in MakeVideoCall:", err.message);
    }
  };


  if (loading)
    return <div className="flex justify-center items-center h-screen">Loading session...</div>;
  if (error)
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  const renderMessageContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return content.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        // Extract the relative path from the URL
        const url = new URL(part);
        const relativePath = url.pathname;

        return (
          <Link
            key={index}
            to={relativePath}
            className="text-blue-600 underline"
          >
            {part}
          </Link>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };


  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      {/* Mentor Info Sidebar */}
      <aside className="w-full md:w-1/4 bg-white dark:bg-gray-800 p-4 border-b md:border-b-0 md:border-r dark:border-gray-700 flex-shrink-0">
        <div className="flex flex-col items-center text-center">
          <img
            src={mentorDetails?.profilePic || profilePic}
            alt="mentor"
            className="w-24 h-24 rounded-full mb-4"
          />

          <h2 className="text-xl font-bold">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => navigate(`/mentor/data/${mentorDetails?._id}`)}
            >
              {mentorDetails?.name || "Loading..."}
            </button>
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            College: {mentorDetails?.college || "N/A"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Branch: {mentorDetails?.branch || "N/A"}
          </p>
        </div>
      </aside>

      {/* Chat Area */}
      {sessionDetails?.isPaymentDone &&
        <main className="flex-1 flex flex-col">

          {/* Chat Header */}
          <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Mentorship Chat
            </h3>

            <div className="flex items-center space-x-4">

              <button onClick={MakeVideoCall} className="flex items-center gap-2 px-4">
                <Video className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Video Call</span>
              </button>


              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="p-2">
                    <Info className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <h4 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">
                    {mentorDetails?.name}'s Profile
                  </h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc pl-5 space-y-1">
                    <li><strong>College:</strong> {mentorDetails?.college || "N/A"}</li>
                    <li><strong>Branch:</strong> {mentorDetails?.branch || "N/A"}</li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Messages Display */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-sm p-3 rounded-lg ${msg.sender === "me"
                  ? "ml-auto bg-blue-100 dark:bg-blue-800"
                  : "mr-auto bg-gray-200 dark:bg-gray-700"
                  }`}
              >
                {msg.type === "text" ? (
                  renderMessageContent(msg.content)
                ) : (
                  <img
                    src={msg.content}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>



          {/* Message Input */}
          <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col gap-3 relative">

            <div className="flex items-center gap-2">
              <Button variant="ghost" className="p-2" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <Smile className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </Button>

              {showEmojiPicker && (
                <div className="absolute bottom-20 left-0 z-50">
                  <div className="shadow-md rounded-lg">
                    <EmojiPicker
                      onEmojiClick={(emojiObject) => setNewMessage(prev => prev + emojiObject.emoji)}
                      theme="dark"
                    />
                  </div>
                </div>
              )}

              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1"
              />

              <label className="cursor-pointer p-2">
                <Image className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

                    if (selectedFile && selectedFile.size > MAX_SIZE) {
                      alert("File too large! Maximum allowed size is 5MB.");
                      e.target.value = ""; // Clear the input
                      setFile(null);
                      return;
                    }

                    setFile(selectedFile);
                  }}
                />
              </label>
              <Button onClick={handleSendMessage} disabled={isSending}>
                {isSending ? "Sending..." : "Send"}
              </Button>

            </div>

            {file && (
              <div className="flex items-center space-x-4 mt-2">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <button
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>


        </main>
      }
    </div>
  );
};

export default MentorChatPage;
