import { Handler } from "aws-lambda";
import webSocketClient from "./webSocketClient";
import { success } from "./utils/response";
import broadcast from "./utils/broadcast";
import { WebsocketAPIGatewayEvent } from "./types/gateway";
import { putMessage } from "./utils/dynamodb";

export const handler: Handler = async (
  event: WebsocketAPIGatewayEvent,
  _,
  callback,
) => {
  const ws = new webSocketClient(event.requestContext);
  await broadcast(event.body, ws);
  await putMessage(event.body);

  return callback(null, success);
};
