<template>
  <CommonDialog
    v-model="dialog"
    :title="dialogTitle"
    :submit="onSubmit"
    :action-loading="actionLoading"
    width="400"
    action-text="Confirmer"
  >
    <Form
      ref="form"
      :validation-schema="formSchema"
      :initial-values="initialValues"
      @submit="onSubmit"
    >
      <DynamicFields :fields="fields" />
    </Form>
  </CommonDialog>
</template>

<script lang="ts" setup>
import { object, string } from 'yup'
import { Form } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useSnackbarStore } from '@/stores/snackbar'
import { useUserStore } from '@/stores/user'
import { usePartnerDetailStore } from '@/stores/partner-detail'
import { PartnerDetailI } from '~/types/partner-detail'

const snackbarStore = useSnackbarStore()
const userStore = useUserStore()
const partnerDetailStore = usePartnerDetailStore()
const { loading: userLoading, users } = storeToRefs(userStore)

const props = defineProps({
  modelValue: Boolean,
  action: { type: String, default: '' },
  entity: { type: Object as PropType<PartnerDetailI>, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue', 'created', 'updated'])

const { showErrorSnackbar } = snackbarStore
const { fetchUsers } = userStore
const { updatePartnerDetail, storePartnerDetail } = partnerDetailStore

const form = ref<typeof Form>()
const actionLoading = ref(false)
const dialogTitle = computed(() => (props.action === 'create' ? 'Création d\'un partenaire' : 'Modifier le partenaire'))
const dialog = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  }
})
const initialValues = computed(() => {
  if (props.action === 'update') {
    return props.entity || {}
  }
  return {}
})
const fields = computed(() => [
  { name: 'partnerName', placeholder: 'Veuillez entre le nom du partenaire', label: 'Nom du partenaire', type: 'text' },
  { name: 'partnerAddress', placeholder: 'Veuillez entre l\'adresse  du partenaire', label: 'Adresse du partenaire', type: 'text' },
  { name: 'partnerPhone', placeholder: 'Veuillez entre le numeros de téléphone  du partenaire', label: 'Num Tel  du partenaire', type: 'text' },
  {
    name: 'users',
    placeholder: 'Veuillez sélectionner l\'utilisateur',
    label: 'Utilisateurs',
    type: 'select-multiple',
    items: users.value,
    loading: userLoading.value
  }
])

const formSchema = object({
  partnerName: string()
    .max(255)
    .required('Veuillez renseigner le nom du partenaire'),
  partnerAddress: string()
    .max(255)
    .required('Veuillez renseigner l\'adresse  du partenaire')
})

async function onSubmit () {
  if (form.value) {
    const { valid } = await form.value.validate()
    if (valid) {
      actionLoading.value = true
      if (props.action === 'create') {
        await storePartnerDetail(form.value.getValues())
        emit('created')
      } else if (props.action === 'update') {
        await updatePartnerDetail(form.value.getValues())
        emit('updated')
      }
      actionLoading.value = false
      form.value.resetForm()
      dialog.value = false
    } else {
      showErrorSnackbar('Formulaire incorrect')
    }
  }
}

fetchUsers()

</script>
