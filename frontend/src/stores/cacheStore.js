import { defineStore, acceptHMRUpdate } from 'pinia'
import { fetchWrapper } from '../helpers/fetch-wrapper'

export const useCacheStore = defineStore({
  id: 'cache',
  state: () => ({
    imgCache : {},
    threads : [],
    comments : {},
    current : null,
    selectedUni : null,
    uniNames : null
  }),
  getters : {
    getUniNames() {
      if (!this.uniNames) {
        return fetchWrapper.get(`${import.meta.env.VITE_UNI_BACKEND}/universities/all`).then(res => {
            this.uniNames = res
            return res
        })
      } else {
        return Promise.resolve(this.uniNames)
      }
    },
    getComments : (state) => { return (parent_id, depth = null) => {
      // if im on 1, i need to check for 2 until none is returned, from depth 2, i grab all that has parent id of ME
      // if no depth is given, i give out all from 1
      if (depth) {

        if (parent_id) {
          if (depth in state.comments && parent_id in state.comments[depth]) {
            return state.comments[depth][parent_id]
          } else {
            return []
          }
        }

        return state.comments[depth].values()
      }

      return state.comments[1]?.values() ?? []
    }}
  },
  actions: {
    addComment(comment_data) {
      if(comment_data.depth == 1) {
        this.comments[1].push(comment_data)
      } else if (comment_data.depth in this.comments) {

        if (this.comments[comment_data.depth][comment_data.parent_id]) {
          this.comments[comment_data.depth][comment_data.parent_id].push(comment_data)
        } else {
          this.comments[comment_data.depth][comment_data.parent_id] = [comment_data]
        }

      } else {
        let d = {}
        d[comment_data.parent_id] = [comment_data]
        this.comments[comment_data.depth] = d
      }
      // console.log('new structure', this.comments);
    },

    retrieveComments(thread_id) {
      return fetchWrapper.get(import.meta.env.VITE_FORUM_BACKEND + '/forum/comments/' + thread_id).then(data => {
        const out = {1  : []}
        data.forEach(comment => {
          if (comment.depth == 1) {
            out[1].push(comment)
          } else if (comment.depth in out) {

            if (comment.parent_id in out[comment.depth]) {
              out[comment.depth][comment.parent_id].push(comment)
            } else {
              out[comment.depth][comment.parent_id] = [comment]
            }

          } else {
            let d = {}
            d[comment.parent_id] = [comment]
            out[comment.depth] = d
          }
        })

        this.comments = out

        return out[1]
      })
    },
    setCurrentThread(thread_id) {
      this.current = this.threads.find(obj => obj.thread_id == thread_id);
      return this.current
    },
    async getUniThreads(uniName) {
      const threads = await fetchWrapper.get(import.meta.env.VITE_FORUM_BACKEND + '/forum/threads/' + uniName)
      this.threads.push(...threads)
      return threads
    },
    addImg(key, imgBlob) {
      this.imgCache[key] = imgBlob
    },
    async getImg(key) {
        if (this.imgCache[key]) {
            return this.imgCache[key]
        } else {
          const res = await fetchWrapper.get(import.meta.env.VITE_IMAGE_BACKEND + '/' + key,
            {responseType : 'blob', headers : {
              'Cache-Control': 'max-age=86400'
            }})
          this.imgCache[key] = res
          return res
        }
    },

    async getUserPic(user_email) {
      if (this.imgCache[user_email]) {
        return this.imgCache[user_email]
      } else {
        const res = await fetchWrapper.get(`${import.meta.env.VITE_USER_BACKEND}/users/email/${user_email}?fields=image_filename` ,
          {
            headers : {
              'Cache-Control': 'max-age=86400'
            }
          })
        this.imgCache[user_email] = res.image_filename
        return res.image_filename
      }
    }
  },
})


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCacheStore, import.meta.hot))
}