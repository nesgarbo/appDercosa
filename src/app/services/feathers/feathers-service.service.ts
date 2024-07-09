import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

import { rx } from 'feathers-reactive';

import {
    ClientApplication,
    Codestados,
    ServiceTypes,
    User,
    createClient,
} from 'feathers-dercosa';

import { Injectable, Signal, inject } from '@angular/core';

import {
    AuthenticationResult,
    AuthenticationRequest,
} from '@feathersjs/authentication';
import appHooks from './app.hooks';

// CASL imports and alias configuration
import { PureAbility, createAliasResolver } from '@casl/ability';
import { unpackRules } from '@casl/ability/extra';
import { Router } from '@angular/router';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BehaviorSubject } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resolveAction = createAliasResolver({
    update: ['patch'],
    read: ['get', 'find'],
    delete: ['remove'],
});

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface Credentials extends LoginCredentials {
    strategy: string;
}

/**
 * Simple wrapper for feathers
 */
@Injectable({ providedIn: 'root' })
export class FeathersClientService {
    private apiUrl = 'https://192.168.0.41:3030';
    private connection = socketio(
        io(this.apiUrl, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
        })
    );

    cloudinaryService = inject(CloudinaryService);

    private _feathers = createClient(this.connection).configure(
        rx({
            idField: 'id',
        })
    );

    public get authentication() {
        return this._feathers.authentication;
    }

    public get authenticated() {
        return this._feathers.authentication.authenticated;
    }

    // expose services
    public get service() {
        return this._feathers.service;
    }

    public getServiceByPath<Path extends keyof ServiceTypes>(path: Path) {
        return this._feathers.service(path);
    }

    public get logout() {
        return this._feathers.logout;
    }

    public get on() {
        return this._feathers.on;
    }

    private _isBooting = new BehaviorSubject<boolean>(false);
    public isBooting$ = this._isBooting.asObservable();

    private _booting = false;
    private set booting(value: boolean) {
        this._booting = value;
        this._isBooting.next(value);
    }
    private get booting(): boolean {
        return this._booting;
    }

    constructor(
        private ability: PureAbility,
        private router: Router
    ) {
        this._feathers.on('reauthentication-error', (error: any) => {
            console.log('reauthentication-error', error);
        });

        this._feathers.on('login', (authResult) => {
            if (
                authResult &&
                authResult.authentication &&
                authResult.authentication.payload
            ) {
                console.log('authResult.user', authResult.user);
                this.configureAbilities(authResult);
                console.log(`on('login') Abilities loaded`, this.ability.can('manage', 'visita'), this.ability.rules);
            }
        });

        this._feathers.on('logout', () => {
            console.log('on("logout") ');
            this.resetAbility();
        });

        this._feathers.hooks(appHooks({ router: this.router }));
    }

    /**
     * Exposes the feathers.io.on event emitter. (connec, disconnect)
     * @param eventName The name of the event to be subscribed to
     * @param listener The function to be executed when the event is triggered
     */
    public ioOn(
        eventName: string | symbol,
        listener: (...args: any[]) => void
    ): ClientApplication {
        return this._feathers.io.on(eventName, listener);
    }

    /**
     * Exposes the feathers.on event emitter. (login, logout, reauthentication-error...)
     * @param eventName The name of the event to be subscribed to
     * @param listener The function to be executed when the event is triggered
     */
    public feathersOn(
        eventName: string | symbol,
        listener: (...args: any[]) => void
    ): ClientApplication {
        return this._feathers.on(eventName, listener);
    }

    public async start() {
        console.log('Starting initial reAuthentication');
        // const a = this._feathers.service('users');
        await this._feathers
            .reAuthenticate()
            .then(() =>
                console.log('Initial authentication with stored JWT done!')
            )
            .catch(() =>
                console.log('No valid token for inicial re-authentication')
            );
    }

    private resetAbility() {
        this.ability.update([]);
    }

    public authenticate(
        credentials?: AuthenticationRequest
    ): Promise<AuthenticationResult> {
        return this._feathers.authenticate(credentials);
    }

    private async configureAbilities(authResult: AuthenticationResult) {
        const { user } = authResult;
        user.backgroundUrl = this.backgroundUrl(user.backgroundUrl);

        console.log('permissions', user.permissions);
        const unpacked = unpackRules(user.permissions);
        console.log('unpacked', unpacked);
        // CASL ability setup
        this.ability.update(unpacked as any);
    }

    public reAuthenticate() {
        return this._feathers.reAuthenticate();
    }

    public updateUserbackgroundUrl(userId: number, backgroundUrl: string) {
        return this.service('users').patch(userId, { backgroundUrl });
    }

    public async isAuthenticated(): Promise<boolean> {
        return this._feathers.authentication.authenticated;
    }

    public login(email: string, password: string): Promise<any> {
        return this.authenticate({
            strategy: 'local',
            email,
            password,
        });
    }

    async editUser(userId: number, user: Partial<User>) {
        return this._feathers.service('users').patch(userId, user);
    }

    public backgroundUrl(url: string): string {
        return !url || url === 'undefined'
            ? 'assets/images/avatar-placeholder.png'
            : this.cloudinaryService.createBackgroundImage(url + '.png');
    }

    public sendResetPwd(email: string): Promise<any> {
        return this.service('authManagement').create({
            action: 'sendResetPwd',
            value: { email },
        });
    }

    public resetPassword(token: string, password: string) {
        return this.service('authManagement').create({
            action: 'resetPwdLong',
            value: { token, password },
        });
    }

    public changePassword(
        email: string,
        oldPassword: string,
        newPassword: string
    ) {
        return this.service('authManagement').create({
            action: 'passwordChange',
            value: {
                user: { email },
                oldPassword,
                password: newPassword,
            },
        });
    }

    public checkUnique(email: string, ownId?: number) {
        const query = {
            action: 'checkUnique',
            value: { email },
        };
        if (ownId) {
            Object.assign(query, { ownId });
        }
        return this.service('authManagement').create({
            action: 'checkUnique',
            value: { email },
            ...(ownId && { ownId }),
        });
    }

    public async getCodEstados(): Promise<Codestados[]> {
        return await this._feathers.service('codestados').find();
    }
}
