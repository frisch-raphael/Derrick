
export type Context = 'administration' | 'engagement'

export type LooseDictionary = { [index in string]: any };

export type Column<T> =
    {
        name: string;
        /**
         * Label for header
         */
        label: string;
        /**
         * Row Object property to determine value for this column or function which maps to the required property
         * @param row The current row being processed
         * @returns Value for this column
         */
        field: keyof T & string | ((row: LooseDictionary) => any);
        /**
         * If we use visible-columns, this col will always be visible
         */
        required?: boolean;
        /**
         * Horizontal alignment of cells in this column
         * Default value: right
         */
        align?: 'left' | 'right' | 'center';
        /**
         * Tell QTable you want this column sortable
         */
        sortable?: boolean;
        /**
         * Compare function if you have some custom data or want a specific way to compare two rows
         * @param a Value of the first comparison term
         * @param b Value of the second comparison term
         * @param rowA Full Row object in which is contained the first term
         * @param rowB Full Row object in which is contained the second term
         * @returns Comparison result of term 'a' with term 'b'. Less than 0 when 'a' should come first; greater than 0 if 'b' should come first; equal to 0 if their position must not be changed with respect to each other
         */
        sort?: (
            a: any,
            b: any,
            rowA: LooseDictionary,
            rowB: LooseDictionary
        ) => number;
        /**
         * Set column sort order: 'ad' (ascending-descending) or 'da' (descending-ascending); Overrides the 'column-sort-order' prop
         * Default value: ad
         */
        sortOrder?: 'ad' | 'da';
        /**
         * Function you can apply to format your data
         * @param val Value of the cell
         * @param row Full Row object in which the cell is contained
         * @returns The resulting formatted value
         */
        format?: (val: any, row: LooseDictionary) => any;
        /**
         * Style to apply on normal cells of the column
         * @param row The current row being processed
         */
        style?: string | ((row: LooseDictionary) => string);
        /**
         * Classes to add on normal cells of the column
         * @param row The current row being processed
         */
        classes?: string | ((row: LooseDictionary) => string);
        /**
         * Style to apply on header cells of the column
         */
        headerStyle?: string;
        /**
         * Classes to add on header cells of the column
         */
        headerClasses?: string;
    }

export type Columns<T = void> = Column<T>[] | undefined


export type TableItem = {
    key: any;
    /**
     * Row/Item object
     */
    row: GenericRessource;
    /**
     * Row/Item's index (0 based) in the filtered and sorted table
     */
    rowIndex: number;
    /**
     * Row/Item's index (0 based) in the current page of the filtered and sorted table
     */
    pageIndex: number;
    /**
     * Column definitions
     */
    cols: LooseDictionary;
    /**
     * Column mapping (key is column name, value is column object)
     */
    colsMap: LooseDictionary;
    /**
     * Trigger a table sort
     * @param col Column name or column definition object
     */
    sort: (col: string | LooseDictionary) => void;
    /**
     * (Only if using selection) Is row/item selected? Can directly be assigned new Boolean value which changes selection state
     */
    selected: boolean;
    /**
     * Is row/item expanded? Can directly be assigned new Boolean value which changes expanded state
     */
    expand: boolean;
    /**
     * Color name for component from the Quasar Color Palette
     */
    color: string;
    /**
     * Notify the component that the background is a dark color
     */
    dark: boolean;
    /**
     * Dense mode; occupies less space
     */
    dense: boolean;
}

type FunctionlessCardAction = {
    icon: string,
    color: string,
    tooltip: string,
    name: string,
}

type FunctionlessHeaderAction = {
    icon: string,
    name: string,
    datatest: string,
}

export type GenericRessource = Record<string, any> & { id: number }

type FunctionCardAction = {
    function: (id: number) => void,
    isRessourcePayloadNeed: false
} | {
    function: (id: number, ressource: GenericRessource) => void,
    isRessourcePayloadNeed: true
}

type FunctionHeaderdAction = {
    function: () => void,
    params: 'none'
} | {
    function: (rows: Record<string, any>[]) => void,
    params: 'rows'
} | {
    function: (ids: number[]) => void,
    params: 'ids'
}



export type CardAction = (FunctionCardAction) & FunctionlessCardAction
export type HeaderAction = (FunctionHeaderdAction) & FunctionlessHeaderAction
export type Row = { id: number, [x: string]: any }
