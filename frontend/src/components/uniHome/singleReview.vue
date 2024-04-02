<script setup>
import { ref } from 'vue';
import { useCacheStore } from '@/stores'; 

const props = defineProps(['review'])

let showmore = false
let comment_original = props.review.review_text
let comment_trunc = truncate(comment_original, 40)
let comment = ref(comment_trunc)
let exceed = num_words(comment_original, 40)
let date = new Date(props.review.created)

const { getUserPic, getImg } = useCacheStore()

let profileImg = ref()

getUserPic(props.review.user_email).then(async data => {
	if (data) {
		profileImg.value = data
	} else {
		profileImg.value = await getImg('pikachu.jpeg')
	}
})


function num_words(text, length) {
	if (text == undefined || text.length == 0) return 0;
	let words = text.split(' ');
	return words.length > length
}

function truncate(text, length, clamp) {
	if (text == undefined || text.length == 0) return '';
	clamp = clamp || "...";
	let words = text.split(' ');
	return words.length > length ? words.slice(0, length).join(' ') + clamp : text;
}

function onClickShow() {
	showmore = !showmore
	comment.value = showmore ? comment_original : comment_trunc
}

</script>

<template>
	<div class="flex flex-row flex-wrap md:h-1/2 sm:h-full my-3 mx-3 px-4">
		<div class="xl:basis-1/6 lg:basis-1/5 md:basis-1/4 basis-full">
			<img class="w-16 h-16 mb-3 rounded-full shadow-lg" :src="profileImg" alt="Bonnie image" />
		</div>
		<div class="xl:basis-5/6 lg:basis-4/5 md:basis-3/4 basis-full">
			<h3 class="font-semibold text-md">@{{ review.user_email.split('@')[0] }}</h3>
			<h3 class="text-md">{{ date.toDateString() }}, {{ date.toLocaleTimeString() }}</h3>
		</div>
		<div class="lg:basis-11/12 mb-3 lg:px-3">
			<p class="text-gray-500 text-sm md:text-md">{{ comment }}</p>

			<div v-if="exceed">
				<p class="mt-2 font-semibold underline underline-offset-4 text-sm md:text-md text-gray-700 cursor-pointer"
					v-if="!showmore" @click="onClickShow">Show More</p>
				<p class="mt-2 font-semibold underline underline-offset-4 text-sm md:text-md text-gray-700 cursor-pointer" v-else
					@click="onClickShow">Show Less</p>
			</div>

		</div>
	</div>
</template>