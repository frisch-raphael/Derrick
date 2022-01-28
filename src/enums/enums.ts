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
    Company = 'company',
    ColumboConfig = 'config',
}

export enum ApiRessource {
    Engagement = '/engagements',
    Contact = '/contacts',
    Company = '/companies',
    Config = '/config'
}



export enum DataTest {
    DrawerReportBtn = 'drawer-report-button',
    DrawerAdminBtn = 'drawer-admin-button',
    DialogBase = 'base-dialog',
    DialogBaseCard = 'base-dialog-card',
    DialogBaseClose = 'close-dialog',
    FormSelect = 'select-form',
    FormGenericInput = 'generic-input-form',
    FormDate = 'date-form',
    FormDateDialog = 'date-form-dialog',
    FormDateOpenBtn = 'date-form-open-btn',
    RessourceForm = 'ressource-form',
    RessourceFormNoData = 'no-data',
    RessourceFormCreateEditBtn = 'engagement-create-edit-btn',
    RessourceTable = 'ressource-table',
    RessourceTableSearchInput = 'ressource-table-search-input',
    RessourceTableSelectAll = 'ressource-table-select-all',
    RessourceTableOpenHeaderMenuBtn = 'open-menu-btn',
    RessourceTableHeader = 'ressource-table-header',
    RessourceTableHeaderTitle = 'ressource-table-header-title',
    RessourceTableHeaderDeleteAll = 'ressource-table-header-delete-all',
    RessourceTableHeaderCreateNew = 'ressource-table-header-create-new',
    RessourceTableLoading = 'base-table-loading',
    RessourceTableCard = 'base-table-card',
    RessourceTableCardLoading = 'base-table-card-loading',
    RessourceTableCardDeleteBtn = 'table-card-action-remove',
    RessourceTableCardUpdateBtn = 'table-card-action-update',
    RessourceTableCardSaveBtn = 'table-card-action-save',
    RessourceTableCardCheckbox = 'base-table-card-checkbox',
    ContactTable = 'contact-table',
    ContactTableLoading = 'contact-table-loading',
    EngagementTableLoading = 'engagement-table-loading',
    EngagementTableContactBtn = 'engagement-table-contact-btn',
    EngagementTableCompanyBtn = 'engagement-table-company-btn',
    EngagementFormStartDate = 'form-start_date',
    EngagementFormAssessmentType = 'form-assessment_type',
    EngagementFormTitle = 'form-title',
    CompanyFormFullName = 'form-full_name',
}
