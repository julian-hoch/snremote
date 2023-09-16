import { SNInstance } from './SNInstance';

test('can instantiate SNInstance', () => {
    const instance = new SNInstance({ hostName: 'my_instance' });
    expect(instance).toBeDefined();
    expect(instance.hostName).toBe('my_instance');
});

test('can get instance status', async () => {
    const instance = new SNInstance({ hostName: 'my_instance' });
    const isUp = await instance.isUp();
    expect(isUp).toBe(true);
});