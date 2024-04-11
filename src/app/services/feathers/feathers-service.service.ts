import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

import { ClientApplication, Codestados, ServiceTypes, createClient } from 'dercosa';

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface TenantUserAvailability {
  email: string;
  tenantId?: string;
  isAvailable: boolean;
  error?: string;
}

/**
 * Simple wrapper for feathers
 */
@Injectable({ providedIn: 'root' })
export class FeathersClientService {
  private apiUrl = environment.backend.apiUrl;
  private connection = socketio(io(this.apiUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity
  }));

  private _feathers = createClient(this.connection);

  // expose services
  public get service() {
    return this._feathers.service;
  }

  public getServiceByPath<Path extends keyof ServiceTypes>(path: Path) {
    return this._feathers.service(path);
  }

  public get on() {
    return this._feathers.on;
  }

  constructor() {
    this._feathers.on('reauthentication-error', (error) => {
      console.log('reauthentication-error', error);
    });
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

  public async getCodEstados(): Promise<Codestados[]> {
    return await this._feathers.service('codestados').find();
  }
}
