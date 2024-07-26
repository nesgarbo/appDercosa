import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dercosa.app',
  appName: 'dercosa',
  webDir: 'www/browser',
  server: {
    hostname: 'serverlinux.dercosa.local'
  }
};

export default config;
