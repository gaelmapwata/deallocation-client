import { NavigationGuardNext } from 'vue-router'
import { RoleE } from '~/types/role'
import { UserI } from '~/types/user'

export const shouldHaveOneOfPermissions =
  ({ permissions } : { next?: NavigationGuardNext, permissions: string[] }) => {
    if (!userHasOneOfPermissions(permissions)) {
      navigateTo('/admin/unauthorized')
    }
  }

export const userHasOneOfPermissions =
  (permissions: string[]): boolean => {
    const { data: currentUser } = useAuth()

    if (currentUser.value) {
      const currentUserPermissions = (currentUser.value as UserI)
        .roles?.flatMap(role => role.permissions)

      const permissionsFiltered = permissions?.filter(p => p)

      if (!permissions || permissionsFiltered.length === 0) {
        return true
      }

      return !!permissionsFiltered
        .find(p => currentUserPermissions
          ?.find(currentUserPermission => currentUserPermission?.slug === p ||
              currentUserPermission?.slug === (`${p.split(':')[0]}:ALL`)))
    }
    return false
  }
// eslint-disable-next-line max-len
export const userIsAdmin = (currentUser: UserI): boolean => !!currentUser.roles && currentUser.roles.some(role => role.name === RoleE.ADMIN)
