import { defineStore } from 'pinia'
import { useSnackbarStore } from '@/stores/snackbar'
import { HttpPaginationResponseI } from '~/types/http'
import { PartnerDetailI } from '../types/partner-detail'

// eslint-disable-next-line import/prefer-default-export
export const usePartnerDetailStore = defineStore('partnerDetail', {
  state: () => ({}),
  actions: {
    storePartnerDetail (partnerDetail:PartnerDetailI) {
      return new Promise((resolve) => {
        useFetchApi('/partner-details', {
          method: 'post',
          body: partnerDetail
        }).then(({ status, data }) => {
          if (status.value === 'success') {
            const snackbarStore = useSnackbarStore()
            const { showSuccessSnackbar } = snackbarStore
            showSuccessSnackbar('Detaille Partenaire  ajouté avec succès')

            resolve(data.value)
          }
        })
      })
    },
    // eslint-disable-next-line max-len
    fetchPartnerDetailWithPagination ({ page, limit }: { page: number, limit: number }): Promise<HttpPaginationResponseI<PartnerDetailI[]>> {
      return new Promise((resolve) => {
        useFetchApi('/partner-details', {
          method: 'get',
          params: {
            page,
            limit
          }
        }).then(({ data }) => {
          if (data.value) {
            resolve(data.value)
          }
        })
      })
    },
    updatePartnerDetail (payload: PartnerDetailI) {
      return new Promise((resolve) => {
        useFetchApi(`/partner-details/${payload.id}`, {
          method: 'put',
          body: payload
        }).then(({ status, data }) => {
          if (status.value === 'success') {
            const snackbarStore = useSnackbarStore()
            const { showSuccessSnackbar } = snackbarStore
            showSuccessSnackbar('Detaille partenaire modifié avec succès')

            resolve(data.value)
          }
        })
      })
    },
    deletePartnerDetail (partnerDetailId: number) {
      return new Promise((resolve) => {
        useFetchApi(`/partner-details/${partnerDetailId}`, {
          method: 'delete'
        }).then(({ status }) => {
          if (status.value === 'success') {
            const snackbarStore = useSnackbarStore()
            const { showSuccessSnackbar } = snackbarStore
            showSuccessSnackbar('Detaille partenaire supprimé avec succès')

            resolve(null)
          }
        })
      })
    }
  }
})
