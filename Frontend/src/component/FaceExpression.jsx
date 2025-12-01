import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [detectedMood, setDetectedMood] = useState("");

  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    startVideo();
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error(err));
  };

  const detect = async () => {
    if (!videoRef.current) return;

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (detections[0]?.expressions) {
      const maxExpr = Object.entries(detections[0].expressions)
        .sort((a, b) => b[1] - a[1])[0][0];

      setDetectedMood(maxExpr);
      fetchSongsUsingAxios(maxExpr);
    }
  };

  const fetchSongsUsingAxios = async (mood) => {
    try {
      const response = await axios.get(`http://localhost:3000/songs?mood=${mood}`);
      setSongs(response.data.songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-purple-50 to-purple-100 min-h-screen p-6">
      
      {/* 🌟 Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-8 text-center drop-shadow-lg">
        Mood Song Predictor
      </h1>

      {/* 🎥 Video */}
      <div className="relative mb-6">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          width="640"
          height="480"
          className="rounded-3xl shadow-2xl border-4 border-purple-400"
        />
        {detectedMood && (
          <div className="absolute top-3 left-3 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg text-lg font-semibold animate-pulse">
            Mood: {detectedMood}
          </div>
        )}
      </div>

      {/* 🔍 Detect Mood Button */}
      <button
        onClick={detect}
        className="px-10 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 mb-8"
      >
        Detect Mood
      </button>

      {/* 🎵 Songs List */}
      <div className="mt-8 w-full max-w-4xl space-y-6">
        {songs.length === 0 && (
          <p className="text-gray-500 text-center text-lg">No songs found yet...</p>
        )}
        {songs.map((song) => (
          <div
            key={song._id}
            className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border-l-8 border-purple-500"
          >
            {/* Song Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-purple-800">{song.title}</h3>
              {song.Discription && (
                <p className="text-gray-600 mt-2">{song.Discription}</p>
              )}
              {song.mood && (
                <span className="inline-block mt-3 px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  Mood: {song.mood}
                </span>
              )}
            </div>

            {/* Audio Player */}
            <audio
              controls
              src={song.audio}
              className="w-full md:w-72 mt-4 md:mt-0"
            ></audio>
          </div>
        ))}
      </div>
    </div>
  );
}
