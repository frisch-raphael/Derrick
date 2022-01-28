/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { defineComponent, PropType } from 'vue';
import { TableItem } from 'src/types/types';
import { LooseDictionary } from 'src/types/types';
import { GenericRessource } from '../../../types/types';

export default defineComponent({
    name: 'BaseTableCard',
    props: {
        tableItem: {
            required: true,
            type: Object as () => TableItem
        },

    },
    methods: {
        getFilteredcols: (cols: LooseDictionary) =>
            cols.filter((col: { name: string }) => col.name !== 'desc')
    }
});