import PusherServer from 'pusher';
import PusherClient from 'pusher-js';
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID || "app-id",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || "key",
  secret: process.env.PUSHER_SECRET || "secret",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
  useTLS: true,
});
export const getPusherClient = () => {
  return new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || "key", {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
  });
};
