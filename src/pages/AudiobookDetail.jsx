// src/pages/AudiobookDetail.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { audiobookService } from "../services/audiobookService";

export const AudiobookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audiobook, setAudiobook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    current_time: 0,
    completed: false,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showTranscript, setShowTranscript] = useState(true);
  const [activeLine, setActiveLine] = useState(0);
  const audioRef = useRef(null);
  const transcriptRef = useRef(null);

  // Transcripción de ejemplo (reemplazar con datos reales)
  const [transcript] = useState([
    {
      start: 0,
      end: 8,
      text: "Good morning! How are you today?",
      translation: "¡Buenos días! ¿Cómo estás hoy?",
    },
    {
      start: 8,
      end: 15,
      text: "I'm fine, thank you. And you?",
      translation: "Estoy bien, gracias. ¿Y tú?",
    },
    {
      start: 15,
      end: 22,
      text: "I'm doing great, thanks for asking.",
      translation: "Me va genial, gracias por preguntar.",
    },
    {
      start: 22,
      end: 30,
      text: "What are your plans for the weekend?",
      translation: "¿Cuáles son tus planes para el fin de semana?",
    },
    {
      start: 30,
      end: 38,
      text: "I'm thinking about going to the beach.",
      translation: "Estoy pensando en ir a la playa.",
    },
    {
      start: 38,
      end: 45,
      text: "That sounds wonderful! Enjoy your time.",
      translation: "¡Suena maravilloso! Disfruta tu tiempo.",
    },
  ]);

  useEffect(() => {
    loadAudiobook();
    loadProgress();
  }, [id]);

  useEffect(() => {
    if (audioRef.current && progress.current_time > 0 && !progress.completed) {
      audioRef.current.currentTime = progress.current_time;
    }
  }, [progress]);

  const loadAudiobook = async () => {
    try {
      const res = await audiobookService.getById(id);
      if (res.data.success) {
        setAudiobook(res.data.audiobook);
      }
    } catch (error) {
      console.error("Error loading audiobook:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const res = await audiobookService.getProgress(id);
      if (res.data.success && res.data.progress) {
        setProgress(res.data.progress);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const saveProgress = async (currentTime, completed = false) => {
    try {
      await audiobookService.updateProgress(id, { currentTime, completed });
      if (completed) {
        setProgress((prev) => ({ ...prev, completed: true }));
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handlePlay = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);

      // Solo guardar progreso si no está completado
      if (!progress.completed) {
        saveProgress(time);
      }

      // Resaltar línea activa en transcripción
      const lineIndex = transcript.findIndex(
        (line) => time >= line.start && time <= line.end,
      );
      if (lineIndex !== activeLine && lineIndex !== -1) {
        setActiveLine(lineIndex);
        if (transcriptRef.current) {
          const activeElement = transcriptRef.current.children[lineIndex];
          activeElement?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    // Marcar como completado cuando termina
    if (!progress.completed) {
      saveProgress(duration, true);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleLineClick = (startTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isVideo = () => {
    if (!audiobook?.audioUrl) return false;
    const videoExt = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
    return videoExt.some((ext) =>
      audiobook.audioUrl.toLowerCase().includes(ext),
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Cargando audiolibro...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!audiobook) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">🎧</span>
          <p className="text-gray-500 text-lg">Audiolibro no encontrado</p>
          <button
            onClick={() => navigate("/audiobooks")}
            className="mt-4 text-primary hover:underline"
          >
            Volver a audiolibros
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6"> </div>
          {/* Columna izquierda: Información y reproductor */}
          <div className="lg:col-span-2 space-y-6">
            <nav className="flex mb-6 text-sm">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-gray-500 hover:text-primary"
              >
                Dashboard
              </button>
              <span className="mx-2 text-gray-400">/</span>
              <button
                onClick={() => navigate("/audiobooks")}
                className="text-gray-500 hover:text-primary"
              >
                Audiolibros
              </button>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900 font-medium">
                {audiobook.title}
              </span>
            </nav>

            {/* Portada */}
            <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-center">
              <div className="w-40 h-40 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center text-7xl mb-4">
                {isVideo() ? "🎥" : "🎧"}
              </div>
              <h1 className="text-xl font-bold text-white">
                {audiobook.title}
              </h1>
              <p className="text-white text-sm mt-1">
                {audiobook.narrator || "Narrador desconocido"}
              </p>
              <div className="flex justify-center gap-2 mt-3">
                <span className="px-2 py-0.5 bg-primary/10 text-white rounded-full text-xs font-semibold">
                  {audiobook.level}
                </span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {audiobook.duration || formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Reproductor */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              {/* Controles principales: Play/Pause */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={!isPlaying ? handlePlay : handlePause}
                  disabled={progress.completed}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition ${
                    progress.completed
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary-dark shadow-lg"
                  }`}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>

               {/*  {isPlaying && (
                  <button
                    onClick={handlePause}
                    className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex items-center justify-center"
                  >
                    ⏸
                  </button>
                )} */}
              </div>

              {isVideo() ? (
                <video
                  ref={audioRef}
                  src={audiobook.audioUrl}
                  className="w-full rounded-xl mb-4"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleEnded}
                />
              ) : (
                <audio
                  ref={audioRef}
                  src={audiobook.audioUrl}
                  className="hidden"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleEnded}
                />
              )}

              {/* Barra de progreso personalizada */}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  disabled={progress.completed}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
                />
              </div>

              {/* Controles de velocidad y volumen */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlaybackRateChange(0.75)}
                    className={`px-2 py-1 rounded text-xs font-semibold transition ${
                      playbackRate === 0.75
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    0.75x
                  </button>
                  <button
                    onClick={() => handlePlaybackRateChange(1)}
                    className={`px-2 py-1 rounded text-xs font-semibold transition ${
                      playbackRate === 1
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    1x
                  </button>
                  <button
                    onClick={() => handlePlaybackRateChange(1.25)}
                    className={`px-2 py-1 rounded text-xs font-semibold transition ${
                      playbackRate === 1.25
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    1.25x
                  </button>
                  <button
                    onClick={() => handlePlaybackRateChange(1.5)}
                    className={`px-2 py-1 rounded text-xs font-semibold transition ${
                      playbackRate === 1.5
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    1.5x
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              {/* Progreso general */}
              {progress.completed && (
                <div className="mt-4 p-2 bg-green-50 rounded-lg text-center">
                  <span className="text-sm text-green-600 font-semibold">
                    ✅ Audiolibro completado
                  </span>
                </div>
              )}
            </div>

            {/* Descripción */}
            {audiobook.description && (
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-800 mb-2">
                  📖 Acerca de este audiolibro
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {audiobook.description}
                </p>
              </div>
            )}
          </div>

          {/* Columna derecha: Transcripción */}
          <div className="lg:col-span-2" style={{ display: "none" }}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-gray-900">📝 Transcripción</h2>
                  <p className="text-sm text-gray-500">
                    Haz clic en cualquier línea para ir a ese momento
                  </p>
                </div>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="text-sm text-primary hover:underline"
                >
                  {showTranscript ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              {showTranscript && (
                <div
                  ref={transcriptRef}
                  className="p-6 space-y-3 max-h-[500px] overflow-y-auto"
                >
                  {transcript.map((line, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        !progress.completed && handleLineClick(line.start)
                      }
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        idx === activeLine
                          ? "bg-primary/10 border-l-4 border-primary shadow-sm"
                          : "hover:bg-gray-50 border-l-4 border-transparent"
                      } ${progress.completed ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xs text-gray-400 font-mono mt-0.5 min-w-[45px]">
                          {formatTime(line.start)}
                        </span>
                        <div className="flex-1">
                          <p
                            className={`${idx === activeLine ? "font-semibold text-gray-900" : "text-gray-700"}`}
                          >
                            {line.text}
                          </p>
                          {line.translation && (
                            <p className="text-gray-500 text-sm mt-1 italic">
                              {line.translation}
                            </p>
                          )}
                        </div>
                        {idx === activeLine && !progress.completed && (
                          <span className="text-primary text-sm animate-pulse">
                            ▶
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
