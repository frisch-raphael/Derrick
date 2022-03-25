<script setup lang="ts">
import { DataTest, RessourceName } from 'src/enums/enums';
import { ParentRessource, TableItem } from 'src/types/types';
import { RessourceActions } from 'src/ui/BaseTable/ressourceActions';
import { prettyVariable } from 'src/utils/utils';
interface Props {
  tableItem: TableItem;
  ressourceName: RessourceName;
  parentRessource?: ParentRessource;
  smallIcon: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  parentRessource: undefined,
  smallIcon: true,
});

const ressourceActions = new RessourceActions(props.ressourceName, props.parentRessource);
</script>

<template>
  <q-btn
    :data-cy="DataTest.RessourceTableCardUpdateBtn"
    icon="mdi-open-in-new"
    color="secondary"
    flat
    class="self-start q-pt-sm q-pa-xs"
    :size="props.smallIcon ? 'sm' : 'md'"
    @click="ressourceActions.openEditDialog(tableItem?.row)"
  >
    <q-tooltip>Edit {{ prettyVariable(props.ressourceName) }}</q-tooltip>
  </q-btn>
  <q-btn
    :data-cy="DataTest.RessourceTableCardDeleteBtn"
    icon="mdi-close-circle"
    color="red-10"
    flat
    class="self-start q-pt-sm q-pr-sm q-pa-xs"
    :size="props.smallIcon ? 'sm' : 'md'"
    @click="ressourceActions.deleteRowsInTableAndBackend([tableItem?.row.id])"
  >
    <q-tooltip>Delete {{ prettyVariable(props.ressourceName) }}</q-tooltip>
  </q-btn>
</template>
