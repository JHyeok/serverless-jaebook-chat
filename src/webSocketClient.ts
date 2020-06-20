import { ApiGatewayManagementApi } from "aws-sdk";

export default class {
  private ws: ApiGatewayManagementApi;
  private connectionId: string;

  constructor(requestContext: any) {
    this.ws = new ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: `https://${requestContext.domainName}/${requestContext.stage}`,
    });
    this.connectionId = requestContext.connectionId;
  }

  send(msg: string | any, id?: string) {
    const parsed = typeof msg === "string" ? msg : JSON.stringify(msg);

    console.log(`Sending ${parsed} to ${id || this.connectionId}`);

    try {
      return this.ws
        .postToConnection({
          ConnectionId: id || this.connectionId,
          Data: parsed,
        })
        .promise();
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  }
}
