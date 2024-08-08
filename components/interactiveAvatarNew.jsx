import {
  Configuration,
  NewSessionData,
  StreamingAvatarApi,
} from "@heygen/streaming-avatar";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Spinner,
  Tooltip,
  CardHeader,
} from "@nextui-org/react";
import publicAvatarsJson from "../public/public-streaming-avatars.json";
import InteractiveAvatarChatMessages from "./InteractiveAvatarChatMessages";
import { Microphone, MicrophoneStage } from "@phosphor-icons/react";
import { useChat } from "ai/react";
import clsx from "clsx";
import OpenAI from "openai";
import { useEffect, useRef, useState } from "react";
import InteractiveAvatarTextInput from "./InteractiveAvatarTextInput";
import Timer from "./Timer";
import { useCallback } from "react";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function InteractiveAvatar() {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [stream, setStream] = useState();
  const [debug, setDebug] = useState();
  const [avatarId, setAvatarId] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [data, setData] = useState();
  const [header, setHeader] = useState(false);

  const [text, setText] = useState("");
  const [initialized, setInitialized] = useState(false); // Track initialization
  const [recording, setRecording] = useState(false); // Track recording state
  const mediaStream = useRef(null);
  const avatar = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const [time, setTime] = useState(0);
  const [timerStarted, setTimerStarted] = useState(true);

  const [chatId, setChatId] = useState(undefined);
  const [avatarStartedSpeaking, setAvatarStartedSpeaking] = useState(false);

  const {
    input,
    setInput,
    handleSubmit,
    messages,
    stop: stopOpenAISession,
  } = useChat({
    id: chatId?.toString(),
    onFinish: async (message) => {
      if (!initialized || !avatar.current) {
        setDebug("Avatar API not initialized");
        return;
      }

      setAvatarStartedSpeaking(false);

      await avatar.current
        .speak({
          taskRequest: { text: message.content, sessionId: data?.sessionId },
        })
        .then(() => {
          setAvatarStartedSpeaking(true); // Set state to true when avatar starts speaking
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

  const currentAvatarName = "josh_lite3_20230714";
  const avatarImage = publicAvatarsJson.data.avatar.find(
    (av) => av.pose_id === currentAvatarName
  ).normal_preview;

  const fetchAccessToken = useCallback(async () => {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();
      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      return "";
    }
  }, []);

  const startSession = useCallback(async () => {
    setIsLoadingSession(true);
    await updateToken();
    if (!avatar.current) {
      setDebug("Avatar API is not initialized");
      return;
    }
    try {
      const res = await avatar.current.createStartAvatar(
        {
          newSessionRequest: {
            quality: "low",
            avatarName: currentAvatarName,
            voice: { voiceId: "077ab11b14f04ce0b49b5f6e5cc20979" },
          },
        },
        setDebug
      );
      setHeader(true);
      setData(res);
      setStream(avatar.current.mediaStream);
    } catch (error) {
      console.error("Error starting avatar session:", error);
      setDebug(
        `There was an error starting the session. ${
          voiceId ? "This custom voice ID may not be supported." : ""
        }`
      );
    }
    setIsLoadingSession(false);
  }, [voiceId]);

  const updateToken = useCallback(async () => {
    const newToken = await fetchAccessToken();
    avatar.current = new StreamingAvatarApi(
      new Configuration({ accessToken: newToken })
    );

    const startTalkCallback = (e) => {
      console.log("Avatar started talking", e);
    };

    const stopTalkCallback = (e) => {
      console.log("Avatar stopped talking", e);
    };

    avatar.current.addEventHandler("avatar_start_talking", startTalkCallback);
    avatar.current.addEventHandler("avatar_stop_talking", stopTalkCallback);

    setInitialized(true);
  }, [fetchAccessToken]);

  const handleInterrupt = useCallback(async () => {
    if (!initialized || !avatar.current) {
      setDebug("Avatar API not initialized");
      return;
    }
    await avatar.current
      .interrupt({ interruptRequest: { sessionId: data?.sessionId } })
      .catch((e) => {
        setDebug(e.message);
      });
  }, [initialized, data]);

  const endSession = useCallback(async () => {
    if (!initialized || !avatar.current) {
      setDebug("Avatar API not initialized");
      return;
    }
    await avatar.current.stopAvatar(
      { stopSessionRequest: { sessionId: data?.sessionId } },
      (response) => {
        setDebug(response);
        setChatId((chatId) => (chatId ?? 0) + 1);
        stopOpenAISession();
      }
    );
    setChatId((chatId) => (chatId ?? 0) + 1);
    setStream(undefined);
    setHeader(false);
    setData(undefined);
  }, [initialized, data, stopOpenAISession]);

  const handleSpeak = useCallback(async () => {
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
  }, [initialized, text, data]);

  const startRecording = useCallback(() => {
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
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
  }, []);

  const transcribeAudio = useCallback(
    async (audioBlob) => {
      try {
        const audioFile = new File([audioBlob], "recording.wav", {
          type: "audio/wav",
        });
        const response = await openai.audio.transcriptions.create({
          model: "whisper-1",
          file: audioFile,
        });
        const transcription = response.text;
        setInput(transcription);
      } catch (error) {
        console.error("Error transcribing audio:", error);
      }
    },
    [setInput]
  );

  const fetchSessions = useCallback(async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key":
          "OWQwNGQ5M2M2YmRkNDcxMWI5ZTE5ZjFlYWM1Y2ExMWUtMTcyMjgzMTM1Nw==",
      },
    };

    try {
      const response = await fetch(
        "https://api.heygen.com/v1/streaming.list",
        options
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Session of the player", data.sessions);
      alert(`Connected Session: ${data?.sessions?.length}`);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  }, []);

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
  }, [stream]);

  useEffect(() => {
    let minsToStop = 5;
    if (time === 60000 * minsToStop) {
      setTime(0);
      setTimerStarted(false);
      endSession();
    }
  }, [time, endSession]);

  return (
    <div className="w-full flex flex-col gap-4">
      <Card>
        {header > 0 && (
          <CardHeader className="flex justify-between items-center">
            <>
              <Button
                size="md"
                onClick={endSession}
                className="bg-gradient-to-tr from-indigo-500 to-indigo-300  text-white rounded-lg"
                variant="shadow"
              >
                End session
              </Button>
              <Timer
                timerStarted={timerStarted}
                time={time}
                setTime={setTime}
              />
              {/* <Button
                size="md"
                onClick={fetchSessions}
                className="bg-gradient-to-tr from-indigo-500 to-indigo-300  text-white rounded-lg"
                variant="shadow"
              >
                Number of sessions
              </Button> */}
            </>
          </CardHeader>
        )}

        <CardBody className="h-[600px] flex flex-col justify-center items-center">
          {stream ? (
            <div className="h-[600px] w-auto justify-center items-center flex rounded-lg overflow-hidden p-4">
              <video
                ref={mediaStream}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
              >
                <track kind="captions" />
              </video>
              {avatarStartedSpeaking ? (
                <InteractiveAvatarChatMessages messages={messages} />
              ) : null}
            </div>
          ) : !isLoadingSession ? (
            <div
              className="w-auto justify-center flex rounded-lg overflow-hidden p-4"
              style={{
                background: "transparent",
                width: "100%",
                height: "100%",
                backgroundImage: `url(${avatarImage})`,
                backgroundSize: "cover",
                margin: "2px auto",
              }}
            >
              <div
                className=" justify-center items-center flex flex-col gap-8 w-[500px] self-center"
                style={{
                  width: "40%",
                  background: "#9D979A",
                  opacity: 0.8,
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                  minWidth: "450px",
                  marginTop: "300px",
                }}
              >
                Chat with HeyGen Interactive Avatar now!
                <Button
                  size="md"
                  onClick={startSession}
                  className="bg-gradient-to-tr from-indigo-500 to-indigo-300 w-full text-white"
                  variant="shadow"
                  style={{
                    borderRadius: "8px",
                    width: "fit-content",
                    padding: "10px 30px",
                    background: "rgb(117, 89, 255)",
                  }}
                >
                  Start new chat
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="w-auto justify-center flex rounded-lg overflow-hidden p-4"
              style={{
                background: "transparent",
                width: "100%",
                height: "100%",
                backgroundImage: `url(${avatarImage})`,
                backgroundSize: "cover",
                margin: "2px auto",
              }}
            >
              <Spinner size="lg" color="default" />
            </div>
          )}
        </CardBody>
        <Divider />
        {stream && (
          <CardFooter
            className="flex flex-col gap-3"
            style={{
              width: "40%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "-100px",
              borderRadius: "20px",
            }}
          >
            <InteractiveAvatarTextInput
              className="m-4"
              placeholder=""
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
                      "mr-4 text-black",
                      "rounded-md",
                      !recording
                        ? "bg-gradient-to-tr from-indigo-500 to-indigo-500"
                        : "bg-gradient-to-tr from-indigo-500 to-indigo-500"
                    )}
                    size="sm"
                    variant="shadow"
                  >
                    {!recording ? (
                      <Microphone size={20} />
                    ) : (
                      <>
                        <div className="absolute h-full w-full bg-gradient-to-tr from-indigo-500 to-indigo-500 animate-pulse -z-10"></div>
                        <MicrophoneStage size={20} />
                      </>
                    )}
                  </Button>
                </Tooltip>
              }
              disabled={!stream}
            />
          </CardFooter>
        )}
        {/* <Button
          size="md"
          onClick={endSession}
          className="bg-gradient-to-tr from-indigo-500 to-indigo-300  text-white rounded-lg"
          variant="shadow"
        >
          End session
        </Button> */}
      </Card>
    </div>
  );
}
