/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { defineComponent, PropType } from 'vue';
import { TableItem, CardAction as CardAction } from 'src/types/types';
import { LooseDictionary } from 'src/types/types';

export default defineComponent({
    name: 'BaseTableCard',
    props: {
        tableItem: {
            required: true,
            type: Object as () => TableItem
        },
        actions: {
            type: Array as PropType<CardAction[]>,
            required: false,
            default: (): CardAction[] => [],
        }
    },
    data() {
        const launchAction = (action: CardAction, row: Record<string, any>) => {
            action.isRessourcePayloadNeed || action.function(row.id);
            action.isRessourcePayloadNeed && action.function(row.id, row);

        };
        return { launchAction };
    },
    methods: {
        getFilteredcols: (cols: LooseDictionary) =>
            cols.filter((col: { name: string }) => col.name !== 'desc')
    }
});