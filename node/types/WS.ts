type TUserId = string;

export enum WSEvents {
  CLOSE = 'close',
  UPDATE = 'update',
  CONNECT = 'connect',
  CREATE = 'create',
}

export type TCloseResponse = {
  type: WSEvents.CLOSE;
  payload: TUserId;
};

export type TUpdateResponse = {
  type: WSEvents.UPDATE;
  payload: {
    userId: TUserId;
    name: string;
    position: [number, number];
  };
};

export type TConnectResponse = {
  type: WSEvents.CONNECT;
  payload: TUserId;
};

export type TCreateResponse = {
  type: WSEvents.CREATE;
  payload: TUserId;
};

export type TConnectRequest = {
  type: WSEvents.CONNECT;
  payload: {
    channelId: string;
    name: string;
  };
};

export type TUpdateRequest = {
  type: WSEvents.UPDATE;
  payload: [number, number];
};

export type TCreateRequest = {
  type: WSEvents.CREATE;
  payload: {
    position: [number, number];
    name: string;
  };
};
