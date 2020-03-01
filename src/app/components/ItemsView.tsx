import * as React from "react";
import {Item} from "../models/Item";
import {ItemsList} from "./ItemsList";
import { ItemDetails } from "./ItemDetails";

interface IProps {
  title: string;
  components: Item[];
  selectedItem: Item;
  onItemClick: (comp: Item) => void;
}

// tslint:disable-next-line:variable-name
export const ItemsView = (props: IProps) => {

  return (
    <div>
      <ItemsList title={props.title}
                      components={props.components}
                      selectedItem={props.selectedItem}
                      onItemClick={props.onItemClick} />
      <ItemDetails component={props.selectedItem} />
    </div>
    );

};
