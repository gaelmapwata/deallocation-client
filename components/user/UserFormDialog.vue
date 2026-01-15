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
import { Form, useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useSnackbarStore } from '@/stores/snackbar'
import { useRoleStore } from '@/stores/role'
import { useUserStore } from '@/stores/user'
import { UserI } from '~/types/user'
import { BranchI } from '~/types/branch'
import { TypeUserI } from '~/types/type-user'
import { useBranchStore } from '~/stores/branch'
import { useTypeUserStore } from '~/stores/type-user'

const snackbarStore = useSnackbarStore()

const roleStore = useRoleStore()
const userStore = useUserStore()
const branchStore = useBranchStore()
const typeUserStore = useTypeUserStore()
const { values, setFieldValue } = useForm()
const { loading: roleLoading, roles } = storeToRefs(roleStore)

const props = defineProps({
  modelValue: Boolean,
  action: { type: String, default: '' },
  entity: { type: Object as PropType<UserI>, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue', 'created', 'updated'])

const { showErrorSnackbar } = snackbarStore
const { fetchRoles } = roleStore
const { updateUser, storeUser } = userStore
const { fetchAllBranchesByLoggedBank } = branchStore
const { fetchTypeUsers } = typeUserStore

const form = ref<typeof Form>()
const actionLoading = ref(false)
const branchLoading = ref(false)
const typeUserLoading = ref(false)
const branches = ref<BranchI[]>([])
const typeUsers = ref<TypeUserI[]>([])

const dialogTitle = computed(() => (props.action === 'create' ? 'Création d\'un utilisateur' : 'Modifier l\' utilisateur'))
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

const isStaff = computed(() => {
  const selectedType = typeUsers.value.find(
    t => t.id === values.typeUserId
  )
  return selectedType?.name === 'STAFF'
})

watch(isStaff, (value) => {
  if (value && form.value) {
    form.value.setFieldValue('password', undefined)
  }
})

watch(
  () => values.typeUserId,
  (value) => {
    console.log('typeUserId value =', value)
  }
)

const fields = computed(() => {
  const baseFields = [
    { name: 'email', placeholder: 'Veuillez entre l\' email', label: 'Email', type: 'text' },
    { name: 'password', placeholder: 'Veuillez renseigner le  mots de passe', label: 'Mots de passe', type: 'text' },
    {
      name: 'roles',
      placeholder: 'Veuillez sélectionner les roles',
      label: 'Roles',
      type: 'select-multiple',
      items: roles.value,
      loading: roleLoading.value
    },
    {
      name: 'branchId',
      placeholder: 'Please select branch',
      label: 'Branch',
      type: 'select',
      items: branches.value,
      loading: branchLoading.value,
      itemTitle: 'label'
    },
    {
      name: 'typeUserId',
      placeholder: 'Please select type user',
      label: 'Type user',
      type: 'select',
      items: typeUsers.value,
      loading: typeUserLoading.value,
      itemTitle: 'name'
    }
  ]
  return isStaff.value
    ? baseFields.filter(f => f.name !== 'password')
    : baseFields
})

const formSchema = object({
  email: string()
    .max(255)
    .required('Veuillez renseigner l\'e-mail')
    .email('Veuillez renseigner un email valide'),

  password: string().when('typeUserId', {
    is: (typeUserId: number) => {
      const selectedType = typeUsers.value.find(t => t.id === typeUserId)
      return selectedType?.name === 'PARTNER'
    },
    then: schema => schema.required('Mot de passe requis'),
    otherwise: schema => schema.notRequired()
  })
})

async function onSubmit () {
  if (form.value) {
    const { valid } = await form.value.validate()
    if (valid) {
      actionLoading.value = true
      if (props.action === 'create') {
        await storeUser(form.value.getValues())
        emit('created')
      } else if (props.action === 'update') {
        await updateUser(form.value.getValues())
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

function fetchAllBranches () {
  branchLoading.value = true
  fetchAllBranchesByLoggedBank()
    .then((data) => {
      branches.value = data
    })
    .catch(() => {
      showErrorSnackbar('Failed to fetch branches')
    })
    .finally(() => {
      branchLoading.value = false
    })
}
function fetchAllTypeUsers () {
  typeUserLoading.value = true
  fetchTypeUsers()
    .then((data) => {
      typeUsers.value = data
    })
    .catch(() => {
      showErrorSnackbar('Failed to fetch typeUsers')
    })
    .finally(() => {
      typeUserLoading.value = false
    })
}

fetchRoles()
fetchAllBranches()
fetchAllTypeUsers()
</script>
