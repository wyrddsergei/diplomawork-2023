<template>
  <div class="article-editor">
    <h2 class="editor-title">Article Editor</h2>
    <div class="editor-content" ref="editorContent"></div>
    <div class="button-container">
      <button class="publish-button" @click="publish">Publish</button>
      <button class="cancel-button" @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'

export default {
  mounted() {
    this.initializeEditor()
  },
  methods: {
    initializeEditor() {
      this.editor = new Quill(this.$refs.editorContent, {
        theme: 'snow',
        placeholder: 'Write your article here...'
      })

      this.editor.on('text-change', () => {
        this.content = this.editor.root.innerHTML
      })
    },
    publish() {
      // Add publish logic here
      console.log('Publishing article...')
    },
    cancel() {
      // Add cancel logic here
      console.log('Canceling article...')
    }
  },
  data() {
    return {
      editor: null,
      content: ''
    }
  }
}
</script>

<style scoped>
.article-editor {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 4px;
  font-family: Arial, sans-serif;
  max-width: 600px; /* Set desired maximum width */
  margin: 0 auto; /* Center the container horizontally */
  background-color: #f8f8f8; /* Add a background color */
}

.editor-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.editor-content {
  width: 100%;
  height: 300px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff; /* Set editor background color */
}

.button-container {
  display: flex;
  justify-content: flex-end;
}

.publish-button {
  padding: 6px 12px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  margin-right: 10px;
}

.cancel-button {
  padding: 6px 12px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: #dc3545;
  color: #fff;
  cursor: pointer;
}

.publish-button:hover {
  background-color: #0056b3;
}

.cancel-button:hover {
  background-color: #c82333;
}
</style>
