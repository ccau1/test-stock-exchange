type ListenerFn = (data: any) => void;

const listeners: { [eventType: string]: Array<ListenerFn> } = {};

export const Msg = {
  on: (type: string, fn: ListenerFn) => {
    if (!listeners[type]) listeners[type] = [];
    listeners[type].push(fn);
  },
  remove: (type: string, fn: ListenerFn) => {
    listeners[type] = listeners[type]?.filter((a) => a !== fn);
  },
  emit: (type: string, data: any) => {
    listeners[type]?.forEach((fn) => fn(data));
  },
};
