

export enum StateKey {
    WA = "western-australia",
    NT = "northern-territory",
    QLD = "queensland",
    SA = "south-australia",
    NSW = "new-south-wales",
    VIC = "victoria",
    TAS = "tasmania",
  }
  
  
  export const StateMap: Record<StateKey, string> = {
      [StateKey.WA]: "WA",
      [StateKey.NT]: "NT",
      [StateKey.QLD]: "QLD",
      [StateKey.SA]: "SA",
      [StateKey.NSW]: "NSW",
      [StateKey.VIC]: "VIC",
      [StateKey.TAS]: "TAS",
    };
  