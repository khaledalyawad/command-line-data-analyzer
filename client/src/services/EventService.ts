import http from "../http-common";
import IEventData from "../types/Event";

const get = (id: any) => {
  return http.get<IEventData>(`/data/?filename=${id}`);
};

const EventService = {
  get,
};

export default EventService;
