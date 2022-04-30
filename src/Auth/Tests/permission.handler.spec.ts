import { SuperAgentTest } from 'supertest';
import { ICreateConnection } from '@digichanges/shared-experience';
import initTestServer from '../../initTestServer';
import { IPermissionsResponse } from './types';
import AES from '../../Shared/Utils/SymmetricEncryptOrDecryptEachNestedField';
import IGroupPermission from '../../Config/IGroupPermission';
import UserPermissions from '../../User/Domain/Shared/UserPermissions';

describe('Start Permission Test', () =>
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

            const response: any = await request
                .post('/api/auth/login?provider=local')
                .set('Accept', 'application/json')
                .send(payload);

            const { body: { data } } = response;

            token = data.token;
        });

        test('Get Permissions', async() =>
        {
            const response: IPermissionsResponse = await request
                .get('/api/auth/permissions')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(200);

            const existPermission = AES<IGroupPermission[]>(data, 'decrypt').some(({ group, permissions }) => group === 'USERS' && permissions.some((permission) => permission === UserPermissions.I.SAVE));

            expect(existPermission).toStrictEqual(true);
        });

        test('Not authorized', async() =>
        {
            const response = await request
                .get('/api/auth/permissions')
                .set('Accept', 'application/json');

            const { body: { errorCode } } = response;

            expect(response.statusCode).toStrictEqual(403);

            expect(errorCode).toStrictEqual('auth.presentation.exceptions.tokenExpired');
        });
    });
});
