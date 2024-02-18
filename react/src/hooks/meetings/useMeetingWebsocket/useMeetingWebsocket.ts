import { useEffect, useRef, useState } from "react";
import Peer, { Instance as PeerInstance } from "simple-peer";

type Participant = {
  // uid
  channel: string;

  // profile details
  id: string | null;
  email: string | null;
  username: string | null;
};

type ParticipantStream = {
  // uid
  channel: string;
  peer: PeerInstance;
};

type ConnectionStates = {
  isConnected: boolean;
  isPending: boolean;
  isError: boolean;
};

const getUrl = (id: string) => {
  let url = window.location.protocol === "https://" ? "wss://" : "ws://";
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
  iceServers.push(
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
  );
  return iceServers;
};

const useMeetingWebsocket = (id: string) => {
  const [connectionStates, setConnectionStates] = useState<ConnectionStates>({
    isConnected: false,
    isPending: false,
    isError: false,
  });
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [gotLocalStream, setGotLocalStream] = useState<boolean>(false);
  // force re-render
  const [toggleLocalParticipant, setToggleLocalParticipant] =
    useState<boolean>(true);
  const [groupNotes, setGroupNotes] = useState<string>("");
  const [error, setError] = useState<string>("");

  // why ref instead of state?
  // - preserved on re-render (both)
  // - changing value doesn't cause re-render (for that we are using isPending, etc.)
  // - set once and not changed (like DOM elements)
  const websocket = useRef<WebSocket | null>(null);

  // why ref instead of state?
  // - preserved on re-render (both)
  // - doesn't trigger re-render (we use participants/gotLocalStream for that)
  // - able to access freshest value for logic in useEffect without adding to dependency array
  //   - when we access the value in our event listeners we need the current value not old values
  const participantStreams = useRef<ParticipantStream[]>([]);
  const localStream = useRef<MediaStream | null>(null);
  const localParticipant = useRef<Participant | null>(null);

  // todo: STUN/TURN SERVER

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

          const peer: PeerInstance = new Peer({
            initiator: true,
            trickle: false,
            stream: localStream.current || undefined,
            config: { iceServers: getRelayServers() },
          });

          participantStreams.current.push({
            channel: user.channel,
            peer,
          });

          peer.on("signal", (data) => {
            websocket.current!.send(
              JSON.stringify({
                type: "webrtc_signal",
                to: user.channel,
                signal: JSON.stringify(data),
                message_type: "offer",
              }),
            );
          });
        }

        setParticipants(
          message.users.filter((user: Participant) => {
            if (!localParticipant.current) return true;
            return user.channel !== localParticipant.current.channel;
          }),
        );
      } else if (message.type === "user_joined") {
        // Initialize peer and its stream to receive offer and append to array
        const peer: PeerInstance = new Peer({
          trickle: false,
          stream: localStream.current || undefined,
          config: { iceServers: getRelayServers() },
        });

        participantStreams.current.push({
          channel: message.user.channel,
          peer,
        });

        peer.on("signal", (data) => {
          websocket.current!.send(
            JSON.stringify({
              type: "webrtc_signal",
              to: message.user.channel,
              signal: JSON.stringify(data),
              message_type: "answer",
            }),
          );
        });

        setParticipants((prev) => [...prev, { ...message.user }]);
      } else if (message.type === "user_left") {
        // Remove peer from array
        participantStreams.current = participantStreams.current.filter(
          (p) => p.channel != message.user.channel,
        );

        setParticipants((prev) =>
          prev.filter((p) => p.channel != message.user.channel),
        );
      } else if (message.type === "new_username") {
        if (localParticipant.current) {
          if (message.user.channel === localParticipant.current.channel) {
            localParticipant.current = message.user;
            // force re-render
            setToggleLocalParticipant((prev) => !prev);
          } else {
            setParticipants((prev) =>
              prev.map((p) =>
                p.channel === message.user.channel ? message.user : p,
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
        setGroupNotes(message.content);
      } else if (message.type === "error") {
        setConnectionStates((prev) => ({ ...prev, isError: true }));
        setError(message.message);
      } else if (message.type === "your_connection") {
        localParticipant.current = message.user;
        // force re-render
        setToggleLocalParticipant((prev) => !prev);
      }
    };

    // saving instance reference to variable incase ref value changes leaving hanging connection
    const ws = websocket.current;

    return () => {
      console.log("cleanup");
      for (const participantStream of participantStreams.current) {
        participantStream.peer.removeAllListeners("signal");
        participantStream.peer.removeAllListeners("stream");
      }
      ws.close();
    };
  }, []);

  return {
    setGotLocalStream,
    setGroupNotes,
    websocket,
    isConnected: connectionStates.isConnected,
    isPending: connectionStates.isPending,
    isError: connectionStates.isError,
    participants,
    participantStreams,
    localParticipant,
    gotLocalStream,
    localStream,
    groupNotes,
    error,
  };
};

export default useMeetingWebsocket;
