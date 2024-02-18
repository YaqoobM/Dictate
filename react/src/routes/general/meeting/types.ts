import { Instance as PeerInstance } from "simple-peer";

export interface Participant {
  // uid
  channel: string;

  // profile details
  id: string | null;
  email: string | null;
  username: string | null;
}

export interface ParticipantStream {
  // uid
  channel: string;
  peer: PeerInstance;
}
