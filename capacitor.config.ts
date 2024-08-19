import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dercosa.app',
  appName: 'Dercosa',
  webDir: 'www/browser',
  server: {
    hostname: 'serverlinux.dercosa.local'
  }
};

export default config;
