export enum MutationType {
    updateRessourceMenu = 'UPDATE_RESSOURCE_MENU',
    updateCreateEditRessourceState = 'UPDATE_CREATE_EDIT_RESSOURCE_DIALOG',
    updateRessourceTable = 'UPDATE_RESSOURCE_TABLE',
    destroyRessourceTableRows = 'DELETE_RESSOURCE_TABLE',
    destroyChildRessourceTableRows = 'DELETE_CHILD_RESSOURCE_TABLE',
    createEditOneRessourceTableRow = 'CREATE_EDIT_RESSOURCE_TABLE',
    setRessourceTableLoading = 'SET_RESSOURCE_TABLE_LOADING',
}