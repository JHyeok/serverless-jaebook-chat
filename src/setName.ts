import { Handler } from "aws-lambda";
import { WebsocketAPIGatewayEvent } from "./types/gateway";
import { success } from "./utils/response";
import { rename, getLastNMessagesByTime } from "./utils/dynamodb";
import websocketClient from "./webSocketClient";

export const handler: Handler = async (
  event: WebsocketAPIGatewayEvent,
  _,
  cb
) => {
  const { connectionId, connectedAt } = event.requestContext;
  const body = JSON.parse(event.body);

  await rename(connectionId, connectedAt, body.nickName);
  await new websocketClient(event.requestContext).send({
    action: "messages",
    messages: (await getLastNMessagesByTime(connectedAt, 20)).Items
  });

  return cb(null, success);
};
