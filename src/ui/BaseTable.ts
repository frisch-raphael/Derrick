import { ref, defineComponent } from 'vue';
import { Columns, LooseDictionary } from '../types/types';


export default defineComponent({
    props: {
        title: {
            type: String,
            required: true
        },
        loading: {
            type: Boolean,
            required: false,
            default: true
        },
        columns: {
            type: Object as () => Columns<string>,
            required: true,
        },
        rows: {
            type: Object as () => LooseDictionary[],
            required: true,
        },
    },
    setup() {
        return {
            filter: ref(''),
            selected: ref([]),
        }
    }
})