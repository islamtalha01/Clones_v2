import { AVATARS, VOICES } from "../app/lib/constants";
import { Configuration, StreamingAvatarApi } from "@heygen/streaming-avatar";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Select,
  SelectItem,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import { Microphone, MicrophoneStage } from "@phosphor-icons/react";
import { useChat } from "ai/react";
import clsx from "clsx";
import OpenAI from "openai";
import { useEffect, useRef, useState } from "react";
import InteractiveAvatarTextInput from "./InteractiveAvatarTextInput";
import Timer from "./Timer";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, //use the .env variable
  dangerouslyAllowBrowser: true,
});

export default function InteractiveAvatar() {
  const [time, setTime] = useState(0);
  const [timerStarted, setTimerStarted] = useState(true);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [stream, setStream] = useState(null);
  const [debug, setDebug] = useState("");
  const [avatarId, setAvatarId] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [data, setData] = useState(null);
  const [text, setText] = useState("");
  const [initialized, setInitialized] = useState(false); // Track initialization
  const [recording, setRecording] = useState(false); // Track recording state
  const [avatarLoaded, setAvatarLoaded] = useState(false); // Track avatar loaded state
  const mediaStream = useRef(null);
  const avatar = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const selectedAvatar = AVATARS.find(
    (avatar) => avatar.avatar_states[0].id === avatarId
  );
  const [selectedAvatarPreviewImage, setSelectedAvatarPreviewImage] =
    useState("");
  const { input, setInput, handleSubmit } = useChat({
    onFinish: async (message) => {
      console.log("ChatGPT Response:", message);

      if (!initialized || !avatar.current) {
        setDebug("Avatar API not initialized");
        return;
      }

      // Send the ChatGPT response to the Interactive Avatar
      await avatar.current
        .speak({
          taskRequest: { text: message.content, sessionId: data?.sessionId },
        })
        .catch((e) => {
          setDebug(e.message);
        });
      setIsLoadingChat(false);
    },
    initialMessages: [
      {
        id: "1",
        role: "system",
        content: "You are a helpful assistant.",
      },
    ],
  });

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();
      console.log("Access Token:", token); // Log the token to verify
      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      return "";
    }
  }

  async function loadAvatar() {
    setIsLoadingSession(true);
    await updateToken();
    if (!avatar.current) {
      setDebug("Avatar API is not initialized");
      setIsLoadingSession(false);
      return;
    }

    setAvatarLoaded(true);
    setIsLoadingSession(false);
    console.log("Avatar loaded, ready to start chat.");
  }

  async function startSession() {
    if (!avatarLoaded) {
      setDebug("Avatar not loaded yet");
      return;
    }
    setTime(0); // Reset time at the start of a new session
    setTimerStarted(true); // Start the timer
    setIsLoadingChat(true); // Show loader
    try {
      console.log("--------------------");
      console.log(avatarId);
      console.log("--------------------");
      const res = await avatar.current.createStartAvatar(
        {
          newSessionRequest: {
            quality: "low",
            avatarName: avatarId,
            voice: { voiceId: voiceId },
          },
        },
        setDebug
      );
      setData(res);
      console.log(res);
      setStream(avatar.current.mediaStream);
      console.log("Session started:", res);
    } catch (error) {
      console.error("Error starting avatar session:", error);
      setDebug(
        `There was an error starting the session. ${
          voiceId ? "This custom voice ID may not be supported." : ""
        }`
      );
    }
    setIsLoadingChat(false); // Hide loader
  }

  async function updateToken() {
    const newToken = await fetchAccessToken();
    console.log("Updating Access Token:", newToken); // Log token for debugging
    avatar.current = new StreamingAvatarApi(
      new Configuration({ accessToken: newToken })
    );

    const startTalkCallback = (e) => {
      console.log("Avatar started talking", e);
    };

    const stopTalkCallback = (e) => {
      console.log("Avatar stopped talking", e);
    };

    console.log("Adding event handlers:", avatar.current);
    avatar.current.addEventHandler("avatar_start_talking", startTalkCallback);
    avatar.current.addEventHandler("avatar_stop_talking", stopTalkCallback);

    setInitialized(true);
  }

  async function handleInterrupt() {
    if (!initialized || !avatar.current) {
      setDebug("Avatar API not initialized");
      return;
    }
    await avatar.current
      .interrupt({ interruptRequest: { sessionId: data?.sessionId } })
      .catch((e) => {
        setDebug(e.message);
      });
  }

  async function endSession() {
    if (!initialized || !avatar.current || !data?.sessionId) {
      setDebug("Avatar API not initialized or session data missing");
      return;
    }
    try {
      await avatar.current.stopAvatar({
        stopSessionRequest: { sessionId: data.sessionId },
      });
      setStream(null);
      setData(null);
      setAvatarLoaded(false);
      setTime(0); // Reset time
      setTimerStarted(false); // Stop the timer
      console.log("Session ended successfully.");
    } catch (error) {
      console.error("Error ending session:", error);
      setDebug("There was an error ending the session.");
    }
  }

  async function handleSpeak() {
    setIsLoadingRepeat(true);
    if (!initialized || !avatar.current) {
      setDebug("Avatar API not initialized");
      return;
    }
    await avatar.current
      .speak({ taskRequest: { text: text, sessionId: data?.sessionId } })
      .catch((e) => {
        setDebug(e.message);
      });
    setIsLoadingRepeat(false);
  }

  const fetchSessions = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key":
          "NWRjOTRjOTZjYTExNDk5MWIzNzllM2IxMzJjNjg1NTEtMTcyMTc5NjA0OA==",
      },
    };

    fetch("https://api.heygen.com/v1/streaming.list", options)
      .then((response) => response.json())
      .then((response) => {
        // setSessions(response);
        // alert(${response.data});
        console.log("Connected Session", response);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    async function init() {
      const newToken = await fetchAccessToken();
      console.log("Initializing with Access Token:", newToken); // Log token for debugging
      avatar.current = new StreamingAvatarApi(
        new Configuration({ accessToken: newToken, jitterBuffer: 200 })
      );
      setInitialized(true); // Set initialized to true
    }
    init();

    return () => {
      endSession();
    };
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current.play();
        setDebug("Playing");
      };
    }
  }, [mediaStream, stream]);

  function startRecording() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };
        mediaRecorder.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/wav",
          });
          audioChunks.current = [];
          transcribeAudio(audioBlob);
        };
        mediaRecorder.current.start();
        setRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  }

  function stopRecording() {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  }

  async function transcribeAudio(audioBlob) {
    try {
      // Convert Blob to File
      const audioFile = new File([audioBlob], "recording.wav", {
        type: "audio/wav",
      });
      const response = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: audioFile,
      });
      const transcription = response.text;
      console.log("Transcription: ", transcription);
      setInput(transcription);
    } catch (error) {
      console.error("Error transcribing audio:", error);
    }
  }

  useEffect(() => {
    let minsToStop = 5;
    if (time === 60000 * minsToStop) {
      setTime(0);
      setTimerStarted(false);
      endSession();
    }
  }, [time]);

  // Debug useEffect for preview image
  useEffect(() => {
    if (selectedAvatarPreviewImage) {
      console.log("Avatar preview image set:", selectedAvatarPreviewImage);
    }
  }, [selectedAvatarPreviewImage]);

  function handleAvatarSelect(avatar) {
    console.log("Selected Avatar:", avatar);

    const previewImage = avatar.avatar_states[0].normal_preview;
    console.log(avatar.ava);
    setAvatarId(avatar.avatar_id);

    if (previewImage) {
      console.log("Setting Avatar Preview Image:", previewImage);
      setSelectedAvatarPreviewImage(previewImage);
    } else {
      console.warn("No preview image found for the selected avatar.");
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <Card>
        <CardBody className="h-[600px] flex flex-col justify-center items-center">
          {stream ? (
            <div className="h-[500px] justify-center items-center flex rounded-lg overflow-hidden">
              <video
                ref={mediaStream}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              >
                <track kind="captions" />
              </video>
              <div className="flex flex-col gap-2 absolute bottom-3 right-3">
                <Timer
                  timerStarted={timerStarted}
                  time={time}
                  setTime={setTime}
                />
                <Button
                  size="md"
                  onClick={handleInterrupt}
                  className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white rounded-lg"
                  variant="shadow"
                >
                  Interrupt task
                </Button>
                <Button
                  size="md"
                  onClick={endSession}
                  className="bg-gradient-to-tr from-indigo-500 to-indigo-300  text-white rounded-lg"
                  variant="shadow"
                >
                  End session
                </Button>
                <Button
                  size="md"
                  onClick={fetchSessions}
                  className="bg-gradient-to-tr from-indigo-500 to-indigo-300  text-white rounded-lg"
                  variant="shadow"
                >
                  Number of sessions
                </Button>
              </div>
            </div>
          ) : avatarLoaded ? (
            <div className="h-[500px] justify-center items-center flex rounded-lg overflow-hidden">
              <img
                src={selectedAvatarPreviewImage} // Update this path to the actual path where avatar images are stored
                alt="Avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
              <div className=" flex flex-col gap-2 absolute bottom-24 mx-auto">
                {isLoadingChat ? ( // Render spinner if loading
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  <Button
                    size="md"
                    onClick={startSession}
                    className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white rounded-lg"
                    variant="shadow"
                  >
                    Start chat
                  </Button>
                )}
              </div>
            </div>
          ) : !isLoadingSession ? (
            <div className="h-full justify-center items-center flex flex-col gap-8   self-center">
              <div className="flex flex-col gap-2 w-full">
                <p className="text-sm font-medium leading-none">
                  Custom Avatar ID (optional)
                </p>
                <Input
                  value={avatarId}
                  onChange={(e) => setAvatarId(e.target.value)}
                  placeholder="Enter a custom avatar ID"
                />
                <Select
                  placeholder="Or select one from these example avatars"
                  size="md"
                  onChange={(e) => {
                    // const selectedAvatar = AVATARS.find(
                    //   (avatar) => avatar.avatar_id === e.target.value
                    // );
                    // if (selectedAvatar) {
                    // setAvatarId(selectedAvatar.avatar_id);
                    // handleAvatarSelect(selectedAvatar); // Use the new function to handle avatar selection
                    // }
                  }}
                >
                  {AVATARS.map((avatar) => (
                    <SelectItem
                      key={avatar.avatar_id}
                      textValue={avatar.avatar_id}
                      onClick={() => handleAvatarSelect(avatar)}
                    >
                      {avatar.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <p className="text-sm font-medium leading-none">
                  Custom Voice ID (optional)
                </p>
                <Input
                  value={voiceId}
                  onChange={(e) => setVoiceId(e.target.value)}
                  placeholder="Enter a custom voice ID"
                />
                <Select
                  placeholder="Or select one from these example voices"
                  size="md"
                  onChange={(e) => {
                    setVoiceId(e.target.value);
                  }}
                >
                  {VOICES.map((voice) => (
                    <SelectItem key={voice.voice_id} textValue={voice.voice_id}>
                      {voice.name} | {voice.language} | {voice.gender}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <Button
                size="md"
                onClick={loadAvatar}
                className="bg-gradient-to-tr from-indigo-500 to-indigo-300 w-full text-white"
                variant="shadow"
              >
                Load Avatar
              </Button>
            </div>
          ) : (
            <Spinner size="lg" color="default" />
          )}
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col gap-3">
          <InteractiveAvatarTextInput
            label="Chat"
            placeholder="Chat with the avatar (uses ChatGPT)"
            input={input}
            onSubmit={() => {
              setIsLoadingChat(true);
              if (!input) {
                setDebug("Please enter text to send to ChatGPT");
                return;
              }
              handleSubmit();
            }}
            setInput={setInput}
            loading={isLoadingChat}
            endContent={
              <Tooltip
                content={!recording ? "Start recording" : "Stop recording"}
              >
                <Button
                  onClick={!recording ? startRecording : stopRecording}
                  isDisabled={!stream}
                  isIconOnly
                  className={clsx(
                    "mr-4 text-white",
                    !recording
                      ? "bg-gradient-to-tr from-indigo-500 to-indigo-300"
                      : ""
                  )}
                  size="sm"
                  variant="shadow"
                >
                  {!recording ? (
                    <Microphone size={20} />
                  ) : (
                    <>
                      <div className="absolute h-full w-full bg-gradient-to-tr from-indigo-500 to-indigo-300 animate-pulse -z-10"></div>
                      <MicrophoneStage size={20} />
                    </>
                  )}
                </Button>
              </Tooltip>
            }
            disabled={!stream}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
