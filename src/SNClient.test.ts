import { SNClient } from './SNClient';

test('can instantiate SNClient', () => {
    const client = new SNClient();
    expect(client).toBeDefined();
});