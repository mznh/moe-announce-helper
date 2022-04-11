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

export function getNewMessageId(eventData:EventData){
  if(eventData.messages.length === 0){
    return 0;
  }
  const maxId = eventData.messages.map((msg:MessageData)=>{return msg.id}).reduce((a:number,b:number)=>{return Math.max(a,b)})
  return maxId + 1;
}

export function getNewEventId(saveData:SaveData){
  if(saveData.events.length === 0){
    return 0;
  }
  const maxId = saveData.events.map((evt:EventData)=>{return evt.id}).reduce((a:number,b:number)=>{return Math.max(a,b)});
  return maxId + 1;
}
