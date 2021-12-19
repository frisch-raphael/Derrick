import { useAxios } from '@vueuse/integrations';
import { IEngagement } from 'src/dtos/engagement';


export default class EngagementRest {
    static endpoint = '/engagement'

    static index() {
        return useAxios<IEngagement[]>(this.endpoint)
    }
}