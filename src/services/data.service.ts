import {Settings} from "../services/settings";

export class DataService {

  private _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  private async fetchData(url: string)  {
    console.log(`url: ${url}`);
    const token = Settings.Instance.GetToken();
    if(!token) {
      Settings.Instance.SetToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiZGFuLm5pY2hvbHNAYmVudGxleS5jb20iLCJpYXQiOjE1ODMxNzQ0MjksImV4cCI6MTU4MzI2MDgyOSwiaXNzIjoiYmVudGxleSJ9.SN_Amsvszzm4GWUK_0FmpLYYr5qHDipYwMXpnaHe7fY");
    }
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
