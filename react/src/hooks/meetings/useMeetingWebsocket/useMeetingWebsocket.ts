import { useEffect, useRef, useState } from "react";
import Peer, { Instance as PeerInstance } from "simple-peer";

type Participant = {
  // uid
  channel: string;

  // profile details
  id: string | null;
  email: string | null;
  username: string | null;

  // meeting details
  audioMuted: boolean;
  videoMuted: boolean;
};

type ParticipantStream = {
  // uid
  channel: string;
  peer: PeerInstance;
  stream: MediaStream | null;
};

type ConnectionStates = {
  isConnected: boolean;
  isPending: boolean;
  isError: boolean;
};

type WebsocketUser = {
  channel: string;
  id: string | null;
  email: string | null;
  username: string | null;
  audio_muted: boolean;
  video_muted: boolean;
};

const getUrl = (id: string) => {
  let url = window.location.protocol === "https:" ? "wss://" : "ws://";
  url +=
    import.meta.env.MODE === "development"
      ? window.location.hostname + ":8000"
      : window.location.host;
  url += "/ws/meetings/";
  url += id;
  url += "/";

  return url;
};

const getRelayServers = () => {
  let iceServers = [];
  if (import.meta.env.MODE === "production") {
    // todo: add public domain name
    iceServers.push({ urls: "stun:stun.localhost:3478" });
  }
  iceServers.push({ urls: "stun:stun.l.google.com:19302" });
  return iceServers;
};

const loadParticipant: (data: WebsocketUser) => Participant = (data) => {
  return {
    channel: data.channel,
    id: data.id,
    email: data.email,
    username: data.username,
    audioMuted: data.audio_muted,
    videoMuted: data.video_muted,
  };
};

const useMeetingWebsocket = (id: string) => {
  const [connectionStates, setConnectionStates] = useState<ConnectionStates>({
    isConnected: false,
    isPending: false,
    isError: false,
  });
  const [participants, setParticipants] = useState<Participant[]>([]);
  // force re-render
  const [, setLocalParticipant] = useState<string>("");
  const [groupNotesState, setGroupNotesState] = useState<string>("");
  const [error, setError] = useState<string>("");

  // why ref instead of state?
  // - preserved on re-render (both)
  // - changing value doesn't cause re-render (for that we are using setConnectionStates())
  // - set once and not changed (like DOM elements)
  const websocket = useRef<WebSocket | null>(null);

  // why ref instead of state?
  // - preserved on re-render (both)
  // - doesn't trigger re-render (for that we are using setParticipants(), setLocalParticipant())
  // - able to access freshest value for logic in useEffect without adding to dependency array
  //   - when we access the value in our event listeners we need the current value not old values
  const participantStreams = useRef<ParticipantStream[]>([]);
  const localParticipantStream = useRef<MediaStream | null>(null);
  const localParticipant = useRef<Participant | null>(null);

  // why ref instead of state?
  // - we need freshest value when accessed in async calls in useEffect
  // - triggering re-render with setGroupNotesState()
  const groupNotes = useRef<string>("{}");

  const appendParticipantStreams = (
    channel: string,
    initiator: boolean = false,
  ) => {
    const peer = new Peer({
      initiator: initiator || undefined,
      trickle: false,
      stream: localParticipantStream.current || undefined,
      config: { iceServers: getRelayServers() },
    });

    peer.on("signal", (data) => {
      websocket.current!.send(
        JSON.stringify({
          type: "webrtc_signal",
          to: channel,
          signal: JSON.stringify(data),
          message_type: initiator ? "offer" : "answer",
        }),
      );
    });

    peer.on("stream", (stream) => {
      for (const s of participantStreams.current) {
        if (s.channel === channel) {
          s.stream = stream;
          // force re-render
          setParticipants((prev) => [...prev]);
        }
      }
    });

    participantStreams.current.push({
      channel,
      peer,
      stream: null,
    });
  };

  // handle websocket connection
  useEffect(() => {
    setConnectionStates({
      isConnected: false,
      isPending: true,
      isError: false,
    });

    websocket.current = new WebSocket(getUrl(id));

    websocket.current.onopen = () => {
      setConnectionStates({
        isConnected: true,
        isPending: false,
        isError: false,
      });

      if (error) {
        setError("");
      }
    };

    websocket.current.onclose = () => {
      // leave error state
      setConnectionStates((prev) => ({
        ...prev,
        isConnected: false,
        isPending: false,
      }));
    };

    websocket.current.onerror = () => {
      setConnectionStates({
        isConnected: false,
        isPending: false,
        isError: true,
      });

      setError("Something went wrong with the connection");
    };

    websocket.current.onmessage = (e) => {
      const message = JSON.parse(e.data);

      if (message.type === "all_users") {
        // Initialize participants and their streams and send webrtc offers to all peers
        for (const user of message.users) {
          if (!localParticipant.current) {
            setConnectionStates((prev) => ({ ...prev, isError: true }));
            setError("Didn't receive message from server, try refreshing page");
            break;
          }

          if (user.channel === localParticipant.current.channel) {
            continue;
          }

          appendParticipantStreams(user.channel, true);
        }

        setParticipants(
          message.users
            .filter((user: WebsocketUser) => {
              if (!localParticipant.current) return true;
              return user.channel !== localParticipant.current.channel;
            })
            .map((user: WebsocketUser) => loadParticipant(user)),
        );
      } else if (message.type === "user_joined") {
        // Initialize peer and its stream to receive offer and append to array
        appendParticipantStreams(message.user.channel);
        setParticipants((prev) => [...prev, loadParticipant(message.user)]);
      } else if (message.type === "user_left") {
        // Remove peer from array
        participantStreams.current = participantStreams.current.filter(
          (p) => p.channel != message.user.channel,
        );

        setParticipants((prev) =>
          prev.filter((p) => p.channel != message.user.channel),
        );
      } else if (message.type === "user_update") {
        if (localParticipant.current) {
          let localP = loadParticipant(message.user);

          if (message.user.channel === localParticipant.current.channel) {
            localParticipant.current = localP;
            setLocalParticipant(JSON.stringify(localP));
          } else {
            setParticipants((prev) =>
              prev.map((p) =>
                p.channel === message.user.channel ? localP : p,
              ),
            );
          }
        }
      } else if (message.type === "webrtc_signal") {
        let p = participantStreams.current.find(
          (p) => p.channel === message.from.channel,
        );

        if (p && p.peer) {
          p.peer.signal(JSON.parse(message.signal));
        }
      } else if (message.type === "group_notes") {
        // make this better?
        groupNotes.current = message.content;
        // force re-render (caught by useEffect)
        setGroupNotesState(message.content);
      } else if (message.type === "error") {
        setConnectionStates((prev) => ({ ...prev, isError: true }));
        setError(message.message);
      } else if (message.type === "your_connection") {
        let p = loadParticipant(message.user);
        localParticipant.current = p;
        setLocalParticipant(JSON.stringify(p));
      }
    };

    // saving instance reference to variable incase ref value changes leaving hanging connection
    const ws = websocket.current;

    return () => {
      for (const participantStream of participantStreams.current) {
        participantStream.peer.removeAllListeners();
      }
      ws.close();
    };
  }, []);

  return {
    websocket,
    participants,
    participantStreams,
    localParticipant,
    localParticipantStream,
    groupNotes,
    groupNotesState,
    error,
    isConnected: connectionStates.isConnected,
    isPending: connectionStates.isPending,
    isError: connectionStates.isError,
  };
};

export default useMeetingWebsocket;
