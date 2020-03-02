import {Settings} from "../services/settings";

export class DataService {

  private _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  public async login(userName: string, password: string) {
    let url = `${this._baseUrl}/login`;
    const options = {headers: {'Authorization': `Basic ${Buffer.from(`${userName}:${password}`).toString('base64')}`}};
    return fetch(url, options).then( async (response) => {
              if (response.ok) {
                  const resp = await response.json();
                  console.log(resp.token);
                  return resp.token;
              } else {
                  throw new Error("Error during login");
              }
            }).then((result) => {
                return result;
            }).catch((err) => {
                console.log(`In login catch: ${err}`);
                throw err;
            });

  }

  private async fetchData(url: string)  {
    console.log(`url: ${url}`);
    const token = Settings.Instance.GetToken();
    const options = {headers: {Authorization: `Bearer ${token}`}};

    return fetch(url, options).then( async (response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error reading data");
            }
        }).then((result) => {
            return result;
        }).catch((err) => {
            console.log(`In fetchItems catch: ${err}`);
            throw err;
        });
  }

  public async fetchItems(queryString?: string) {
    try {
      let url = `${this._baseUrl}/items`;
      if(queryString) {
        url = `${url}?${queryString}`
      }
      const result = await this.fetchData(url);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
