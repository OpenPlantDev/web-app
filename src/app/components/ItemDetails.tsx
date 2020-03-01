import * as React from "react";
import {Item} from "../models/Item";
import { ItemProperties } from "./ItemProperties";

interface IProps {
    component: Item;
}

// tslint:disable-next-line:variable-name
export const ItemDetails = (props: IProps) => {
    const comp = props.component;
    if (comp === undefined) {
      return <div></div>;
    }
    return (
        <div>
            <ul style={{listStyleType: "none"}}>
                <li>id: {comp.id}</li>
                <li>class: {comp.className}</li>
                <li>description: {comp.description}</li>
                <ItemProperties properties={comp.properties} />
            </ul>
        </div>
    );
};
