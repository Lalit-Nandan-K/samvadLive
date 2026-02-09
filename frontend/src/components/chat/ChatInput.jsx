// frontend/src/components/chat/ChatInput.jsx
import { LoaderIcon, Paperclip } from "lucide-react";

export default function ChatInput({ 
  newMessage, 
  setNewMessage, 
  sendMessage, 
  handleInputChange, 
  handleKeyDown, 
  handleFileChange, 
  inputRef,
  isUploading = false
}) {
  return (
    <div className="p-4 flex border-t shadow-sm">
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload"
        accept="image/*,.pdf,.doc,.docx,.txt"
        disabled={isUploading}
      />
      
      <label
        htmlFor="file-upload"
        className={`cursor-pointer text-2xl p-2 mr-2 rounded-full transition ${
          isUploading 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
        }`}
      >
        {isUploading ? (
          <LoaderIcon className="animate-spin" />
        ) : (
          <Paperclip />
        )}
      </label>

      <input
        type="text"
        ref={inputRef}
        value={newMessage}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="flex-1 border border-gray-300 p-2 rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none px-4"
        placeholder={isUploading ? "Uploading file..." : "Type a message..."}
        disabled={isUploading}
      />

      <button
        onClick={sendMessage}
        className={`ml-2 px-4 py-2 rounded-full transition duration-150 ${
          isUploading || !newMessage.trim()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        disabled={isUploading || !newMessage.trim()}
      >
        Send
      </button>
    </div>
  );
}