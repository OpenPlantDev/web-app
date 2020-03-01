import * as React from "react";
import { Item } from "../models/Item";
import { ExpandableBlock } from "@bentley/bwc-react/core";
import { ItemDetails } from "./ItemDetails";
import { ItemProperties } from "./ItemProperties";

interface IProps {
  component: Item;
  onClick: (component: Item) => void;
  isSelected: boolean;
}

const selectedStyle = {
  color: "blue",
  fontWeight: "bold",
};


const unselectedStyle = {
  color: "black",
}

// tslint:disable-next-line:variable-name
export const ItemsListItem = (props: IProps) => {
  const style = props.isSelected ? selectedStyle : unselectedStyle;
  return (
    <div>
     <ExpandableBlock title={props.component.tag}>
      <ItemDetails component={props.component} />
    </ExpandableBlock>
    </div>
  );
//    <li style={style} onClick={() => props.onClick(props.component)}>{props.component.tag}</li>

};
