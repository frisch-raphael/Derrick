import { mount } from '@cypress/vue';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import { DataTest, RessourceName } from 'src/enums/enums';
import { makeFakeEngagements, makeFakeEngagement } from 'src/factories/mock/engagement';
import { Dialog, Notify } from 'quasar';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import { initRessourceFormWithEngagement, verifyCardContainsContact, verifyCardContainsEngagement } from '../../../test/cypress/utils';
import { ressourceConfig } from 'src/utils/utils';
import { ParentRessource } from 'src/types/types';
import { makeFakeContacts } from 'src/factories/mock/contact';
import { makeFakeContact } from 'src/factories/mock/contact';
import { initRessourceFormWithContact } from '../../../test/cypress/utils';
import { IContact } from 'src/dtos/contact';
import { IEngagement } from 'src/dtos/engagement';
import { createTestingPinia } from '@pinia/testing';
import { useUiStore } from 'src/stores/ui';
import { useConfigStore } from 'src/stores/config';
import { capitalizeFirstLetter } from 'src/utils/utils';
import { ApiRessource } from 'src/enums/enums';
import { makeFakeConfig } from 'src/factories/mock/config';

installQuasarPlugin({ plugins: { Dialog, Notify } });

const parentEngagement: ParentRessource = { ressourceName: RessourceName.Engagement, ressource: { id: 1 } };

const ressourceConfigWithFakes = [
    {
        ...ressourceConfig.engagement,
        fakes: makeFakeEngagements(5),
        name: RessourceName.Engagement,
        parentRessource: undefined,
        endpoint: ressourceConfig.engagement.api,
        initForm: () => initRessourceFormWithEngagement(makeFakeEngagement()),
        verifyForm: (engagement: Partial<IEngagement>) => verifyCardContainsEngagement(engagement),
    },
    {
        ...ressourceConfig.contact,
        fakes: makeFakeContacts(5),
        name: RessourceName.Contact,
        parentRessource: parentEngagement,
        endpoint: `${ressourceConfig.engagement.api}/1${ressourceConfig.contact.api}`,
        initForm: () => initRessourceFormWithContact(makeFakeContact()),
        verifyForm: (contact: Partial<IContact>) => verifyCardContainsContact(contact),
    },
];

