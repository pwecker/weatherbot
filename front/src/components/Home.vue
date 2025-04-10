<template>
	<Background />
	<div class="w-full h-full flex flex-col items-center text-[13px] md:text-[20px]">
		<div class="flex items-center justify-between pl-3 pr-3 w-full h-[2.9em] fixed top-0 border-b-1 border-slate-100">
			<button @click="ux.home.table = !ux.home.table" class="bg-gray-50 text-slate-800 drop-shadow-xs rounded-[0.5em] h-[63%] flex items-center justify-around text-xs p-3 cursor-pointer hover:underline hover:bg-[#fff]">
				<span v-show="!ux.home.table">Scores ☁</span>
				<span v-show="ux.home.table">☜ Back</span>
			</button>
			<a href="https://github.com/pwecker" target="_blank" class="bg-gray-50 text-slate-800 drop-shadow-xs rounded-[0.5em] h-[63%] flex items-center justify-arxound text-xs p-3 cursor-pointer hover:underline hover:bg-[#fff]">
				View on Github <img class="h-[1em] pl-[0.4em]" src="/github-mark.svg"/>
			</a>
		</div>
		<div class="flex flex-col max-w-7xl w-full grow pt-[3em] pb-[3em]">
			<div v-if="forecasts !== null" v-show="ux.home.table" class="animate-fadein mt-3 flex flex-col justify-start w-full grow-1">
				<Grid :today="today" :content="forecasts" />
			</div>
			<div v-show="!ux.home.table" class="flex flex-col justify-center w-full grow-1">
				<div v-if="ux.home.font" class="animate-slideup-fadein font-[OstrichSansHeavy] text-center text-[8em] pt-[0.15em] uppercase leading-[0.84em] select-none">
				  <span class="text-slate-400">Where </span>
				  <span class="text-slate-400">won't </span>
				  <span class="text-slate-400">you </span>
				  <span class="text-slate-400">go?</span>
			  </div>
			</div>
			<div v-show="!ux.home.table" class="flex flex-col justify-between items-center w-full grow-2 min-h-[80px]">
				<div class="animate-fadein w-[480px] min-h-[80px] max-w-[90vw] drop-shadow-md">
					<Embed v-if="embed" :post="embed" />
				</div>
				<div class="w-full grow max-h-[90px]"></div>
			</div>
		</div>
		<div class="w-full h-[3em] text-slate-50 pl-3 text-xs flex justify-center items-center select-none fixed bottom-0 border-t-1 border-slate-300 z-[0]">
			A trash AI proof of concept on <img class="h-[1.6em]" src="/x.svg"/>
		</div>
	</div>
	<div v-show="!ux.home.table" class="w-[600px] max-w-[90vw] h-[100px] m-auto mt-[-200px] bg-[position:3%_center,_35%_center,_65%_center,_97%_center] bg-[url(strapi5.png),_url(postgis.png),_url(vue3.png),_url(tailwind4.png)] bg-contain bg-no-repeat mix-blend-overlay"></div>
</template>
<script lang="ts">
	import axios from 'axios';
	import Embed from '@/components/Embed.vue';
	import Grid from '@/components/Grid.vue';
	import Background from '@/components/Background.vue';

	export default {
		name: 'Home',
		components: {
			Embed,
			Grid,
			Background
		},
		data() {

			return {
				ux: {
					home: {
						table: false,
						font: false,
						images: [] as any,
						preload: [
							{ media: 'x.svg' },
							{ media: 'github-mark.svg' },
							{ media: 'strapi5.png' },
							{ media: 'vue3.png' },
							{ media: 'tailwind4.png' },
							{ media: 'postgis.png' }
						]
					}
				},
				embed: null,
				today: '',
				forecasts: null,
				front_url: import.meta.env.VITE_FRONT_URL,
				back_url: import.meta.env.VITE_BACK_URL
			}
		},
		created() {
			document.fonts.load('8em OstrichSansHeavy').then(() => {
				this.ux.home.font = true;
			});
			this.preload_images();
			this.get_message().then(() => {
				this.get_forecasts();
			});
		},
		mounted() {},
		methods: {
			async get_forecasts() {
				try {
					const response = await axios.get(
						`${this.back_url}/api/forecasts?filters[date][$eq]=${this.today}&populate=location`,
						{ headers: {
						  'Content-Type': 'application/json',
						}}
					);
					const { data } = response.data;
					this.forecasts = data;
				} catch(e) {}
			},
			async get_message() {
				try {
					const response = await axios.get(
						`${this.back_url}/api/messages?filters[uploaded][$eq]=true&sort=updatedAt:desc&limit=1`,
						{ headers: {
						  'Content-Type': 'application/json',
						}}
					);
					const { data } = response.data;
					this.embed = data[0];
					this.today = data[0].date;
				} catch(e) {}
			},
			async preload_images() {
				const images = this.ux.home.preload.map((image) => {
					return new Promise((resolve) => {
						const img = new Image();
						img.src = `${this.front_url}/${image.media}`;
						img.onload = () => resolve({
							src: img.src,
							width: img.naturalWidth,
							height: img.naturalHeight
						});
						img.onerror = () => resolve(null);
					});
				});

				console.log((await Promise.all(images)).filter(Boolean))

				this.ux.home.images = (await Promise.all(images)).filter(Boolean);
			}
		}
	}
</script>
<style scoped></style>