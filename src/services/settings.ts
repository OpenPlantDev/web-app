import { LocalStorageServices } from "./localStorageServices";

const tokenKey = "web-app:token";

// Singleton class
export class Settings {

  private static _instance: Settings;
  localStorageService: LocalStorageServices;

  constructor() {
    this.localStorageService = new LocalStorageServices();
  }
  
  static get Instance(): Settings {
    if(!Settings._instance) {
      Settings._instance = new Settings();
    }

    return Settings._instance;
  }

  public SetToken(value: string): void {
    this.localStorageService.setString(tokenKey, value);
  }

  public GetToken(): string {
    return this.localStorageService.getString(tokenKey, "");
  }

}
