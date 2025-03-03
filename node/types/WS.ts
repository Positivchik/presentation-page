type TUserId = string;
export type TPosition = [number, number];

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

export type TUpdatePayload = {
  userId: TUserId;
  position: TPosition;
};

export type TUpdateResponse = {
  type: WSEvents.UPDATE;
  payload: TUpdatePayload;
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
  };
};

export type TUpdateRequest = {
  type: WSEvents.UPDATE;
  payload: [number, number];
};

export type TCreateRequest = {
  type: WSEvents.CREATE;
  payload: {
    name: string;
    position: [number, number];
  };
};
