import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

type TChannelId = string;

interface TPayload {
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
    disconnectUser: (state, action: PayloadAction<{ userId: string }>) => {
      const { userId } = action.payload;
      const isOwner = !!state.channels[userId];

      if (isOwner) {
        delete state.channels[userId];
      } else {
        const [channelId, users] =
          Object.entries(state.channels).find(([, users]) =>
            users.find(({ userId: id }) => id === userId)
          ) || [];

        if (channelId && users) {
          const filteredChannel = users?.filter(
            ({ userId: id }) => id !== userId
          );
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
      const { channelId, userId } = action.payload;
      state.channels[channelId]?.push({ userId });
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

export const getUsersSelector = (userId: string) => {
  const allUsers = findChannelUsersSelector(userId);
  const otherUsers: TPayload[] = [];
  let currentUser = null as unknown as TPayload;

  allUsers.forEach((user) => {
    if (user.userId === userId) {
      currentUser = user;
    } else {
      otherUsers.push(user);
    }
  });

  return { otherUsers, currentUser, allUsers };
};
