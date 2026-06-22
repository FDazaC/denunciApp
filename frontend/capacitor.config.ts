import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.denunciapp.app',
  appName: 'DenunciApp',
  webDir: 'dist',
  plugins: {
    Geolocation: {
      permissions: ['location'],
    },
    Camera: {
      permissions: ['camera', 'photos'],
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#6366f1',
    },
  },
};

export default config;