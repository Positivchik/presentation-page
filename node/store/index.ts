import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

type TChannelId = string;

interface TPayload {
  name: string;
  userId: string;
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
    disconnectChannel: (state, action: PayloadAction<{ userId: string }>) => {
      const { userId } = action.payload;
      const isOwner = !!state.channels[userId];

      if (isOwner) {
        delete state.channels[userId];
      } else {
        const [channelId, users] =
          Object.entries(state.channels).find(([, users]) =>
            users.find(({ userId }) => userId === userId)
          ) || [];

        const filteredChannel =
          users?.filter(({ userId: id }) => id !== userId) || [];
        if (channelId) {
          state.channels[channelId] = filteredChannel;
        }
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
      const { channelId, userId, name } = action.payload;
      state.channels[channelId]?.push({ userId, name });
      console.log('connectToChannel', {
        channelId,
        userId,
        name,
        channels: state.channels,
      });
    },
  },
});

export const store = configureStore({
  reducer: {
    channels: ChannelsSlice.reducer,
  },
});
