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
    <div class="cover-container">
      <label for="cover" class="label">Cover Image:</label>
      <input
        type="file"
        id="cover"
        @change="handleCoverChange"
        class="cover-input"
        accept="image/*"
      />
      <div v-if="coverUrl" class="cover-preview">
        <img :src="coverUrl" alt="Cover Preview" class="cover-image" />
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
        'Science',
        'Life',
        'Entertainment',
        'Guides',
        'News',
        'Travel',
        'Deals'
      ],
      selectedCategories: [],
      selectedTags: [],
      categoryTags: {
        Tech: ['Tech'],
        Science: ['Science'],
        Life: ['Life'],
        Entertainment: ['Entertainment'],
        Guides: ['Guides'],
        News: ['News'],
        Travel: ['Travel'],
        Deals: ['Deals']
      },
      tags: [],
      coverFile: null,
      coverUrl: null
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
    handleCoverChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.coverFile = file
        this.coverUrl = URL.createObjectURL(file)
      } else {
        this.coverFile = null
        this.coverUrl = null
      }
    },
    async publish() {
      try {
        const authenticatedUser = this.$store.state.user
        const myAuthorId = authenticatedUser._id
        const uploadData = new FormData()
        const fileName = Date.now() + this.coverFile.name
        const formData = new FormData()

        formData.append('title', this.title)
        formData.append('contents', this.content)
        formData.append('createdBy', myAuthorId)
        formData.append('categories', JSON.stringify(this.selectedCategories))

        // Upload the cover image separately
        if (this.coverFile) {
          uploadData.append('name', fileName)
          uploadData.append('file', this.coverFile)
          formData.append('coverImage', fileName)

          await fetch('http://localhost:4000/api/upload', {
            method: 'POST',
            body: uploadData
          })
        }

        // Create the post
        const response = await fetch('http://localhost:4000/api/posts', {
          method: 'POST',
          body: JSON.stringify({
            title: this.title,
            contents: this.content,
            createdBy: myAuthorId,
            coverImage: fileName,
            categories: this.selectedCategories
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const responseData = await response.json()

        // Get the created post ID from the response
        const postId = responseData._id

        // Set the created post ID to the component data property
        this.createdPostId = postId

        // Redirect the user to the created article page
        this.$router.push(`/article/${postId}`)
      } catch (error) {
        console.error('Error publishing article:', error)
      }
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
  margin-top: 135px;
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

.cover-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.cover-input {
  margin-right: 10px;
}

.cover-preview {
  max-width: 100%;
}

.cover-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin-top: 5px;
}
</style>