for (const ressourceConfig of Object.values(ressourceConfigWithFakes)) {

    describe('The BaseTable mounted with' + ressourceConfig.name, () => {

        beforeEach(async () => {

            mount(BaseTable,
                {
                    global: {
                        plugins: [createTestingPinia({
                            createSpy: (action: any) => cy.spy(action), stubActions: false
                        })]
                    },
                    props: {
                        grid: true,
                        columns: ressourceConfig.columns,
                        ressourceName: ressourceConfig.name,
                        parentRessource: ressourceConfig.parentRessource
                    }
                }).as('wrapper');
            const store = useUiStore();

            cy.intercept('get', ApiRessource.Config, makeFakeConfig()).as('emptyContacts');
            const confStore = useConfigStore();
            await confStore.updateConfigTranslationEntries();


            store.updateCreateEditRessourceState(
                {
                    ressourceName: ressourceConfig.name,
                    isOpen: false,
                    mode: 'create',
                });
            store.updateRessourceTable(ressourceConfig.name, ressourceConfig.fakes);
            Notify.setDefaults({ timeout: 200 });

        });

        it('has correct title', () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            cy.dataCy(DataTest.RessourceTableHeader).should('exist');
            cy.dataCy(DataTest.RessourceTableHeader).should('contain.text', capitalizeFirstLetter(ressourceConfig.name));
            const title = 'Base table title';
            cy.get('@wrapper').invoke('setProps', { title: title });
            cy.dataCy(DataTest.RessourceTableHeader).should('contain.html', title);

        });

        it('edited ressource appear in table', () => {
            // @ts-expect-error little trick plz don't look
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { contacts, company, ...editedRessource } = ressourceConfig.fakes[1];
            editedRessource.id = ressourceConfig.fakes[0].id;
            cy.intercept('PUT', `${ressourceConfig.endpoint}/*`, {
                statusCode: 200,
                body: editedRessource
            });
            cy.dataCy(DataTest.RessourceTableCardUpdateBtn).first().click().then(() => {
                cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                    cy.dataCy(DataTest.DialogBase).should('not.exist');
                    cy.get('.bg-positive.q-notification').should('exist');
                    ressourceConfig.verifyForm(editedRessource);
                });
            });
        });

        it('error popup', () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cy.intercept('PUT', `${ressourceConfig.endpoint}/**`, {
                statusCode: 404,
                body: {}
            });
            cy.dataCy(DataTest.RessourceTableCardUpdateBtn).last().click().then(() => {
                cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                    cy.get('.bg-negative.q-notification').should('exist');
                });
            });
        });

        it('has load bars for edit, create', () => {
            cy.intercept('PUT', `${ressourceConfig.endpoint}/*`, { delay: 250 }).as('update');
            // edit
            cy.dataCy(DataTest.RessourceTableCardUpdateBtn).first().click().then(() => {

                cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                    cy.dataCy(DataTest.RessourceTableLoading).should('have.attr', 'aria-valuenow');
                    cy.dataCy(DataTest.RessourceTableCardLoading).first().should('not.have.attr', 'aria-valuenow').then(() => {
                        cy.wait('@update', { timeout: 10000 }).then(() => {
                            cy.dataCy(DataTest.RessourceTableCardLoading).first().should('have.attr', 'aria-valuenow');
                        });
                    });
                });
            });
            cy.intercept('POST', `${ressourceConfig.endpoint}`, { delay: 250 }).as('createRessource');
            // create
            cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click().then(() => {
                cy.dataCy(DataTest.RessourceTableHeaderCreateNew).click().then(() => {
                    ressourceConfig.initForm();
                    cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                        cy.dataCy(DataTest.RessourceTableLoading, { timeout: 10000 }).should('not.have.attr', 'aria-valuenow').then(() => {
                            cy.wait('@createRessource', { timeout: 10000 }).then(() => {
                                cy.dataCy(DataTest.RessourceTableLoading).should('have.attr', 'aria-valuenow');
                            });
                        });
                    });
                });
            });
            cy.intercept('POST', `${ressourceConfig.endpoint}`, { statusCode: 404, delay: 250 }).as('createError');
            // create & error
            cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click().then(() => {
                cy.dataCy(DataTest.RessourceTableHeaderCreateNew).click().then(() => {
                    ressourceConfig.initForm();
                    cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                        cy.dataCy(DataTest.RessourceTableLoading).should('not.have.attr', 'aria-valuenow').then(() => {
                            cy.wait('@createError').then(() => {
                                cy.dataCy(DataTest.RessourceTableLoading).should('have.attr', 'aria-valuenow');
                            });
                        });
                    });
                });
            });
        });

        it('send correct params to api', () => {
            cy.intercept('PUT', `${ressourceConfig.endpoint}/*`, {}).as(
                'ressource'
            );
            //
            // @ts-expect-error little trick plz don't look
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { contacts, company, ...ressource } = ressourceConfig.fakes[0];
            cy.dataCy(DataTest.RessourceTableCardUpdateBtn).first().click().then(() => {
                cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                    cy.wait('@ressource');
                    for (const [key, value] of Object.entries(ressource)) {
                        cy.get('@ressource').its(`request.body.${key}`).should('equal', value);
                    }
                });
            });
        });

        it('can filter cards', () => {
            cy.dataCy(DataTest.RessourceTableSearchInput).click().type('dsfdsfdsfdsfsfezfzef');
            cy.dataCy(DataTest.RessourceTableCard).should('not.exist');
        });

        it('has different style for selected card', () => {
            cy.dataCy(DataTest.RessourceTableCard).first().should('not.have.class', 'bg-primary');
            cy.dataCy(DataTest.RessourceTableCardCheckbox).first().trigger('click').then(() => {
                cy.dataCy(DataTest.RessourceTableCard).first().should('have.class', 'bg-primary');
            });
        });

        it('display the right number of row', () => {
            cy.dataCy(DataTest.RessourceTableCard).should('have.lengthOf', ressourceConfig.fakes.length);
        });

        it('does not display "no data" warning when rows > 0', () => {
            cy.dataCy('no-data').should('not.exist');
        });

        it('display "no data" warning when no rows, but no loading bar', () => {
            const store = useUiStore();
            store.updateRessourceTable(ressourceConfig.name, []);
            cy.dataCy('no-data').should('exist');
            cy.dataCy(DataTest.RessourceTableLoading).should('have.attr', 'aria-valuenow');
        });

        it('"delete all" disabled if nothing checked', () => {
            cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click().then(() => {
                cy.dataCy(DataTest.RessourceTableHeaderDeleteAll).should('have.class', 'disabled');
            });
        });

        it('can select/unselect all ressources at once', () => {

            cy.dataCy(DataTest.RessourceTableSelectAll).click().then(() => {
                cy.dataCy(DataTest.RessourceTableCardCheckbox).should((card) => {
                    const isChecked = card.attr('aria-checked');
                    expect(isChecked).to.be.equal('true');
                });
            });
            cy.dataCy(DataTest.RessourceTableSelectAll).click().then(() => {
                cy.dataCy(DataTest.RessourceTableCardCheckbox).should((card) => {
                    const isChecked = card.attr('aria-checked');
                    expect(isChecked).to.be.equal('false');
                });
            });
        });

        it('can delete all cards at once', () => {
            cy.dataCy(DataTest.RessourceTableSelectAll).click();
            cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click().then(() => {
                cy.dataCy(DataTest.RessourceTableHeaderDeleteAll).click().then(() => {
                    cy.dataCy(DataTest.RessourceTableCard).should('not.exist');
                });
            });
        });

        it('can update a ressource', () => {
            cy.dataCy(DataTest.RessourceTableSelectAll).click();
            cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click().then(() => {
                cy.dataCy(DataTest.RessourceTableHeaderDeleteAll).click().then(() => {
                    cy.dataCy(DataTest.RessourceTableCard).should('not.exist');
                });
            });
        });

    });
};
