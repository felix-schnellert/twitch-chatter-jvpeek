import * as joi from 'joi';

require('dotenv').config();

interface IConfiguration {
    account_credentials: Array<IAccountCredentialsConfiguration>;
    channels: Array<string>;
};

interface IAccountCredentialsConfiguration {
    username: string;
    oAuthToken: string;
};

const parse = (): IConfiguration => {
    const account_credentials: 
        Array<IAccountCredentialsConfiguration> = JSON.parse(process.env.BOTS_CREDENTIALS);
    const channels: 
        Array<string> = JSON.parse(process.env.TARGET_CHANNELS);

    if (!account_credentials || !channels) {
        throw new Error('Accounts or Channels section in .env is not defined!');
    }

    const configuration: IConfiguration = {
        account_credentials: account_credentials,
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
        configuration.account_credentials;
    
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