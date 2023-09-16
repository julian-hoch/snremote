jest.mock('axios');

import { SNInstance } from './SNInstance';
import axios from 'axios';

let instance: SNInstance;

beforeAll(() => {
    instance = new SNInstance({ hostName: 'my_instance', credentials: { username: 'my_username', password: 'my_password' } });
});

test('can instantiate SNInstance', () => {
    expect(instance).toBeDefined();
    expect(instance.hostName).toBe('my_instance');
    expect(instance.getBaseUrl()).toBe('https://my_instance.service-now.com/');
});

test('can send request', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ status: 200 });
    const response = await instance.getRequest('api/now/table/incident');
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
});

test('errors are thrown properly', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce({ response: { status: 401 } });

    try {
        await instance.isUp();
    } catch (error) {
        expect(error).toEqual({ response: { status: 401 } });
    }
});

test('can get instance status (up)', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: {} });
    const isUp = await instance.isUp();
    expect(isUp).toBe(true);
});

test('can get instance status (down)', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({});
    const isUp = await instance.isUp();
    expect(isUp).toBe(false);
});

test('can get record', async () => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { result: {} } });
    const record = await instance.getRecord('incident', '1234');
    expect(record).toBeDefined();
});