export enum Scoring {
    Cvss3 = 0,
    RiskMatrix = 1
}

export enum EngagementState {
    Ongoing,
    Done,
    Archived,
}

export enum RessourceName {
    Engagement = 'engagement',
    Contact = 'contact',
    Company = 'companie'
}

export enum ApiRessource {
    Engagement = '/engagements',
    Contact = '/contacts',
    Company = '/companies'
}

export enum DataTest {
    DialogBase = 'base-dialog',
    DialogBaseClose = 'close-dialog',
    FormSelect = 'select-form',
    FormInput = 'input-form',
    FormDate = 'date-form',
    RessourceForm = 'ressource-form',
    RessourceTableSelectAll = 'ressource-table-select-all',
    RessourceTableOpenHeaderMenuBtn = 'open-menu-btn',
    RessourceTableHeaderDeleteAll = 'ressource-table-header-delete-all',
    RessourceTableCreateBtn = 'engagement-create-btn',
    RessourceTableCard = 'base-table-card',
    RessourceTableCardDeleteBtn = 'table-card-action-remove',
    RessourceTableCardSaveBtn = 'table-card-action-save',
    RessourceTableCardCheckbox = 'base-table-card-checkbox',
    EngagementFormStartDate = 'form-start_date',
    EngagementFormAssessmentType = 'form-assessment_type',
    EngagementFormTitle = 'form-title',
}
