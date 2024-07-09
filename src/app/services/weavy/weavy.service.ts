import { Injectable, ElementRef, OnDestroy } from '@angular/core';

// Declarar la clase Weavy para que TypeScript la reconozca
declare let Weavy: any;

@Injectable({
  providedIn: 'root',
})
export class WeavyService implements OnDestroy {
  private weavy: any; // Instancia de Weavy
  private weavySpace: any; // Espacio de Weavy

  constructor() {}

  // Inicializar Weavy con el token de JWT
  async initializeWeavy(jwt: string, space: { key: string, name: string }) {
    this.weavy = new Weavy({ jwt });

    // Manejar eventos de Weavy
    this.weavy.on('badge', (e: any, data: any) => {
      console.log('Badge event:', data);
      // Aquí puedes manejar las notificaciones o contadores de mensajes
    });

    this.weavySpace = this.weavy.space(space);
    await this.weavy.init();
  }

  // Obtener el token de chat
  async getChatToken(userId: number): Promise<string | null> {
    try {
      const response = await fetch('https://srvapp01/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.token;
      } else {
        console.error('Error fetching token:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  }

  // Cargar el componente de chat
  loadChatComponent(container: ElementRef) {
    if (this.weavySpace) {
      this.weavySpace.app({
        type: 'messenger',
        key: 'chat',
        name: 'Chat',
        container: container.nativeElement,
      });
    } else {
      console.error('Weavy space is not initialized');
    }
  }

  ngOnDestroy(): void {
    if (this.weavy) {
      this.weavy.destroy();
    }
  }
}