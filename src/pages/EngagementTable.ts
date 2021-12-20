import { defineComponent, onMounted, ref } from 'vue';
import { IEngagement } from 'src/dtos/engagement';
import { Endpoints } from '../enums/enums';
import request from 'src/axios';

export default defineComponent({
    name: 'EngagementTable',
    setup(props) {

        const engagements = ref<IEngagement[]>([])

        onMounted(async () => {
            const response = await request<IEngagement[]>({ method: 'get', url: Endpoints.Engagements })

            engagements.value = response.data
        })

        return { engagements }
    },
});