export function findEventsByCourtId({ state, commit }, courtId) {
  // make the call
  commit("setResults", [
    {
      id: 1,
      happens_at: 1598080260997,
      court_id: 12314,
      created_by: 1122,
      guests: 1,
      username: "hossein"
    },
    {
      id: 2,
      happens_at: 1598180360997,
      court_id: 12314,
      created_by: 1122,
      guests: 2,
      username: "hossein"
    },
    {
      id: 3,
      happens_at: 1598290260997,
      court_id: 12314,
      created_by: 1133,
      guests: 1,
      username: "parnia"
    },
    {
      id: 4,
      happens_at: 1599600260997,
      court_id: 12314,
      created_by: 1122,
      guests: 0,
      username: "hossein"
    }
  ]);
  //   based on event_ids
  commit("setParticipants", [
    { event_id: 1, username: "mehran", be_there_at: 1598080287997, guests: 2 },
    { event_id: 1, username: "parnia", be_there_at: 1598080277997, guests: 1 },
    {
      event_id: 1,
      username: "masoome",
      be_there_at: 1598090277997,
      guests: null
    },
    { event_id: 2, username: "mehran", be_there_at: 1598080287997, guests: 1 }
  ]);
}
