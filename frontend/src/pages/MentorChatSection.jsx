import { useState } from "react";
import { Button } from "../components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Image, Phone, Video, Info, Smile } from "lucide-react";
import profilePic from "../../public/images/mentor.jpg";

import EmojiPicker from 'emoji-picker-react';


const MentorChatPage = () => {
  const [hasPaid, setHasPaid] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const mentor = {
    name: "piyush singh",
    college: "ITS ghaziabad",
    course: "BCA",
    profilePic: profilePic,
    rating: 4.8,
    reviews: [
      { reviewer: "Piyush", text: "Very helpful and knowledgeable!" },
      { reviewer: "Anjali", text: "Gave amazing insights about the admission process." }
    ],
    history: [
      "Helped 20+ students",
      "Specializes in programming counseling",
      "5 years of mentoring experience"
    ]
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { type: "text", content: newMessage, sender: "user" }]);
      setNewMessage("");
    }
    if (fileName) {
      setMessages([...messages, { type: "file", content: fileName, sender: "user" }]);
      setFileName("");
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji.native);
  };


  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Left Panel */}
      <aside className="w-1/4 bg-white dark:bg-gray-800 p-4 border-r dark:border-gray-700">
        <div className="flex flex-col items-center text-center">
          <img src={mentor.profilePic} alt="mentor" className="w-24 h-24 rounded-full mb-4" />
          <h2 className="text-xl font-bold">{mentor.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{mentor.college}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{mentor.course}</p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">Mentorship Chat</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">
                <Info className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <h4 className="text-lg font-bold mb-2">{mentor.name}'s Profile</h4>
              <ul className="text-sm mb-4 list-disc pl-4 space-y-1">
                <li><strong>College:</strong> {mentor.college}</li>
                <li><strong>Course:</strong> {mentor.course}</li>
                <li><strong>Rating:</strong> {mentor.rating} ⭐</li>
              </ul>
              <h5 className="font-semibold">Experience</h5>
              <ul className="text-sm list-disc pl-4 mb-2">
                {mentor.history.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <h5 className="font-semibold">Reviews</h5>
              {mentor.reviews.map((r, i) => (
                <p key={i} className="text-sm italic">“{r.text}” - {r.reviewer}</p>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        {/* Chat Section */}
        {!hasPaid ? (
          <div className="flex-1 flex items-center justify-center">
            <Button
              onClick={() => setHasPaid(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-lg px-6 py-3"
            >
              Pay ₹99 to Start Chat
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-around p-3 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> Call
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Video className="w-4 h-4" /> Video Call
              </Button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-sm p-3 rounded-lg ${msg.sender === "user"
                    ? "ml-auto bg-blue-100 dark:bg-blue-800"
                    : "mr-auto bg-gray-200 dark:bg-gray-700"
                    }`}
                >
                  {msg.type === "text" ? msg.content : <a href="#" className="underline">{msg.content}</a>}
                </div>
              ))}
            </div>

            {/* Input Section */}
            <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-2 relative">
              <Button
                variant="ghost"
                className="p-2"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </Button>

              {showEmojiPicker && (
                <div className="absolute bottom-16 left-0 z-50">
                  <div className="shadow-md rounded-lg">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => setNewMessage(prev => prev + emojiData.emoji)}
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
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files[0].name)}
                />
              </label>

              <Button onClick={handleSendMessage}>Send</Button>
            </div>


          </div>
        )}
      </main>
    </div>
  );
};

export default MentorChatPage;
