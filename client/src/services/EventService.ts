import http from "../http-common";
import IEventData from "../types/Event";

const getAll = () => {
  return http.get<Array<IEventData>>(`/data`);
};

const get = (id: any) => {
  return http.get<IEventData>(`/data/?filename=${id}`);
};

const create = (data: IEventData) => {
  return http.post<IEventData>("/data", data);
};

const update = (id: any, data: IEventData) => {
  return http.put<any>(`/data/${id}`, data);
};

const remove = (id: any) => {
  return http.delete<any>(`/data/${id}`);
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
