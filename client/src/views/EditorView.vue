<template>
  <div id="editor"></div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'

export default {
  mounted() {
    this.quill = new Quill('#editor', {
      theme: 'snow'
    })
  }
}
</script>
