import { defineStore, acceptHMRUpdate } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { globals } from '@/main';

export const useAuthStore = defineStore({
    persist: {
        storage: sessionStorage,
        serializer: {
            deserialize: (fooBar) => {
                const jsonParsed = JSON.parse(fooBar)
                jsonParsed.comments_disliked = new Set(jsonParsed.comments_disliked)
                jsonParsed.comments_liked = new Set(jsonParsed.comments_liked)
                return jsonParsed
            },
            serialize: (fooBar) => JSON.stringify(fooBar, (key, value) => value instanceof Set ? [...value] : value)
        },
        afterRestore: (ctx) => {
            ctx.store.$state.comments_disliked = new Set(ctx.store.$state.comments_disliked)
            ctx.store.$state.comments_liked = new Set(ctx.store.$state.comments_liked)
            ctx.store.$state.validSessionTimeout = null
        }
    },
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: null,
        personal : null,
        returnUrl : null,
        comments_liked : new Set(),
        comments_disliked : new Set(),
        uni_rank : [],
        recommended_uni : [],
        recommended_threads : [],
        notifications : [],
        new_notif: false,
        websocket: false,
        validSessionTimeout : null
    }),
    getters : {
        getRecommendedUniversities() {
            if (this.recommended_uni.length > 0) {
                return Promise.resolve(this.recommended_uni)
            }

            return this.updateRecommendedUniversities()
        },

        getRecommendedThreads() {
            if (this.recommended_threads.length > 0) {
                return Promise.resolve(this.recommended_threads)
            }

            return this.updateRecommendedThreads()
        },
        commentLikeStatus : (state) => { return (comment_id) => {
                if (state.comments_liked.has(comment_id)) {
                    return true
                } else if (state.comments_disliked.has(comment_id)) {
                    return false
                }
                return null
            }
        },
        getProfileImage(){
            if (this.user) {
                return this.user.imageUrl
            } else {
                return undefined
            }
        },
        getMetadata(){
            if (this.user) {
                return this.user.publicMetadata
            } else {
                return undefined
            }
        },
        getName(){
            if (this.user) {
                return this.user.publicMetadata.name ?? this.user.fullName
            } else {
                return undefined
            }
        },
        getEmail(){
            if (this.user) {
                return this.user.primaryEmailAddress.emailAddress
            } else {
                console.error('Failed to get user email address')
                return undefined
            }
        },
        getNewNotifStatus() {
            return this.new_notif
        },
        getHandle(){
            return this.personal.handle
        },
        getExchange(){
            return this.personal.exchange_name
        }
    },
    actions: {
        updateRecommendedUniversities(limit=3) {
            return fetchWrapper.get(`${import.meta.env.VITE_SIMILARITY_BACKEND}/similarity_all`).then( async res => {
                this.uni_rank = res
                this.recommended_uni = await Promise.all(res.slice(0, limit).map( recco => 
                    fetchWrapper.get(`${import.meta.env.VITE_UNI_BACKEND}/universities/name/${recco.university_name}`)
                ))
                return this.recommended_uni
            }).catch( err => {
                // console.log(err);
                return Promise.resolve([])
            })
        },
        updateRecommendedThreads() {
            return fetchWrapper.get(`${import.meta.env.VITE_FORUM_BACKEND}/ranking`).then( res => {
                this.recommended_threads = res
                // console.log(res);
                return res
            }).catch( err => {
                // console.log(err);
                return Promise.resolve([])
            })
        },
        updateLikes(action, comment_id) {

            if (action == 'like') {
                if (this.comments_liked.has(comment_id)) {
                    this.comments_liked.delete(comment_id);
                    return null
                } else {
                    this.comments_liked.add(comment_id)
                }

                if (this.comments_disliked.has(comment_id)) {
                    this.comments_disliked.delete(comment_id);
                }

                return true

            } else {
                if (this.comments_disliked.has(comment_id)) {
                    this.comments_disliked.delete(comment_id);
                    return null
                } else {
                    this.comments_disliked.add(comment_id)
                }

                if (this.comments_liked.has(comment_id)) {
                    this.comments_liked.delete(comment_id);
                }

                return false
            }

        },
        updateNewNotifStatus() {
            this.new_notif = false;
        },
        connectWebsocket() {
            if (this.websocket !== undefined && this.websocket.readyState !== undefined) {
                console.log(this.websocket.readyState)
                this.websocket.close()
            }

            const userEmail = this.getEmail

            const ping_interval = 1000;
            let interval;
            const ws_url = `${import.meta.env.VITE_NOTIF_WS}/ws?userEmail=${userEmail}`

            this.websocket = new WebSocket(ws_url);
            this.websocket.onopen = (event) => {
                this.connected = true
                interval = setInterval(() => {
                    console.log('Keeping notif connection alive')
                }, ping_interval);
                console.log(`Successfully connected to NOTIF websocket server at ${ws_url}`)
            }

            this.websocket.onmessage = (event) => {
                let notif = JSON.parse(event.data)
                notif.commentBy = notif.comment_by
                notif.threadId = notif.thread_id
                if (notif.commentBy != this.getEmail) {
                    this.new_notif = true
                    this.notifications.unshift(notif)
                }
            }

            this.websocket.onclose = (event) => {
                console.log(`Disconnected from NOTIF websocket server at ${ws_url}`)
                this.connected = false
                clearInterval(interval)
            }
        },
        async waitForClerk() {
            // && Object.hasOwn(this.user?.publicMetadata ?? {}, 'name')
            if (this.validSessionTimeout && this.user?.primaryEmailAddress?.emailAddress) {
                console.log('Ongoing session', this.validSessionTimeout)
                return Promise.resolve(true)
            }

            return new Promise((resolve, reject) => {
                const intervalId = setInterval(async () => {
                    // console.log('Checking clerk:', globals.$clerk.loaded);
                    if (globals.$clerk.loaded) {
                        clearInterval(intervalId);
                        let sessionToken;
                        try {
                            console.log('Clerk has been loaded. Grabbing session token... setting timeout...');
                            sessionToken = globals.$clerk.session.getToken()
                            sessionStorage.setItem('__session', await sessionToken)
                            this.user = globals.$clerk.user
                            const validSession = setTimeout(() => {
                                console.log('Session timedout')
                                clearTimeout(validSession)
                                this.validSessionTimeout = null
                            }, 50000)
                            this.validSessionTimeout = validSession
                            return resolve(sessionToken)
                        } catch (error) {
                            console.error('Not signed in')
                            return resolve(false)
                        }
                    }
                    }, 500);
                }
            );
        },
        async getClerkActive() {
            let res;
            if (await this.waitForClerk()) {
                return true
            }

            try {
                res = await fetchWrapper.get(`${import.meta.env.VITE_AUTH_BACKEND}/auth`)
            } catch (error) {
                try {
                    res = await fetchWrapper.get(`${import.meta.env.VITE_AUTH_BACKEND}/auth`)
                    return true
                } catch (error) {
                    console.log('Retry failed');
                    return false
                }
            }

            return true
        },
        login() {
            console.log('Logging in...');

            return fetchWrapper.get(`${import.meta.env.VITE_USER_BACKEND}/users`).then( res => {

                this.$patch({
                    personal : res
                })

                fetchWrapper.get(`${import.meta.env.VITE_USER_BACKEND}/users/interests/${res.email}`).then( data => {
                    this.personal.interests = data.interests
                })

                // if i do have a good response, no need to onboard, can continue NewProfile
                // so probably the sign in will redirect to NewProfile, NewProfile checks if valid through this function?
                fetchWrapper.get(import.meta.env.VITE_FORUM_BACKEND + '/forum/comments_liked/' + res.email).then( data => {
                    console.log(data)
                    this.comments_liked = new Set(data.comments)
                })

                fetchWrapper.get(import.meta.env.VITE_FORUM_BACKEND + '/forum/comments_disliked/' + res.email).then( data => {
                    this.comments_disliked = new Set(data.comments)
                })

                return res
            }).catch( err => {
                // if 404 is given, means i havent onboard, send to OnboardingPage
                console.log("No user data found", err);
                return false
            });

        },
        async updatePersonal(userData) {
            try {
                const res = await fetchWrapper.put(`${import.meta.env.VITE_USER_BACKEND}/users`, userData)
                this.personal = res.user_data
            } catch (error) {
                return Promise.reject(error)
            }
        },
        async updateClerkdata(newData) {

            const {
                // multipart/form-data
                profileImage,
                ...metadata
                } = newData

            const updatedMeta = await fetchWrapper.put(`${import.meta.env.VITE_AUTH_BACKEND}/auth/update`, metadata)
            this.user = updatedMeta
        },
        async getNotifications() {
            if (this.user == undefined) {
                console.error('Failed to get user data')
            }

            let req = { userEmail: this.user?.primaryEmailAddress.emailAddress }
            this.notifications = (await fetchWrapper.post(`${import.meta.env.VITE_NOTIF_GRPC}/get/notifications`, req)).notifications
                            .slice()
                            .toReversed()

            console.log(this.notifications);
            return Promise.resolve(this.notifications)
        },
        logout() {
            globals.$clerk.signOut()
            localStorage.clear()
            sessionStorage.clear()
            this.validSessionTimeout = null
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}