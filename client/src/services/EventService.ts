import http from "../http-common";
import IEventData from "../types/Event";

const getAll = () => {
  return http.get<Array<IEventData>>("/events");
};

const get = (id: any) => {
  return http.get<IEventData>(`/events/${id}`);
};

const create = (data: IEventData) => {
  return http.post<IEventData>("/events", data);
};

const update = (id: any, data: IEventData) => {
  return http.put<any>(`/events/${id}`, data);
};

const remove = (id: any) => {
  return http.delete<any>(`/events/${id}`);
};

const removeAll = () => {
  return http.delete<any>(`/events`);
};

const findByTitle = (title: string) => {
  return http.get<Array<IEventData>>(`/events?title=${title}`);
};

const EventService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
};

export default EventService;
