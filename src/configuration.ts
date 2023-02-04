import * as joi from 'joi';

require('dotenv').config();

interface IConfiguration {
    accountCredentials: Array<IAccountCredentialsConfiguration>;
    channels: Array<string>;
};

interface IAccountCredentialsConfiguration {
    username: string;
    oAuthToken: string;
};

const parse = (): IConfiguration => {
    const accountCredentials: 
        Array<IAccountCredentialsConfiguration> = JSON.parse(process.env.BOTS_CREDENTIALS);
    const channels: 
        Array<string> = JSON.parse(process.env.TARGET_CHANNELS);

    if (!accountCredentials || !channels) {
        throw new Error('Accounts or Channels section in .env is not defined!');
    }

    const configuration: IConfiguration = {
        accountCredentials: accountCredentials,
        channels: channels,
    };

    const validationResult: boolean = validateConfiguration(configuration);

    if (!validationResult || channels.length === 0) {
        throw new Error('validationResult is false or channels are not defined');
    }

    return configuration;
};

const validateConfiguration = (
    configuration: IConfiguration
): boolean => {
    const credentials: Array<IAccountCredentialsConfiguration> = 
        configuration.accountCredentials;
    
    return credentials.every((credentials) => {
        const validationResult = joi.object({
            [credentials.username]: joi.string().required(),
            [credentials.oAuthToken]: joi.string().required().regex(/^oauth:/),
        }).validate({
            [credentials.username]: credentials.username,
            [credentials.oAuthToken]: credentials.oAuthToken,
        });

        return !validationResult.error;
    });
};

export {
    IConfiguration,
    IAccountCredentialsConfiguration,

    parse,
};