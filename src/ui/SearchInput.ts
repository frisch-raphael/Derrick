import { defineComponent, ref } from 'vue';


export default defineComponent({
    name: 'SearchInput',
    setup() {
        return {
            filter: ref(''), //TODO link to SearchInput
        };
    }
});