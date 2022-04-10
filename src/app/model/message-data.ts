export interface MessageData{
  id: number;
  msgType: string;
  text: string;
};

export interface EventData {
  id: number;
  name: string;
  info: string;
  messages: MessageData[];
};

export interface SaveData {
  events: EventData[];
  config: string;
};

export function generateMessage(id:number):MessageData{ 
  return {
    id:id,
    msgType: "",
    text: "",
  };
};
export function generateEvent(id:number,name:string):EventData{
  return {
    id:id,
    name: name,
    info: "",
    messages: [],
  };
};
