<template>
  <div class="article-editor">
    <h2 class="editor-title">Article Editor</h2>
    <div class="title-container">
      <label for="title" class="label">Title:</label>
      <input type="text" id="title" v-model="title" class="input" />
    </div>
    <div class="categories-container">
      <label class="label">Categories:</label>
      <div class="category-checkboxes">
        <label v-for="category in availableCategories" :key="category" class="category-label">
          <input
            type="checkbox"
            :value="category"
            v-model="selectedCategories"
            class="category-checkbox"
          />
          {{ category }}
        </label>
      </div>
    </div>
    <div class="tags-container">
      <label for="tags" class="label">Tags:</label>
      <div class="tag-selection">
        <select id="tags" v-model="selectedTags" multiple class="tag-select">
          <option v-for="tag in filteredTags" :key="tag">{{ tag }}</option>
        </select>
      </div>
      <div class="added-tags">
        <span class="tag" v-for="(tag, index) in tags" :key="index">{{ tag }}</span>
      </div>
    </div>
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
  data() {
    return {
      editor: null,
      content: '',
      title: '',
      availableCategories: [
        'Tech',
        'Programming',
        'Web Development',
        'Artificial Intelligence',
        'Cybersecurity'
      ],
      selectedCategories: [],
      selectedTags: [],
      categoryTags: {
        Tech: ['Tech'],
        Programming: ['Programming'],
        'Web Development': ['Web Development'],
        'Artificial Intelligence': ['Artificial Intelligence'],
        Cybersecurity: ['Cybersecurity']
      },
      tags: []
    }
  },
  computed: {
    filteredTags() {
      return this.selectedCategories.flatMap((category) => this.categoryTags[category] || [])
    }
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
      console.log('Title:', this.title)
      console.log('Categories:', this.selectedCategories)
      console.log('Tags:', this.tags)
      console.log('Content:', this.content)
    },
    cancel() {
      // Add cancel logic here
      console.log('Canceling article...')
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

.title-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.label {
  margin-right: 10px;
}

.input {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.categories-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.category-checkboxes {
  display: flex;
  flex-wrap: wrap;
}

.category-label {
  margin-right: 10px;
  font-size: 14px;
  cursor: pointer;
}

.category-checkbox {
  margin-right: 5px;
}

.tags-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.tag-selection {
  flex-grow: 1;
  margin-right: 10px;
}

.tag-select {
  width: 100%;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.added-tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 14px;
  background-color: #e0e0e0;
  border-radius: 4px;
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
