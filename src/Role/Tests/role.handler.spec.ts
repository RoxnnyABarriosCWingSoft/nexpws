import { SuperAgentTest } from 'supertest';
import { ICreateConnection } from '@digichanges/shared-experience';
import initTestServer from '../../initTestServer';
import { ILoginResponse } from '../../Shared/InterfaceAdapters/Tests/ILogin';
import { IRoleResponse } from './types';
import RolePermissions from '../Domain/Shared/RolePermissions';
import AES from '../../Shared/Utils/SymmetricEncryptOrDecryptEachNestedField';

describe('Start Role Test', () =>
{
    let request: SuperAgentTest;
    let dbConnection: ICreateConnection;
    let token: string = null;
    let roleId = '';
    let deleteResponse: any = null;

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

    describe('Role Success', () =>
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

        test('Add Role without enable property /roles', async() =>
        {
            const payload: any = {
                name: 'Role1 Test',
                slug: 'role1test',
                permissions: []
            };

            const response: IRoleResponse = await request
                .post('/api/roles')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(201);

            roleId = data.id;
        });

        test('Add Role with enable property /roles', async() =>
        {
            const payload: any = {
                name: 'Role2 Test',
                slug: 'role2test',
                permissions: [],
                enable: false
            };

            const response: IRoleResponse = await request
                .post('/api/roles')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(201);

            roleId = data.id;
        });

        test('Add Role with permissions property /roles', async() =>
        {
            const payload: any = {
                name: 'Role3 Test',
                slug: 'role3test',
                permissions: [RolePermissions.I.SAVE],
                enable: true
            };

            const response: IRoleResponse = await request
                .post('/api/roles')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(201);

            roleId = data.id;
        });

        test('Get Role /roles/:id', async() =>
        {
            const payload: any = {
                name: 'Role3 Test',
                slug: 'role3test',
                permissions: [RolePermissions.I.SAVE],
                enable: true
            };

            const response: IRoleResponse = await request
                .get(`/api/roles/${roleId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(data.name).toStrictEqual(payload.name);
            expect(data.slug).toStrictEqual(payload.slug);
            expect(AES(data.permissions, 'decrypt')).toStrictEqual(payload.permissions);
            expect(data.enable).toStrictEqual(payload.enable);
        });

        test('Update Role /roles/:id', async() =>
        {
            const payload: any = {
                name: 'Role3 Test Update',
                slug: 'role3testupdate',
                permissions: [RolePermissions.I.SAVE],
                enable: false
            };

            const response: IRoleResponse = await request
                .put(`/api/roles/${roleId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(201);
        });

        test('Delete Role /roles/:id', async() =>
        {
            const payload: any = {
                name: 'Role4 Test',
                slug: 'role4test',
                permissions: [RolePermissions.I.SAVE],
                enable: true
            };

            const createResponse: IRoleResponse = await request
                .post('/api/roles')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            deleteResponse = await request
                .delete(`/api/roles/${createResponse.body.data.id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data } } = deleteResponse;

            expect(deleteResponse.statusCode).toStrictEqual(201);

            expect(data.name).toStrictEqual(payload.name);
            expect(data.slug).toStrictEqual(payload.slug);
            expect(AES(data.permissions, 'decrypt')).toStrictEqual(payload.permissions);
            expect(data.enable).toStrictEqual(payload.enable);
        });
    });

    describe('Role Fails', () =>
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

        test('Add Role /roles', async() =>
        {
            const payload = {
                firstName: 'Role 2'
            };

            const response: IRoleResponse = await request
                .post('/api/roles')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { message, errors: [error] } } = response;

            expect(response.statusCode).toStrictEqual(422);
            expect(message).toStrictEqual('Failed Request.');

            expect(error.property).toStrictEqual('name');
            expect(error.constraints.isString).toBeDefined();
            expect(error.constraints.isString).toStrictEqual('name must be a string');
        });

        test('Get Role /roles/:id', async() =>
        {
            const response: IRoleResponse = await request
                .get(`/api/roles/${roleId}dasdasda123`)
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

        test('Update Role /roles/:id', async() =>
        {
            const payload: any = {
                name: 150,
                slug: 'role3testupdate',
                enable: 'false'
            };

            const response: IRoleResponse = await request
                .put(`/api/roles/${roleId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { message, errors: [error1, error2] } } = response;

            expect(response.statusCode).toStrictEqual(422);
            expect(message).toStrictEqual('Failed Request.');

            expect(error1.property).toStrictEqual('permissions');
            expect(error1.constraints.isArray).toBeDefined();
            expect(error1.constraints.isArray).toStrictEqual('permissions must be an array');

            expect(error2.property).toStrictEqual('name');
            expect(error2.constraints.isString).toBeDefined();
            expect(error2.constraints.isString).toStrictEqual('name must be a string');
        });

        test('Delete Role error /roles/:id', async() =>
        {
            const deleteErrorResponse = await request
                .delete(`/api/roles/${deleteResponse.body.data.id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { errorCode } } = deleteErrorResponse;

            expect(deleteErrorResponse.statusCode).toStrictEqual(400);
            expect(errorCode).toStrictEqual('shared.exceptions.notFound');
        });
    });
});
