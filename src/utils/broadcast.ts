import websocketClient from "../webSocketClient";
import { getAllConnections } from "./dynamodb";

export default async (msg: any, ws: websocketClient) => {
  const { Items } = await getAllConnections();

  return Items.map(connection => ws.send(msg, connection.connectionId));
};
