import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.mailapp',
  appName: 'mail-app0.2',
  webDir: 'dist/www',
  bundledWebRuntime: false,
  server:{
    // url: "http://10.20.33.34:3000/",
    // allowNavigation:["https://qa.web.de/login/oauth2/*"]
  },
};

export default config;

