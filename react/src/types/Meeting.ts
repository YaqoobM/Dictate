export interface Meeting {
  id: string;
  url: string;
  socket: string;
  start_time: string;
  end_time: string | null;
  team: string | null;
  participants: string[] | null;
  recordings: string[];
  notes: string | null;
}
