<template>
  <div class="page-container">
    <div class="d-flex mb-4 justify-end">
      <v-btn
        v-if="userHasOneOfPermissions(['PARTNERDETAIL:CREATE'])"
        prepend-icon="mdi-plus"
        color="primary"
        rounded="xl"
        @click="onAddPartnerDetail()"
      >
        <span class="text-none">Ajouter</span>
      </v-btn>
      <v-btn
        v-if="userHasOneOfPermissions(['PARTNERDETAIL:UPDATE'])"
        :disabled="!selectedPartnerDetail"
        prepend-icon="mdi-pencil"
        color="white"
        rounded="xl"
        class="ml-2"
        @click="onEditPartnerDetail()"
      >
        <span class="text-none">Modifier</span>
      </v-btn>
      <v-btn
        v-if="userHasOneOfPermissions(['PARTNERDETAIL:DELETE'])"
        :disabled="!selectedPartnerDetail || deletionInLoading"
        :loading="deletionInLoading"
        prepend-icon="mdi-delete"
        color="white"
        rounded="xl"
        class="ml-2"
        @click="onDeletePartnerDetail()"
      >
        <span class="text-none">Supprimer</span>
      </v-btn>
    </div>

    <v-card rounded="xl" elevation="0">
      <template #text>
        <v-data-table-server
          v-model="selectedPartnerDetails"
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          :items-length="totalItems"
          :headers="(headers as any)"
          :items="partnerDetails"
          :loading="partnerDetailsLoading"
          items-per-page-text="Items par page"
          item-value="id"
          select-strategy="single"
          show-select
          return-object
          @update:options="loadPartnerDetails"
        >
          <template #[`item.index`]="{ index }">
            {{ (itemsPerPage * (page - 1)) + index + 1 }}
          </template>
          <template #[`item.user`]="{ item }">
            <v-chip-group>
              <v-chip>
                {{ item.user.email }}
              </v-chip>
            </v-chip-group>
          </template>
        </v-data-table-server>
      </template>
    </v-card>
    <PartnerDetailFormDialog
      v-model="partnerDetailFormDialogVisible"
      :action="partnerDetailFormDialogAction"
      :entity="selectedPartnerDetail || undefined"
      @created="refreshPartnerDetails()"
      @updated="refreshPartnerDetails()"
    />
    <CommonConfirmDialog
      v-model="confirmDialogVisible"
      :text="textConfirmDeletion"
      @confirm="onConfirmDeletion"
    />
  </div>
</template>
<script lang="ts" setup>
import { usePartnerDetailStore } from '@/stores/partner-detail'
import { shouldHaveOneOfPermissions, userHasOneOfPermissions } from '@/utilities/auth.util'
import { PartnerDetailI } from '~/types/partner-detail'

definePageMeta({
  layout: 'admin',
  middleware: [(_, __, next) => shouldHaveOneOfPermissions({ next, permissions: ['PARTNERDETAIL:READ'] })]

})
useAdminBreadcrumb('mdi-account-group', [{
  title: 'Partenaire',
  href: '/admin/partner-detail'
}])

const partnerDetailStore = usePartnerDetailStore()
const { fetchPartnerDetailWithPagination, deletePartnerDetail } = partnerDetailStore
const itemsPerPage = ref(10)
const page = ref(1)
const selectedPartnerDetails = ref([])
const partnerDetails = ref<PartnerDetailI[]>([])
const totalItems = ref(0)
const partnerDetailFormDialogVisible = ref(false)
const partnerDetailFormDialogAction = ref<string | undefined>(undefined)
const confirmDialogVisible = ref(false)
const deletionInLoading = ref(false)
const partnerDetailsLoading = ref(false)

const textConfirmDeletion = computed(
  () => `Voulez-vous vraiment supprimer l'utilisateur <strong>"${selectedPartnerDetail.value?.partnerName}"</strong> ?`
)

const selectedPartnerDetail = computed<PartnerDetailI | null>(
  () => (selectedPartnerDetails.value.length > 0 ? selectedPartnerDetails.value[0] : null)
)

const headers = [
  {
    title: '#',
    align: 'start',
    sortable: false,
    key: 'index'
  },
  {
    title: 'Nom du Partenaire',
    key: 'partnerName'
  },
  {
    title: 'Adresse du Partenaire',
    key: 'partnerAddress'
  },
  {
    title: 'Num Tel du Partenaire',
    key: 'partnerPhone'
  },
  {
    title: 'Email',
    key: 'user'
  }
]

function onEditPartnerDetail () {
  partnerDetailFormDialogAction.value = 'update'
  partnerDetailFormDialogVisible.value = true
}

function onAddPartnerDetail () {
  partnerDetailFormDialogAction.value = 'create'
  partnerDetailFormDialogVisible.value = true
}

function onDeletePartnerDetail () {
  confirmDialogVisible.value = true
}

async function onConfirmDeletion () {
  if (selectedPartnerDetail.value) {
    deletionInLoading.value = true
    await deletePartnerDetail(selectedPartnerDetail.value.id)
    refreshPartnerDetails()
    deletionInLoading.value = false
  }
}

function refreshPartnerDetails () {
  loadPartnerDetails({
    page: page.value,
    itemsPerPage: itemsPerPage.value
  })
}

async function loadPartnerDetails (payload: { page: number, itemsPerPage: number }) {
  partnerDetailsLoading.value = true
  const { data, total } = await fetchPartnerDetailWithPagination(
    { page: payload.page, limit: payload.itemsPerPage }
  )
  partnerDetails.value = data
  totalItems.value = total
  partnerDetailsLoading.value = false
}

</script>
