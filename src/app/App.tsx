import * as React from "react";
import * as socketio from "socket.io-client";
import { DataService } from "../services/data.service";
import {Item} from "./models/Item";
import {ItemsView} from "./components/ItemsView";
import { FilterSelect} from "./components/FilterSelect";
import { FilterRadioGroup } from "./components/FilterRadioGroup";
import { FilterButtonGroup } from "./components/FilterButtonGroup";
import {IFilter} from "./models/IFilter";
import { Settings } from "../services/settings";

interface IState {
  components: Item[];
  isLoading: boolean;
  error: Error | undefined;
  selectedItem: Item;
  filter: IFilter;
}

const findItemById = (components: Item[], compId: string): Item | undefined => {
  return components.find((comp) => comp.id === compId);
}

export class App extends React.Component <any, IState> {

  private _socket: SocketIOClient.Socket;
  private _dataService: DataService;
  private _baseUrl: string = "http://localhost:4060";
  public state: IState;
  private _selectedItemId: string = "";
  private _filters = [
    {key: "all", title: "All Items", queryString: "orderby=className,tag"},
    {key: "valves", title: "Valves", queryString: "filter=className='valve'&orderby=tag"},
    {key: "pumps", title: "Pumps", queryString: "filter=className='pump'&orderby=tag"},
    {key: "tanks", title: "Tanks", queryString: "filter=className='tank'&orderby=tag"},
    {key: "equipment", title: "Equipment", queryString: "filter=className='pump' or className='tank'&orderby=className,tag"},
  ];

  constructor(props: any) {
    super(props);
    this._socket = socketio(this._baseUrl);
    this._dataService = new DataService(`${this._baseUrl}/api`);
    this.state = { components: [], isLoading: true, error: undefined,
                  selectedItem: undefined, filter: this._filters[0] };
  }

  public getFilter = (key: string): IFilter | undefined => {
    const filter = this._filters.find((f) => f.key === key);
    if (filter) {
      return filter;
    }
    return undefined;
  }

  public getFilterByValue = (value: string): IFilter | undefined => {
    const filter = this._filters.find((f) => f.title === value);
    if (filter) {
      return filter;
    }
    return undefined;
  }

  public clearFilter = async () => {
    const filter = this.getFilter("all");
    if (filter) {
      this.setState({filter});
      await this.UpdateData(filter);
    }
  }

  public filterOnValves = async () => {
    const filter = this.getFilter("valves");
    if (filter) {
      this.setState({filter});
      await this.UpdateData(filter);
      }
  }

  public filterOnEquipment = async () => {
    const filter = this.getFilter("equipment");
    if (filter) {
      this.setState({filter});
      await this.UpdateData(filter);
    }
  }

  public onFilterChanged = async (filter: IFilter) => {
    this.setState({filter});
    await this.UpdateData(filter);
  }

  public onFilterSelectChanged = async (target: any) => {
    console.log(`OnFilterSelectChanged: value = ${target.value}, key=${target.key}`);
    const filter = this.getFilterByValue(target.value);
    if (filter) {
      this.setState({filter});
      await this.UpdateData(filter);
    } else {
      console.log(`filter not found: ${target.value}`);
    }
  }

  public onItemViewItemClick = (comp: Item) => {
    this._selectedItemId = comp.id;
    this.setState({selectedItem: comp});
  }

  public render() {
    if (this.state.isLoading) {
      return <h3>Loading...</h3>;
    }
    if (this.state.error) {
      return <h3>Error: {this.state.error.message}</h3>;
    }
    // console.log(this.state.components);
    return (
     <div>
       {/* <FilterSelect filters={this._filters}
                        selectedFilter={this.state.filter} 
                        onChange={this.onFilterSelectChanged} /> */}
      <FilterButtonGroup filters={this._filters}
                        selectedFilter={this.state.filter}
                        onClick={this.onFilterChanged} />
      {/* <FilterRadioGroup filters={this._filters}
                        selectedFilter={this.state.filter}
                        onChange={this.onFilterChanged} /> */}
      <ItemsView title={this.state.filter.title}
                      components={this.state.components}
                      selectedItem={this.state.selectedItem}
                      onItemClick={this.onItemViewItemClick} />
     </div>
   );
  }

  private async UpdateData(filter: IFilter) {
    try {
      const result = await this._dataService.fetchItems(filter.queryString);
      console.log(result);
      // check to see if the currently selected component is in the new list
      const comp = findItemById(result, this._selectedItemId);
      if(!comp) {
        this._selectedItemId = "";
      }
      this.setState({ components: result, isLoading: false, error: undefined,
                      selectedItem: comp} );
      return result;
    } catch (err) {
      // console.log(err.message);
      this.setState({ isLoading: false, error: err} );
    }
  }

  public async componentDidMount() {
    console.log("In componentDidMount");
    const token = await this._dataService.login("joe@bentley.com", "123");
    Settings.Instance.SetToken(token);

    // initial fetch of data
    await this.UpdateData(this.state.filter);

    // fetch data if we receive message that the data changed
    this._socket.on("DbUpdated", async (data: any) => {
      console.log("Recieved DbUpdated");
      await this.UpdateData(this.state.filter);
    });

  }
}
