import { IAccountCredentialsConfiguration, IConfiguration, parse } from "./configuration";
import { Client } from "tmi.js";

class ClientInstance {
    private client: Client;

    constructor(
        readonly credentials: IAccountCredentialsConfiguration, readonly channels: Array<string>,
    ) {
        this.client = new Client({
            connection: {
                reconnect: true,
                secure: true,
            },
            identity: {
                username: credentials.username,
                password: credentials.oAuthToken,
            },
            channels: channels,
        });

        this.client.connect();
    }

    init(connectedCallback: () => void): void {
        this.client.connect().catch(console.error);

        this.client.on('connected', () => 
            connectedCallback()
        );
    }

    async say(message: string): Promise<void> {
        this.channels.forEach(async (channel: string) => 
            await this.client.say(channel, message)
        );
    }
}

const init = async(
    configuration: IConfiguration = parse(),    
) => {
    configuration.account_credentials.forEach((credentials) => {
        const client: ClientInstance = 
            new ClientInstance(credentials, configuration.channels);
        
        client.init(async () => {
            await attack(client);
        });
    });
};

const attack = async (client: ClientInstance): Promise<void> => {
    await client.say(`!${chooseRandom()}`);

    setInterval(async function () {
        await attack(client);
    }, 1000 * Number(process.env.SENDING_INTERVAL))
};

const chooseRandom = (
    fileName: string = 'commands.json',
) => {
    const commands: Array<string> = require(`${process.cwd()}/${fileName}`);

    if (!commands || commands.length === 0) {
        throw new Error('commands list not found or has no elements');
    }

    return commands[
        Math.floor(Math.random() * commands.length)
    ];
};

init();