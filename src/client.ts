import { Client } from "tmi.js";
import { IAccountCredentialsConfiguration, IConfiguration, parse } from "./configuration";

export class ClientInstance {
    client: Client;

    constructor(
        readonly configuration: IAccountCredentialsConfiguration, readonly channels: Array<string>
    ) {
        this.client = new Client({
            connection: {
                //reconnect: true,
                secure: true,
            },
            identity: {
                username: configuration.username,
                password: configuration.oAuthToken,
            },
            channels: channels,
        });
    }

    async initialize(connectedCallback: () => void): Promise<void> {
        this.client.connect()
            .catch(console.error);

        this.client.on('connected', (address, port) => 
            connectedCallback()
        );
    }

    async say(message: string): Promise<void> {
        this.channels.forEach(async (channel: string) => 
            this.client.say(channel, message).catch(console.error)
        );
    }
}