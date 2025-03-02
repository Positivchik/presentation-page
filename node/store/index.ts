import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WebSocket } from 'ws';

type TChannelId = string;

interface TPayload {
  name: string;
  userId: string;
  ws: WebSocket;
}

interface TInitalState {
  channels: {
    [key in TChannelId]: TPayload[];
  };
}

const initialState: TInitalState = {
  channels: {},
};

export const ChannelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    createChannel: (state, action: PayloadAction<TPayload>) => {
      const { userId } = action.payload;
      state.channels[userId] = [action.payload];
    },
    // updateName: (
    //   state,
    //   action: PayloadAction<{ userId: TChannelId; name: string }>
    // ) => {
    //   const { userId, name } = action.payload;
    //   const [channelId, users] = Object.entries(state.channels).find(
    //     ([, users]) => users.some(({ userId: id }) => id === userId)
    //   )!;
    //   state.channels[channelId] = users.map((userData) => {
    //     const { userId: id } = userData;
    //     return id === userId ? { ...userData, name } : userData;
    //   });
    // },
    disconnectChannel: (state, action: PayloadAction<{ userId: string }>) => {
      const { userId } = action.payload;
      const isOwner = !!state.channels[userId];

      if (isOwner) {
        delete state.channels[userId];
      } else {
        const [channelId, users] = Object.entries(state.channels).find(
          ([, users]) => users.find(({ userId }) => userId === userId)
        )!;

        const filteredChannel = users?.filter(
          ({ userId: id }) => id !== userId
        );

        state.channels[channelId] = filteredChannel;
      }
    },
    connectToChannel: (
      state,
      action: PayloadAction<
        TPayload & {
          channelId: TChannelId;
        }
      >
    ) => {
      const { channelId, userId, name, ws } = action.payload;
      state.channels[channelId].push({ userId, name, ws });
    },
  },
});

export const store = configureStore({
  reducer: {
    channels: ChannelsSlice.reducer,
  },
});
