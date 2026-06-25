import React, { useState, useEffect, useRef } from 'react';

const doctorsList = [
  { id: 'dr_smith', name: 'Dr. Smith', specialization: 'Orthodontist' },
  { id: 'dr_jones', name: 'Dr. Jones', specialization: 'Endodontist' },
  { id: 'dr_khan', name: 'Dr. Khan', specialization: 'Periodontist' },
  { id: 'dr_lee', name: 'Dr. Lee', specialization: 'Oral Surgeon' },
];

const ChatBox = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(doctorsList[0]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  // 🧠 Separate chat per doctor
  const [chats, setChats] = useState({
    dr_smith: [
      { sender: 'doctor', text: 'Hello, I am Dr. Smith. How can I help you?', time: '10:00 AM' }
    ],
    dr_jones: [
      { sender: 'doctor', text: 'Hi, Dr. Jones here.', time: '10:00 AM' }
    ],
    dr_khan: [
      { sender: 'doctor', text: 'Welcome to Dr. Khan chat.', time: '10:00 AM' }
    ],
    dr_lee: [
      { sender: 'doctor', text: 'Hello, Dr. Lee speaking.', time: '10:00 AM' }
    ],
  });

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, selectedDoctor]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      sender: 'patient',
      text: input,
      time: getTime()
    };

    setChats((prev) => ({
      ...prev,
      [selectedDoctor.id]: [...prev[selectedDoctor.id], newMsg]
    }));

    setInput('');
  };

  return (
    <div className="flex h-full bg-slate-50 rounded-xl overflow-hidden border">

      {/* LEFT SIDEBAR - DOCTORS LIST */}
      <div className="w-1/3 bg-white border-r flex flex-col">

        <div className="p-3 bg-green-600 text-white font-bold">
          Doctors
        </div>

        <div className="flex-1 overflow-y-auto">

          {doctorsList.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoctor(doc)}
              className={`p-3 cursor-pointer border-b hover:bg-gray-100
                ${selectedDoctor.id === doc.id ? 'bg-green-100' : ''}`}
            >
              <p className="font-semibold">{doc.name}</p>
              <p className="text-xs text-gray-500">{doc.specialization}</p>
            </div>
          ))}

        </div>

      </div>

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="bg-green-600 text-white p-3">
          <p className="font-bold">{selectedDoctor.name}</p>
          <p className="text-xs opacity-80">{selectedDoctor.specialization}</p>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">

          {chats[selectedDoctor.id].map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow
                ${msg.sender === 'patient'
                  ? 'bg-green-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-[10px] mt-1 opacity-70 text-right">
                  {msg.time}
                </p>
              </div>
            </div>
          ))}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 bg-white flex gap-2 border-t">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${selectedDoctor.name}...`}
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
};

export default ChatBox;