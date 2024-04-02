<template>

<div class="flex items-start gap-2.5 text-wrap">
    <img class="w-8 h-8 rounded-full" :src="user.image_filename" alt="Jese image">
    <div class="flex flex-col w-full max-w-[290px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
        <div class="flex items-center space-x-2 rtl:space-x-reverse">
            <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ getUsername(user.email) }}</span>
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400 justify-end">{{ getTime(message.time) }}</span>
        </div>
        <div class="message-container text-sm font-normal py-2.5 text-gray-900 dark:text-white text-wrap" v-html="formatMessageText(message.text)"></div>
        <LinkPrevue v-if="hasLink(message.text)" :url="extractLink(message.text)">
         <template v-slot:loading>
            <h1>Loading...</h1>
          </template>
         <template v-slot="props">
           <div class="bg-gray-200 w-full p-2 rounded-lg">
             <img class="w-11/12 m-auto rounded-lg mb-2" :src="props.img" :alt="props.title"/>
             <div class="">
                <h4 class="text-orange text-sm font-semibold">{{extractSitename(extractLink(message.text))}}</h4>
               <p class="text-gray-600 text-sm font-semibold">{{props.title}}</p>
               <!-- <a v-bind:href="props.url" class="btnAction text-centre">More</a> -->
             </div>
           </div>
         </template>
       </LinkPrevue>
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
    </div>
    <!-- <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" data-dropdown-placement="bottom-start" class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600" type="button">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
        </svg>
    </button> -->
    <div id="dropdownDots" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
        <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reply</a>
            </li>
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Forward</a>
            </li>
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Copy</a>
            </li>
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
            </li>
            <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
            </li>
        </ul>
    </div>
</div>

</template>

<script>
import { useAuthStore } from '@/stores'
import LinkPrevue from "link-prevue"


export default {
    props: {
        message: Object,
        user: Object
    },
    data() {
        return {
            profileImage: null,
            urlRegex: /(https?:\/\/[^\s]+)/g,
            sitenameRegex: /(?:https?:\/\/)?(?:www\.)?([^\/\r\n]+)/
        }
    },
    components: {
      LinkPrevue,
    },
    methods: {
         getUsername(email) {
            if (email) {
               return email.split('@')[0];
            }
         },
        getTime(input_date) {
            // console.log(new Date(input_date))
            // console.log(input_date)
			const [year, month, day] = new Date(input_date).toISOString().split('T')[0].split('-').map(Number);
			input_date = [day, month, year]

			const nowDate = new Date()
			const currentDate = [nowDate.getDate(), nowDate.getMonth() + 1, nowDate.getFullYear()]
			let result = ''

			let index = 2
			let timestamp = 'year'
			while (index >= 0) {
				if (currentDate[index] - input_date[index] > 0) {
				if (currentDate[index] - input_date[index] > 1) {
					result = (currentDate[index] - input_date[index]) + ' ' + timestamp + 's ago'
				} else {
					result = (currentDate[index] - input_date[index]) + ' ' + timestamp + ' ago'
				}
				break
				} 
				index--
				if (index == 1) {
				timestamp = 'month'
				} else {
				timestamp = 'day'
				}
			}
			
			return result ? result : 'Today'
		},
      hasLink(text) {
            return this.urlRegex.test(text);
      },
      extractLink(text) {
            const matches = text.match(this.urlRegex);
            if (matches && matches.length > 0) {
                return matches[0]; // Return the first matched URL
            }
            return '';
      },
      extractSitename(url) {
         const match = url.match(this.sitenameRegex);

         if (match) {
            const sitename = match[1];
            const capitalizedSitename = sitename.charAt(0).toUpperCase() + sitename.slice(1);
            return capitalizedSitename.split('.')[0];
         }
         return null;
      },
      formatMessageText(text) {
         // Replace URLs with anchor tags
         const formattedText = text.replace(this.urlRegex, (url) => {
         return `<a href="${url}" class="p-0 text-wrap w-full text-teal-700 font-medium">${url}</a>`;
         });

         return formattedText;
      }
   }
}
</script>

<style scoped>
.message-container {
   word-wrap: break-word;
   overflow-wrap: break-word;
 }
</style>