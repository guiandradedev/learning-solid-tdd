import { v4 as uuidv4 } from "uuid";

export abstract class Entity<T> {
    private _id: string;
    public props: T;

    get id() {
        return this._id;
    }

    constructor(props: T, id?: string) {
        this._id = id ?? uuidv4()
        this.props = props;
    }
}