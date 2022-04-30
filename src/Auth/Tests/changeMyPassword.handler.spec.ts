import { SuperAgentTest } from 'supertest';
import { ICreateConnection } from '@digichanges/shared-experience';
import initTestServer from '../../initTestServer';

describe('Start change my password Test', () =>
{
    let request: SuperAgentTest;
    let dbConnection: ICreateConnection;
    let token: any = null;

    beforeAll(async() =>
    {
        const configServer = await initTestServer();

        request = configServer.request;
        dbConnection = configServer.dbConnection;
    });

    afterAll((async() =>
    {
        await dbConnection.drop();
        await dbConnection.close();
    }));

    describe('', () =>
    {
        beforeAll(async() =>
        {
            const payload = {
                rut: '12.345.678-9',
                password: '12345678'
            };

            const response = await request
                .post('/api/auth/login?provider=local')
                .set('Accept', 'application/json')
                .send(payload);

            const { body: { data } } = response;

            token = data.token;
        });

        test('Change my password. Fail, wrong password', async() =>
        {
            const payload = {
                currentPassword: '1234567890',
                password: '1234567890',
                passwordConfirmation: '1234567890'
            };

            const response = await request
                .put('/api/auth/change-my-password')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            expect(response.statusCode).toStrictEqual(403);
            expect(response.body.errorCode).toStrictEqual('auth.domain.exceptions.passwordWrong');
        });

        test('Change my password. Success', async() =>
        {
            const payload = {
                currentPassword: '12345678',
                password: '1234567890',
                passwordConfirmation: '1234567890'
            };

            const response = await request
                .put('/api/auth/change-my-password')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const payloadTwo = {
                rut: '12.345.678-9',
                password: payload.currentPassword
            };

            const responseTwo = await request
                .post('/api/auth/login?provider=local')
                .set('Accept', 'application/json')
                .send(payloadTwo);

            expect(response.statusCode).toStrictEqual(201);
            expect(response.body.data.message).toStrictEqual('Updated successfully');

            expect(responseTwo.statusCode).toStrictEqual(403);
            expect(responseTwo.body.errorCode).toStrictEqual('auth.domain.exceptions.badCredentials');
        });
    });
});
