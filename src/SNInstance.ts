import axios, { AxiosResponse } from 'axios';

/**
 * Credentials for a ServiceNow instance. 
 * Right now, only username and password are supported.
 */
type Credentials = {
    username: string;
    password: string;
}


/**
 * This class models ServiceNow instances.
 */
class SNInstance {

    hostName: string;

    credentials?: Credentials;

    constructor(params: { hostName: string, credentials?: Credentials }) {
        this.hostName = params.hostName;
        this.credentials = params.credentials;
    }

    /**
     * Checks if the instance is up.
     * 
     * @returns true if the instance is up, false otherwise.
     */
    async isUp(): Promise<boolean> {
        // check if credentials are set
        if (!this.credentials) {
            throw new Error('Credentials are not set');
        }

        const base = `https://${this.hostName}.service-now.com/`;
        const url = `api/now/timeago/absolute`;

        const username = this.credentials.username;
        const password = this.credentials.password;

        try {
            const result = await axios.get(url, {
                auth: { username, password },
                headers: { 'Accept-Encoding': 'deflate' },
                baseURL: base,
            });
            const rData = result.data;
            console.debug("Result data: ", rData);

            if (typeof rData === 'object') {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error?.response?.status) {
                    console.warn(`Could not retrieve instance status. Error ${error?.response?.status} ${error?.response?.statusText}`);
                } else {
                    console.warn(`Could not retrieve instance status. Error ${error?.message}`);
                }
                console.debug('Full Error:', error);
            } else {
                console.warn(`Could not retrieve instance status. Error`, error);
            }
            return false;
        }
    }
}

export { SNInstance };