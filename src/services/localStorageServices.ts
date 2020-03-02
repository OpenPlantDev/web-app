export class LocalStorageServices 
{
    private storageSupported: boolean;

    constructor () {
        this.storageSupported = false;
        if (typeof(Storage) != "undefined") 
            this.storageSupported = true;
    }         
             
    private setItem (key: string, value: string): void {
        if (this.storageSupported)
            localStorage.setItem(key, value);
    }
         
    private getItem (key: string, defVal: string): string {
        let retVal = defVal;
        if (this.storageSupported) {
            var storageStr = localStorage.getItem(key);
            if (storageStr != null) {
              retVal = storageStr;
            } else {
              this.setItem(key, defVal);
            }
        }
             
        return retVal;
    }

    public setString(key: string, value: string): void {
      this.setItem(key, value);
    }

    public getString(key: string, defVal: string): string {
        return this.getItem(key, defVal);
    }

    public setBool(key: string, value: boolean): void {
      this.setItem(key, String(value));
    }

    public getBool(key: string, defVal: boolean): boolean {
        let retVal = this.getItem(key, String(defVal));

        return (!retVal || (retVal === "false") || (retVal === "0")) ? false : true;
    }
         
    public setInt(key: string, value: number): void {
      this.setItem(key, String(value));
    }

    public getInt(key: string, defVal: number): number {
        let retVal = parseInt(this.getItem(key, String(defVal)));
        if (retVal === NaN)
            retVal = 0;

        return retVal;
    }

    public setReal(key: string, value: number): void {
      this.setItem(key, String(value));
    }

    public getReal(key:string, defVal: number): number {
        let retVal = parseFloat(this.getItem(key, String(defVal)));
        if (retVal === NaN)
            retVal = 0;

        return retVal;
    }

    removeItem(key: string): void {
        if (this.storageSupported)
            localStorage.removeItem(key);
    }

}
