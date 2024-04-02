<template>
	<section class="bg-darkgreen">
		<div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
			<h2
				class="mb-4 text-4xl font-bold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-5xl text-white">
				Exchange Program Community</h2>
				<!-- [Join the forum discussion], [Connect,Learn,and Share]  -->

			<p class="mb-8 text-base font-normal text-gray-100 lg:text-base md:px-6 lg:px-56">
				Connect with Alumni and Current students to discover your ideal exchange program. Better yet, connect with fellow schoolmates embarking on the same exchange journey!</p>
			<div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 px-4">
				<router-link :to="this.$route.params.uniName + '/discussions'"
					class="inline-flex justify-center items-center py-3 px-5 font-medium text-center text-darkgreen rounded-lg border-gray-300 focus:ring-4 focus:ring-gray-100 bg-lightgreen"
					append>
					Join the Forum
					<svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
						viewBox="0 0 14 10">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M1 5h12m0 0L9 1m4 4L9 9" />
					</svg>
				</router-link>
			</div>
		</div>
	</section>
</template>