import { defineComponent, onMounted, ref, onBeforeMount, watch } from 'vue';
import EngagementRest from 'src/classes/api/engagement';
import { UseAxiosReturn } from '@vueuse/integrations';
import { IEngagement } from 'src/dtos/engagement';

export default defineComponent({
    name: 'EngagementTable',
    setup(props) {

        const { data: engagements } = EngagementRest.index();
        watch(engagements, (engagement) => { 

        })
        return { engagements }
    },
});