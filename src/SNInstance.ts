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
     * Get the base url for the instance 
     * (e.g. https://my_instance.service-now.com/).
     * 
     * @returns base url for the instance
     */
    getBaseUrl(): string {
        return `https://${this.hostName}.service-now.com/`;
    }

    /** 
     * This method allows to make generic GET requests to the instance.
     * 
     * @param url url to make the request to
     * @returns the response from the instance
     */
    async getRequest(url: string): Promise<AxiosResponse> {
        if (!this.credentials) {
            throw new Error('Credentials are not set');
        }

        const base = this.getBaseUrl();

        const username = this.credentials.username;
        const password = this.credentials.password;

        try {
            const result = await axios.get(url, {
                auth: { username, password },
                headers: { 'Accept-Encoding': 'deflate' },
                baseURL: base,
            });
            return result;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error?.response?.status) {
                    console.warn(`Could not make request. Error ${error?.response?.status} ${error?.response?.statusText}`);
                } else {
                    console.warn(`Could not make request. Error ${error?.message}`);
                }
                console.debug('Full Error:', error);
            } else {
                console.warn(`Could not make request. Error`, error);
            }
            throw error;
        }
    }


    /**
     * Checks if the instance is up.
     * 
     * @returns true if the instance is up, false otherwise.
     */
    async isUp(): Promise<boolean> {
        if (!this.credentials) {
            throw new Error('Credentials are not set');
        }

        const url = `api/now/timeago/absolute`;

        const result = await this.getRequest(url);
        const rData = result.data;
        console.debug("Result data: ", rData);

        if (typeof rData === 'object') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Will look up a single record in servicenow based on table and id.
     * 
     * @param table table name too look up
     * @param id sys_id of the record
     * @returns record, if found
     */
    async getRecord(table: string, id: string) {
        const base = this.getBaseUrl();
        const url = `api/now/table/${table}/${id}`;

        const result = await this.getRequest(url);
        return result.data.result;
    }

    /**
     * Will look up the schema for the given table.
     * 
     * @param table table name too look up
     * @returns schema of the table
     */
    async getSchema(table: string) {
        const url = `api/now/doc/table/schema/${table}`;

        const result = await this.getRequest(url);
        return result.data.result;
    }

    /**
     * Will look up the schema for the given table.
     * 
     * @param table table name too look up
     * @returns schema of the table
     */
    async getMetadata(table: string) {
        const url = `api/now/ui/meta/${table}`;

        const result = await this.getRequest(url);
        return result.data.result;
    }
}

export { SNInstance };