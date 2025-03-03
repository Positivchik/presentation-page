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
    },
  },
});

export const store = configureStore({
  reducer: {
    channels: ChannelsSlice.reducer,
  },
});

export const getChannelsSelector = () => store.getState().channels.channels;
export const findChannelUsersSelector = (userId: string) =>
  Object.values(getChannelsSelector() || {}).find((users) =>
    users?.some(({ userId: id }) => id === userId)
  ) || [];
export const getOtherChannelUsers = (userId: string) =>
  findChannelUsersSelector(userId)?.filter(({ userId: id }) => id !== userId);
export const getCurrentUser = (userId: string) =>
  findChannelUsersSelector(userId)?.filter(({ userId: id }) => id === userId);
export const getUsers = (userId: string) => {
  const users = findChannelUsersSelector(userId);
  const otherUsers: TPayload[] = [];
  let currentUser = null as unknown as TPayload;

  users.forEach((user) => {
    if (user.userId === userId) {
      currentUser = user;
    } else {
      otherUsers.push(user);
    }
  });

  return { otherUsers, currentUser };
};
