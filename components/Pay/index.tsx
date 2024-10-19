"use client";

import React, { useEffect, useState, useRef } from "react";

export const PayBlock = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [userStream, setUserStream] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [counter, setCounter] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const userVideoRef = useRef(null);
  const recognitionRef = useRef(null);

  const languages = ["Spanish", "French", "German", "Mandarin", "Japanese"];

  useEffect(() => {
    let intervalId;
    if (selectedLanguage) {
      intervalId = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (userStream) {
        userStream.getTracks().forEach((track) => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage, userStream]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setupCamera();
    startContinuousListening();
  };

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setUserStream(stream);
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const toggleAudio = () => {
    if (userStream) {
      userStream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (userStream) {
      userStream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const startContinuousListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = selectedLanguage;
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      handleUserSpeech(transcript);
    };

    recognitionRef.current.onend = () => {
      if (isListening) {
        recognitionRef.current.start();
      }
    };

    recognitionRef.current.start();
    setIsListening(true);
  };

  const handleUserSpeech = async (transcript) => {
    const userMessage = { text: transcript, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Here you would typically send the message to your GPT API
    // For this example, we'll simulate a response
    const aiResponse = { text: `AI response to: ${transcript}`, sender: "ai" };
    setMessages((prevMessages) => [...prevMessages, aiResponse]);

    // Text-to-speech for AI response
    speakText(aiResponse.text);
  };

  const speakText = (text) => {
    setIsSpeaking(true);
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = selectedLanguage;
    speech.onend = () => {
      setIsSpeaking(false);
      if (recognitionRef.current && !recognitionRef.current.recognizing) {
        recognitionRef.current.start();
      }
    };
    window.speechSynthesis.speak(speech);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      startContinuousListening();
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {!selectedLanguage ? (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">
            Select a language to learn:
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {languages.map((language) => (
              <button
                key={language}
                className="bg-blue-500 text-white p-2 rounded"
                onClick={() => handleLanguageSelect(language)}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">
            Learning {selectedLanguage}
          </h2>
          <div className="flex justify-between w-full mb-4">
            <div className="w-1/2 p-2">
              <img
                src="/api/placeholder/320/240"
                alt="AI Teacher"
                className="w-full h-auto object-cover"
              />
              <p className="text-center mt-2">AI Teacher</p>
            </div>
            <div className="w-1/2 p-2">
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted={!isAudioEnabled}
                className="w-full h-auto object-cover"
              />
              <p className="text-center mt-2">You</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold">Time: {counter} seconds</p>
          </div>
          <div className="flex gap-2 mb-4">
            <button
              className={`p-2 rounded ${
                isAudioEnabled ? "bg-green-500" : "bg-red-500"
              } text-white`}
              onClick={toggleAudio}
            >
              {isAudioEnabled ? "Disable Audio" : "Enable Audio"}
            </button>
            <button
              className={`p-2 rounded ${
                isVideoEnabled ? "bg-green-500" : "bg-red-500"
              } text-white`}
              onClick={toggleVideo}
            >
              {isVideoEnabled ? "Disable Video" : "Enable Video"}
            </button>
            <button
              className={`p-2 rounded ${
                isListening ? "bg-green-500" : "bg-red-500"
              } text-white`}
              onClick={toggleListening}
            >
              {isListening ? "Pause Conversation" : "Resume Conversation"}
            </button>
          </div>
          <div className="w-full max-w-md">
            <div className="border border-gray-300 rounded p-2 h-60 overflow-y-auto mb-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {message.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center">
              {isListening && !isSpeaking
                ? "Listening..."
                : isSpeaking
                ? "AI is speaking..."
                : "Conversation paused"}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
