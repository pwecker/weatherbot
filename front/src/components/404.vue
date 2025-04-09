<template>
	<Background />
	<div class="w-full h-full flex flex-col items-center text-[13px] md:text-[20px]">
		<div class="flex flex-col max-w-7xl w-full grow pt-[3em] pb-[3em]">
			<div class="flex flex-col justify-center w-full grow-1">
				<div class="font-[OstrichSansHeavy] text-center text-[6.9em] pt-[0.15em] uppercase leading-[0.84em] select-none">
				  <span class="text-slate-200">404</span>
			  </div>
			</div>
			
		</div>
		<div class="w-full h-[3em] text-slate-50 pl-3 text-xs flex justify-center items-center select-none fixed bottom-0 border-t-1 border-slate-300 z-[0]"></div>
	</div>
</template>
<script lang="ts">
	import Background from '@/components/Background.vue';
	export default {
		name: '404',
		components: {
			Background
		},
		data() {

			return {}
		},
	}
</script>
<style scoped></style>