// /components/chat/ChatInput.jsx
import { Paperclip } from "lucide-react";

export default function ChatInput({ 
  newMessage, 
  setNewMessage, 
  sendMessage, 
  handleInputChange, 
  handleKeyDown, 
  handleFileChange, 
  inputRef 
}) {
  return (
    <div className="p-4 flex border-t shadow-sm">
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer text-2xl p-2 mr-2 text-gray-600 hover:text-blue-500 rounded-full hover:bg-blue-50 transition"
      >
        <Paperclip />
      </label>

      <input
        type="text"
        ref={inputRef}
        value={newMessage}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="flex-1 border border-gray-300 p-2 rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none px-4"
        placeholder="Type a message..."
      />

      <button
        onClick={sendMessage}
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-150"
      >
        Send
      </button>
    </div>
  );
}
