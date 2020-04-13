import { Handler } from "aws-lambda";
import { WebsocketAPIGatewayEvent } from "./types/gateway";
import {
  saveConnection,
  deleteConnection,
  getAllConnections
} from "./utils/dynamodb";
import { success } from "./utils/response";
import broadcast from "./utils/broadcast";
import websocketClient from "./webSocketClient";

const updateConnectionsStatus = async (ws: websocketClient) => {
  const connections = await getAllConnections();
  await broadcast(connections, ws);
};

export const connect: Handler = async (event: WebsocketAPIGatewayEvent) => {
  const { connectionId, connectedAt } = event.requestContext;

  await saveConnection(connectionId, connectedAt);

  return success;
};

export const disconnect: Handler = async (
  event: WebsocketAPIGatewayEvent
) => {
  const { connectionId, connectedAt } = event.requestContext;
  const ws = new websocketClient(event.requestContext);

  await deleteConnection(connectionId, connectedAt);
  await updateConnectionsStatus(ws);

  return success;
};
