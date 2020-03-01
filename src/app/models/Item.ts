import { IPropertyObject } from "./propertyObject";

export interface Item {
    id: string;
    className: string;
    tag: string;
    description?: string;
    manufacturer?: string;
    properties?: IPropertyObject;
}
