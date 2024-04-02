<script>
	export default {
		props: {
      identifier : {
        required : true
      },
      textCTA : {
        required : true
      },
      commentId : {
        required : false
      }
    },
    methods : {
        handleSubmit() {
          this.$emit('posted', true)
        },
        handleCancel() {
          this.$emit('posted', false)
        },
        hoverEnter(ev) {
          ev.target.style.fontWeight = '600' 
          ev.target.style.color = '#1E363E' 
          ev.target.style.backgroundColor = '#DAE3DD'
        },
        hoverLeave(ev) {
          ev.target.style.fontWeight = '500' 
          ev.target.style.color = '#FFFFFF' 
          ev.target.style.backgroundColor = '#1E363E'
        },
        activeOff(ev) {
          this.hoverEnter(ev)
        },
        activeOn(ev) {
          ev.target.style.backgroundColor = '#C4CCC6'
        }
    },
    inject : ['mq']
	}
</script>

<template>
	<div :id="identifier" class="flex justify-between items-center sm:justify-center">
		    <span v-if="mq.smPlus" class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
          <button class="ql-strike"></button>
        </span>
    
        <!-- Links and Images -->
        <span class="ql-formats">
          <button class="ql-link"></button>
          <!-- <button class="ql-image"></button> -->
        </span>
    
        <!-- Lists -->
        <span class="ql-formats">
          <button class="ql-list" value="ordered"></button>
          <button class="ql-list" value="bullet"></button>
        </span>

    
        <!-- Clean Format -->
        <!-- <span class="ql-formats">
          <button class="ql-clean"></button>
        </span> -->
    
        <!-- Include the custom button you defined earlier -->
        <span class="ql-formats flex grow" style="margin-left: auto; margin-right: 0;">
            <!-- :id="ql-my-custom-button" -->
              <button @mouseenter="hoverEnter" @mouseleave="hoverLeave" @mousedown="activeOn" @mouseup="activeOff" class="quillButton" style="background: #1E363E;
                  color: white;
                  font-weight: bold;
                  width: auto;
                  height: auto;
                  text-align: center;
                  float: right;
                  padding: 8px 24px;
                  " @click="handleSubmit">
                  {{ textCTA }}
              </button>
              <button v-if=" this.commentId" style="
                  color: #D21312;
                  height: auto;
                  width: fit-content;
                  padding-top: 8px;
                  padding-bottom: 8px;
                  margin-right: 8px;
                  float: right;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  " @click="handleCancel">
                  <span>Cancel</span>
              </button>
          </span>

          <span v-if=" this.commentId" class="ql-formats">
          </span>
	</div>
</template>

<style scoped>
.quillButton {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem; 
  padding-left: 1rem;
  padding-right: 1rem; 
  border-radius: 0.5rem; 
  border-width: 1px; 
  border-color: #C4CCC6; 
  width: fit-content; 
  height: fit-content; 
  font-weight: 500; 
  letter-spacing: 0.025em; 
  color: #ffffff; 
  background-color: #1E363E; 
  user-select: none; 
}
</style>