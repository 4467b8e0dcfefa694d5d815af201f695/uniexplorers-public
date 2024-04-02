<script setup>
import { Modal } from 'flowbite-vue'
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate';
import { fetchWrapper } from '@/helpers';
import * as yup from 'yup';

const rating = ref()
const comment = ref()
const props = defineProps(['uniName'])
let submitted = ref(false)

const initialErrors = {
  Rating: 'Please select a rating',
  Comment: 'Please enter a comment',
};

const schema = yup.object({
  Comment: yup.string().required().min(1),
});
async function onSubmit(values, { resetForm }) {
  // Submit values to API...
  let query = {'review_text': comment.value, 'rating': rating.value, 'university': props.uniName}
  await fetchWrapper.post(`${import.meta.env.VITE_UNI_BACKEND}/reviews`, query)

  resetForm();
  rating.value = null;
  comment.value = '';
  closeModal();
  submitted.value = true;
  window.location.reload(); 
}

const isShowModal = ref(false)
function closeModal() {
  isShowModal.value = false
}
function showModal() {
  isShowModal.value = true
  submitted.value = false
  rating.value = null;
  comment.value = '';
}


</script>

<template>
  <button @click="showModal" type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 
    font-medium rounded-lg text-sm px-4 py-3 mt-2 lg:mt-0 lg:px-6 lg:py-4">
    Leave a Review
  </button>
  <Modal v-if="isShowModal" @close="closeModal">
    <template #header>
      <div class="flex items-center text-lg">
        Leave a Review
      </div>
    </template>
    <template #body>
      <Form @submit="onSubmit" :validation-schema="schema" :initial-errors="initialErrors">
        <Field v-slot="{ field, errors }" name="Rating" rules="required">
          <span class="align-middle">Rating &nbsp;</span>
          <el-rate class="align-middle pb-1" v-bind="field" v-model="rating" allow-half />
          <div class="align-middle float-right text-red-500" v-if="errors[0] && submitted">Please select a rating</div>
        </Field>
        <Field v-slot="{ field, errors }" v-model="comment" name="Comment" rules="required">
          <textarea v-bind="field" name="Comment" rows="5" maxlength="250"
            class="block mt-2 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            placeholder="Leave a comment..."></textarea>
          <div class="text-red-500" v-if="errors[0] && submitted">Please leave a comment</div>
        </Field>
        <br>
        <button @click="submitted = true"
          class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
          Submit
        </button>
      </Form>
    </template>
  </Modal>
</template>