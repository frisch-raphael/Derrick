import { setActivePinia, createPinia } from 'pinia';
import { RessourceName } from 'src/enums/enums';
import { CreateEditRessourceStateUpdate, useUiStore } from 'src/stores/ui';
import { makeFakeCompany } from 'src/factories/mock/company';
import { makeFakeEngagement } from 'src/factories/mock/engagement';
import { describe, expect, it } from '@jest/globals';
import { makeFakeEngagements } from 'src/factories/mock/engagement';
setActivePinia(createPinia());
const store = useUiStore();

describe('actions', () => {

    it('update create/edit ressource form state', () => {
        const update: CreateEditRessourceStateUpdate = {
            isOpen: true,
            mode: 'create',
            ressourceName: RessourceName.Company,
            ressourceToEdit: makeFakeCompany(),
            isParentStoreTarget: true,
            parentRessource: {
                ressourceName: RessourceName.Engagement,
                ressource: makeFakeEngagement(),
            },
        };
        store.updateCreateEditRessourceState(update);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ressourceName, ...expected } = update;
        expect(expected).toEqual(store.createEditRessourceStatus.company);
    });

    it('partial edit ressource form state', () => {
        const update: CreateEditRessourceStateUpdate = {
            isOpen: true,
            mode: 'create',
            ressourceName: RessourceName.Company,
            ressourceToEdit: makeFakeCompany(),
            isParentStoreTarget: true,
            parentRessource: {
                ressourceName: RessourceName.Engagement,
                ressource: makeFakeEngagement(),
            },
        };
        store.updateCreateEditRessourceState(update);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ressourceName, ...expected } = update;
        store.updateCreateEditRessourceState({ mode: 'edit', ressourceName: RessourceName.Company });
        expected.mode = 'edit';
        expect(expected).toEqual(store.createEditRessourceStatus.company);
    });

    it('destroy ressource table rows', () => {
        const fakeEngagements = makeFakeEngagements(6);
        store.updateRessourceTable(RessourceName.Engagement, fakeEngagements);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        store.destroyRessourceTableRows(RessourceName.Engagement, [fakeEngagements[0].id, fakeEngagements[1].id]);
        expect(store.ressourceTableRows.engagement).toHaveLength(4);
        store.destroyRessourceTableRows(RessourceName.Engagement, [fakeEngagements[2].id]);
        expect(store.ressourceTableRows.engagement).toHaveLength(3);
    });

    it('can create a new row', () => {
        const fakeEngagement = makeFakeEngagement();
        store.updateRessourceTable(RessourceName.Engagement, []);
        store.createEditOneRessourceTableRow(RessourceName.Engagement, fakeEngagement);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(store.ressourceTableRows.engagement?.length).toEqual(1);
        expect((store.ressourceTableRows.engagement?.[0])).toEqual(fakeEngagement);
    });

    it('can edit an already existing row', () => {
        const initialFakeEngagement = makeFakeEngagement();
        store.updateRessourceTable(RessourceName.Engagement, [initialFakeEngagement]);
        const editedFakeEngagement = makeFakeEngagement();
        editedFakeEngagement.id = initialFakeEngagement.id;

        store.createEditOneRessourceTableRow(RessourceName.Engagement, editedFakeEngagement);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(store.ressourceTableRows.engagement?.length).toEqual(1);
        expect((store.ressourceTableRows.engagement?.[0])).toEqual(editedFakeEngagement);
    });

});