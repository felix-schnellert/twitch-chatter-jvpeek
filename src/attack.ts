import { IConfiguration, parse } from "./configuration";
import { ClientInstance } from "./client";

const init = () => {
    const configuration: IConfiguration = parse();

    const channels = configuration.channels;

    configuration.accountCredentials.forEach((credentials) => {
        const instance: ClientInstance = new ClientInstance(credentials, channels);

        instance.initialize(() => send(instance));
    });
};

const chooseRandomCommand = (
    fileName: string = 'commands.json',
): string => {
    const commands: Array<string> = require(`${process.cwd()}/${fileName}`);

    if (commands.length === 0) {
        throw new Error('commands list not found or has no elements');
    }

    return commands[
        Math.floor(Math.random() * commands.length)
    ];
};

const send = (instance: ClientInstance) => {
    const command: string = chooseRandomCommand();

    instance.say(`!${command}`);

    setTimeout(() => send(instance), 1000 * Number(process.env.SEND_INTERVAL));
};

init();