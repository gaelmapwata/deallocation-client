import { defineStore } from 'pinia'
import { HttpPaginationResponseI } from '~/types/http'
import { TypeUserI } from '../types/type-user'

// eslint-disable-next-line import/prefer-default-export
export const useTypeUserStore = defineStore('type-user', {
  actions: {
    // eslint-disable-next-line max-len
    fetchAllTypeUser ({ page, limit }: { page: number, limit: number }): Promise<HttpPaginationResponseI<TypeUserI[]>> {
      return new Promise((resolve) => {
        useFetchApi('/type-users', {
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
    fetchTypeUsers (): Promise<TypeUserI[]> {
      return new Promise((resolve) => {
        useFetchApi('/type-users/list-type-users', {
          method: 'get'
        }).then(({ data }) => {
          if (data.value) {
            resolve(data.value)
          }
        })
      })
    }
  }
})
