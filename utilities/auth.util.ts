import { NavigationGuardNext } from 'vue-router'
import { RoleE } from '~/types/role'
import { UserI } from '~/types/user'

export const shouldHaveOneOfPermissions =
  ({ permissions } : { next?: NavigationGuardNext, permissions: string[] }) => {
    const { data } = useAuth()
    const currentUser = data.value as UserI

    if (!userHasOneOfPermissions(currentUser, permissions)) {
      navigateTo('/admin/unauthorized')
    }

    return true
  }

export const userHasOneOfPermissions =
  (currentUser: UserI, permissions: string[]): boolean => {
    const currentUserPermissions = currentUser
      .roles?.flatMap(role => role.permissions)

    const permissionsFiltered = permissions?.filter(p => p)

    if (!permissions || permissionsFiltered.length === 0) {
      return true
    }

    if (!currentUserPermissions || currentUserPermissions.length === 0) {
      return false
    }

    return !!permissionsFiltered
      .find(p => currentUserPermissions
        ?.find(currentUserPermission => currentUserPermission?.slug === p ||
            currentUserPermission?.slug === (`${p.split(':')[0]}:ALL`)))
  }

// eslint-disable-next-line max-len
export const userIsAdmin = (currentUser: UserI): boolean => !!currentUser.roles && currentUser.roles.some(role => role.name === RoleE.ADMIN)

export const PERMISSIONS = {
  USER: {
    CREATE: 'USER:CREATE',
    READ: 'USER:READ',
    DELETE: 'USER:DELETE',
    UPDATE: 'USER:UPDATE',
    LOCK: 'USER:LOCK',
    UNLOCK: 'USER:UNLOCK',
    VALIDATE: 'USER:VALIDATE'
  },
  ROLE: {
    CREATE: 'ROLE:CREATE',
    READ: 'ROLE:READ',
    DELETE: 'ROLE:DELETE',
    UPDATE: 'ROLE:UPDATE',
    ADD_PERMISSIONS: 'ROLE:ADD_PERMISSIONS',
    UPDATE_PERMISSIONS: 'ROLE:UPDATE_PERMISSIONS'
  },
  TRANSACTION: {
    READ: 'TRANSACTION:READ',
    EXPORT: 'TRANSACTION:EXPORT',
    CREATE: 'TRANSACTION:CREATE'
  }
}
