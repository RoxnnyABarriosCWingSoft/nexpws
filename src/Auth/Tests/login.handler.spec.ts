import { SuperAgentTest } from 'supertest';
import { ICreateConnection } from '@digichanges/shared-experience';
import initTestServer from '../../initTestServer';
import AES from '../../Shared/Utils/SymmetricEncryptOrDecryptEachNestedField';

describe('Start Login Test', () =>
{
    let request: SuperAgentTest;
    let dbConnection: ICreateConnection;

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

    test('Login. Success', async() =>
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

        expect(response.statusCode).toStrictEqual(201);

        expect(AES(data.user.rut, 'decrypt')).toStrictEqual(payload.rut);
    });

    test('Login. Error decrypt, payload not encrypted', async() =>
    {
        const payload = {
            rut: '12.345.678-9',
            password: '12345678'
        };

        const response = await request
            .post('/api/auth/login?provider=local')
            .set('Accept', 'application/json')
            .set('symmetric-encrypt', 'true')
            .send(payload);

        const { body: { errorCode } } = response;

        expect(response.statusCode).toStrictEqual(400);

        expect(errorCode).toStrictEqual('shared.exceptions.symmetricDecryptError');
    });

    test('Login. Wrong Credentials, symmetric-encrypt header not set and payload encrypted', async() =>
    {
        const payload = {
            rut: '12.345.678-9',
            password: '12345678'
        };

        const response = await request
            .post('/api/auth/login?provider=local')
            .set('Accept', 'application/json')
            .send(AES(payload, 'encrypt'));

        const { body: { errorCode } } = response;

        expect(response.statusCode).toStrictEqual(403);

        expect(errorCode).toStrictEqual('auth.domain.exceptions.badCredentials');
    });

    test('Login. Success, payload encrypt', async() =>
    {
        const payload = {
            rut: '12.345.678-9',
            password: '12345678'
        };

        const response = await request
            .post('/api/auth/login?provider=local')
            .set('Accept', 'application/json')
            .set('symmetric-encrypt', 'true')
            .send(AES(payload, 'encrypt'));

        const { body: { data } } = response;

        expect(response.statusCode).toStrictEqual(201);

        expect(AES(data.user.rut, 'decrypt')).toStrictEqual(payload.rut);
    });

    test('Login. Wrong Credentials', async() =>
    {
        const payload = {
            rut: '12.345.678-9',
            password: '1234567890'
        };

        const response: any = await request
            .post('/api/auth/login?provider=local')
            .set('Accept', 'application/json')
            .send(payload);


        const { body: { errorCode } } = response;

        expect(response.statusCode).toStrictEqual(403);

        expect(errorCode).toStrictEqual('auth.domain.exceptions.badCredentials');
    });
});
