import { RessourceName } from 'src/enums/enums';
import { Engagement } from 'src/dtos/engagement';
export const createRessourceObject = (ressourceName: RessourceName, params: Record<string, any>) => {
    switch (ressourceName) {
        case RessourceName.Engagement:
            return new Engagement(params);
            break;
    }
};

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}
