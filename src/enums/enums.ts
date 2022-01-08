export enum Scoring {
    Cvss3 = 0,
    RiskMatrix = 1
}

export enum EngagementState {
    Ongoing = 'Ongoing',
    Done = 'Done',
    Archived = 'Archived',
}

export enum RessourceName {
    Engagement = 'engagement',
    Contact = 'contact',
    Company = 'company'
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
    FormGenericInput = 'generic-input-form',
    FormDate = 'date-form',
    FormDateDialog = 'date-form-dialog',
    FormDateOpenBtn = 'date-form-open-btn',
    RessourceForm = 'ressource-form',
    RessourceTableSearchInput = 'ressource-table-search-input',
    RessourceTableSelectAll = 'ressource-table-select-all',
    RessourceTableOpenHeaderMenuBtn = 'open-menu-btn',
    RessourceTableHeaderDeleteAll = 'ressource-table-header-delete-all',
    RessourceTableCreateBtn = 'engagement-create-btn',
    RessourceTableCard = 'base-table-card',
    RessourceTableCardDeleteBtn = 'table-card-action-remove',
    RessourceTableCardUpdateBtn = 'table-card-action-update',
    RessourceTableCardSaveBtn = 'table-card-action-save',
    RessourceTableCardCheckbox = 'base-table-card-checkbox',
    EngagementFormStartDate = 'form-start_date',
    EngagementFormAssessmentType = 'form-assessment_type',
    EngagementFormTitle = 'form-title',
}
