import { ICreateConnection } from '@digichanges/shared-experience';
import { SuperAgentTest } from 'supertest';
import MainConfig from '../../Config/mainConfig';
import initTestServer from '../../initTestServer';
import { ILoginResponse } from '../../Shared/InterfaceAdapters/Tests/ILogin';
import { IListUsersResponse, IUserResponse } from './types';
import RolePermissions from '../../Role/Domain/Shared/RolePermissions';
import GenderEnum from '../Domain/Enums/GenderEnum';
import AES from '../../Shared/Utils/SymmetricEncryptOrDecryptEachNestedField';

describe('Start User Test', () =>
{
    let request: SuperAgentTest;
    let dbConnection: ICreateConnection;
    let token: string = null;
    let userId = '';
    let updateResponse: any = null;

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

    describe('User Success', () =>
    {
        beforeAll(async() =>
        {
            const payload = {
                rut: '12.345.678-9',
                password: '12345678'
            };

            const response: ILoginResponse = await request
                .post('/api/auth/login?provider=local')
                .set('Accept', 'application/json')
                .send(payload);

            const { body: { data } } = response;

            token = data.token;
        });

        test('Add User', async() =>
        {
            const payload: any = {
                firstName: 'Jhon',
                lastName: 'Doe',
                email: null,
                rut: '123.456.789-0',
                birthday: '1998-01-27',
                gender: GenderEnum.MALE,
                phoneNumber: '123456789',
                localPhoneNumber: null,
                mainPictureId: null,
                enable: false,
                verify: false,
                permissions: [RolePermissions.I.SAVE],
                password: '12345678',
                passwordConfirmation: '12345678'
            };

            const response: IUserResponse = await request
                .post('/api/users')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(201);

            userId = data.id;
        });

        test('Get User', async() =>
        {
            const response: IUserResponse = await request
                .get(`/api/users/${userId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(AES(data.rut, 'decrypt')).toStrictEqual('123.456.789-0');
        });

        test('Update User', async() =>
        {
            const payload: any = {
                firstName: 'Jhon',
                lastName: 'Doe',
                email: null,
                rut: '123.456.789-0',
                birthday: '1998-01-27',
                gender: GenderEnum.MALE,
                phoneNumber: '123456789',
                localPhoneNumber: null,
                mainPictureId: null,
                enable: false,
                verify: false,
                permissions: [RolePermissions.I.SAVE]
            };

            const response: IUserResponse = await request
                .put(`/api/users/${userId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            expect(response.statusCode).toStrictEqual(201);
        });

        test('Delete User', async() =>
        {
            const payload: any = {
                firstName: 'Jhon',
                lastName: 'Doe',
                email: null,
                rut: '123.456.789-1',
                birthday: '1998-01-27',
                gender: GenderEnum.MALE,
                phoneNumber: '123456788',
                localPhoneNumber: null,
                mainPictureId: null,
                enable: false,
                verify: false,
                permissions: [RolePermissions.I.SAVE],
                password: '12345678',
                passwordConfirmation: '12345678'
            };

            const createResponse: IUserResponse = await request
                .post('/api/users')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            updateResponse = await request
                .delete(`/api/users/${createResponse.body.data.id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            const { body: { data } } = updateResponse;

            expect(updateResponse.statusCode).toStrictEqual(200);

            expect(AES(data.rut, 'decrypt')).toStrictEqual(payload.rut);
        });

        test('Change User password', async() =>
        {
            const payload: any = {
                firstName: 'Jhon',
                lastName: 'Doe',
                email: null,
                rut: '123.456.789-2',
                birthday: '1998-01-27',
                gender: GenderEnum.MALE,
                phoneNumber: '1234567881',
                localPhoneNumber: null,
                mainPictureId: null,
                enable: false,
                verify: false,
                permissions:[],
                password: '12345678',
                passwordConfirmation: '12345678'
            };

            const createResponse: IUserResponse = await request
                .post('/api/users')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const updateResponseChangePassword = await request
                .put(`/api/users/${createResponse.body.data.id}/change-user-password`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    password: '1234567890',
                    passwordConfirmation: '1234567890'
                });

            const { body: { data } } = updateResponseChangePassword;

            expect(updateResponseChangePassword.statusCode).toStrictEqual(201);
        });
    });

    describe('User Fails', () =>
    {
        beforeAll(async() =>
        {
            const payload = {
                rut: '12.345.678-9',
                password: '12345678'
            };

            const response: ILoginResponse = await request
                .post('/api/auth/login?provider=local')
                .set('Accept', 'application/json')
                .send(payload);

            const { body: { data } } = response;

            token = data.token;
        });

        test('Add User', async() =>
        {
            const payload = {
                name: 'User 2',
                type: 'User 1'
            };

            const response: IUserResponse = await request
                .post('/api/users')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { message, errors: [error] } } = response;

            expect(response.statusCode).toStrictEqual(422);
            expect(message).toStrictEqual('Failed Request.');

            expect(error.property).toStrictEqual('permissions');
            expect(error.constraints.isString).toBeDefined();
            expect(error.constraints.isString).toStrictEqual('each value in permissions must be a string');
        });

        test('Get User', async() =>
        {
            const response: IUserResponse = await request
                .get(`/api/users/${userId}not_found`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { message, errors: [error] } } = response;

            expect(response.statusCode).toStrictEqual(422);
            expect(message).toStrictEqual('Failed Request.');

            expect(error.property).toStrictEqual('id');
            expect(error.constraints.isUuid).toBeDefined();
            expect(error.constraints.isUuid).toStrictEqual('id must be a UUID');
        });

        test('Update User', async() =>
        {
            const payload: any = {
                firstName: 'Jhon',
                lastName: 'Doe',
                email: null,
                rut: '123.456.789-0',
                birthday: '1998-01-27',
                gender: GenderEnum.MALE,
                phoneNumber: '123456789',
                localPhoneNumber: null,
                mainPictureId: null,
                enable: false,
                verify: false
            };

            const response: IUserResponse = await request
                .put(`/api/users/${userId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { message, errors: [error] } } = response;

            expect(response.statusCode).toStrictEqual(422);
            expect(message).toStrictEqual('Failed Request.');

            expect(error.property).toStrictEqual('permissions');
            expect(error.constraints.isString).toBeDefined();
            expect(error.constraints.isString).toStrictEqual('each value in permissions must be a string');
        });

        test('Delete User error', async() =>
        {
            const deleteErrorResponse = await request
                .delete(`/api/users/${updateResponse.body.data.id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { errorCode } } = deleteErrorResponse;

            expect(deleteErrorResponse.statusCode).toStrictEqual(400);
            expect(errorCode).toStrictEqual('shared.exceptions.notFound');
        });
    });
});
