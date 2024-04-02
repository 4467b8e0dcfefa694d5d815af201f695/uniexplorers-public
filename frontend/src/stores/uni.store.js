import { defineStore } from 'pinia'
import uni_image_paths from '@/assets/uni_image_paths.json';

export const useUniImageStore = defineStore('uni_images', {
  state: () => ({
    uni_images: uni_image_paths
  })
})
