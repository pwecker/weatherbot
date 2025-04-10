<template>
  <div class="fixed top-0 z-[-1] w-screen h-screen overflow-hidden bg-gradient-to-b from-slate-200 to-gray-400">
    <div
      class="absolute w-full h-full bg-cover bg-center blur-[10px]"
    ></div>
    <div class="absolute w-full h-full">
      <div class="absolute w-full h-full">
        <div
          v-for="(drop, i) in raindrops"
          :key="'border-' + i"
          class="absolute rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.3)]"
          :style="{
            left: `${drop.x * 100}vw`,
            top: `${drop.y * 100}vh`,
            width: `${drop.width - 4}px`,
            height: `${drop.height}px`,
            transform: 'rotateY(0)',
            marginLeft: '2px',
            marginTop: '1px',
          }"
        ></div>
      </div>
      <div class="absolute w-full h-full brightness-125">
        <div
          v-for="(drop, i) in raindrops"
          :key="'drop-' + i"
          class="absolute rounded-full"
          :style="{
            left: `${drop.x * 100}vw`,
            top: `${drop.y * 100}vh`,
            width: `${drop.width}px`,
            height: `${drop.height}px`,
            backgroundImage: `url(${image})`,
            backgroundSize: '5vw 5vh',
            backgroundPosition: `${drop.x * 100}% ${drop.y * 100}%`,
            transform: 'rotate(180deg) rotateY(0)',
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Raindrop {
  x: number;
  y: number;
  width: number;
  height: number;
  delay: string;
}

const image = '/bg.png'
const totalDrops = 33;
const raindrops = ref<Raindrop[]>([])

for (let i = 0; i < totalDrops; i++) {
  const x = Math.random()
  const y = Math.random()
  const dropWidth = 5 + Math.floor(Math.random() * 11)
  const dropStretch = 0.7 + Math.random() * 0.5
  const dropHeight = dropWidth * dropStretch
  const delay = (Math.random() * 2.5 + 1).toFixed(2)

  raindrops.value.push({
    x,
    y,
    width: dropWidth,
    height: dropHeight,
    delay,
  })
}
</script>
<style scoped></style>
