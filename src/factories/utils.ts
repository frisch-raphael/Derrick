import { RessourceName } from '../enums/enums';
import { Engagement } from '../dtos/engagement';
export const createRessourceObject = (ressourceName: RessourceName, params: Record<string, any>) => {
    switch (ressourceName) {
        case RessourceName.Engagement:
            return new Engagement(params);
            break;
    }
};