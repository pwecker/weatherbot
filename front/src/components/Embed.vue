<template>
  <div v-if="post && ux.embed.font" class="no-underline! w-full h-full flex bg-[#fff] pt-[12px] pb-[12px] pr-[12px] text-[rgb(15,20,25)] text-[14px] leading-[19px] select-none cursor-pointer hover:bg-stone-50">
    <div class="w-[48px] ml-[6px] h-full flex justify-center">
      <div style="clip-path:circle(50%)" class="w-[34px] h-[34px] bg-cover bg-center bg-no-repeat" :style="{
        backgroundImage: profile_image_url !== null ?
          `url(${profile_image_url})`
          : `url(x.svg)`,
        
        }"></div>
    </div>
    <div class="w-[432px] flex flex-col pl-[6px] md:pl-[0px]">
      <div class="w-full grow-2 min-h-[20px]">
        <div class="flex justify-between">
          <span class="flex items-center">
            <span class="font-[ChirpBoldWeb]">{{name}}</span>
            <span class="pl-[6px] font-[ChirpRegularWeb] text-[rgb(83,100,113)]">@{{username}} · {{age_of_post}}</span>
          </span>
          <span class="flex items-center">
            <svg viewBox="0 0 33 32" aria-hidden="true" class="h-[15px] fill-[rgb(83,100,113)]"><g><path d="M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466"></path></g></svg>
            <svg viewBox="0 0 24 24" aria-hidden="true" class="pl-[6px] h-[15px] fill-[rgb(83,100,113)]"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
          </span>
        </div>
      </div>
      <div class="w-full grow-2 min-h-[20px]">
        <div class="font-[ChirpRegularWeb]">
          {{post.content}}
        </div>
      </div>
      <div class="flex justify-between w-full grow-3 min-h-[30px] text-[rgb(83,100,113)] text-[11px] leading-[12px]">
        <span class="flex items-end">
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-[15px] fill-[rgb(83,100,113)] pr-[2px]"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
          {{abbreviateNumber(reply_count)}}
        </span>
        <span class="flex items-end">
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-[15px] fill-[rgb(83,100,113)] pr-[2px]"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
          {{abbreviateNumber(retweet_count)}}
        </span>
        <span class="flex items-end">
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-[15px] fill-[rgb(83,100,113)] pr-[2px]"><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
          {{abbreviateNumber(like_count)}}
        </span>
        <span class="flex items-end">
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-[15px] fill-[rgb(83,100,113)] pr-[2px]"><g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g></svg>
          {{abbreviateNumber(impression_count)}}
        </span>
        <span class="flex items-end">
          <svg viewBox="0 0 24 24" aria-hidden="true" class="h-[15px] fill-[rgb(83,100,113)]"><g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></g></svg>
          <svg viewBox="0 0 24 24" aria-hidden="true" class="pl-[6px] h-[15px] fill-[rgb(83,100,113)]"><g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g></svg>
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  export default {
  	name: 'Embed',
    props: ['post'],
  	data() {
  		return {
        ux: {
          embed: {
            font: false
          }
        }
      }
  	},
    computed: {
      reply_count() {
        const { public_metrics } = this.post;

        if (public_metrics) {

          return public_metrics.reply_count;
        } else return null;
      },
      retweet_count() {
        const { public_metrics } = this.post;

        if (public_metrics) {

          return public_metrics.retweet_count;
        } else return null;
      },
      like_count() {
        const { public_metrics } = this.post;

        if (public_metrics) {

          return public_metrics.like_count;
        } else return null;
      },
      impression_count() {
        const { public_metrics } = this.post;

        if (public_metrics) {

          return public_metrics.impression_count;
        } else return null;
      },
      name() {
        const { user } = this.post;

        if (user) {

          return this.post.user.name;
        } else return 'User Name';
      },
      username() {
        const { user } = this.post;

        if (user) {

          return this.post.user.username;
        } else return 'username';
      },
      profile_image_url() {
        const { user } = this.post;

        if (user) {

          return this.post.user.profile_image_url;
        } else return null;
      },
      age_of_post() {
        const date = this.post.x_created_at;
        const now = new Date();
        const input = new Date(date);
        const diff = now.getTime() - input.getTime();
        const diffMs = now.getTime() - input.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr = Math.floor(diffMs / 3600000);

        if (diffHr < 24) {
          if (diffHr >= 1) {
            return `${diffHr}h`;
          } else {
            return `${diffMin}m`;
          }
        } else {
          const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' };
          return input.toLocaleDateString('en-US', options);
        }
      }
    },
    async created() {
      try{
        await Promise.all([
          document.fonts.load('14px ChirpRegularWeb'),
          document.fonts.load('14px ChirpBoldWeb'),
        ]);
        this.ux.embed.font = true;
      } catch(e) {}
    },
    methods: {
      abbreviateNumber(n: number) {
        return Intl.NumberFormat('en-US', {
          notation: "compact",
          maximumFractionDigits: 1
        }).format(n);
      }
    }
  }
</script>