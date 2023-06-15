<template>
  <div class="article-creation-page">
    <h1>Create an Article</h1>
    <form>
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="article.title" class="form-input" />
      </div>
      <div class="form-group">
        <label for="content">Content:</label>
        <textarea id="content" v-model="article.content" class="form-textarea"></textarea>
      </div>
      <div class="form-group">
        <label for="image">Image:</label>
        <input type="file" id="image" @change="handleImageUpload" class="form-file" />
      </div>
      <div class="form-group">
        <label for="tags">Tags:</label>
        <select id="tags" v-model="article.tags" multiple class="form-select">
          <option value="technology">Technology</option>
          <option value="science">Science</option>
          <option value="art">Art</option>
          <!-- Add more tag options here -->
        </select>
      </div>
      <!-- <div class="form-group">
        <label for="postpone-date">Postpone:</label>
        <input type="date" id="postpone-date" v-model="article.postponeDate" class="form-input" />
        <input type="time" id="postpone-time" v-model="article.postponeTime" class="form-input" />
      </div> -->
      <button type="submit" class="btn-submit">Publish Article</button>
      <!-- <button type="button" class="btn-postpone" @click="togglePostponeForm">Postpone</button> -->
      <div v-if="showPostponeForm" class="postpone-form">
        <h3>Postpone Article</h3>
        <div class="form-group">
          <label for="postpone-date">Date:</label>
          <input type="date" id="postpone-date" v-model="article.postponeDate" class="form-input" />
        </div>
        <div class="form-group">
          <label for="postpone-time">Time:</label>
          <input type="time" id="postpone-time" v-model="article.postponeTime" class="form-input" />
        </div>
        <button type="button" class="btn-cancel" @click="togglePostponeForm">Cancel</button>
        <button type="button" class="btn-confirm" @click="setPostponeDateTime">Set Postpone</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ArticleCreationPage',
  data() {
    return {
      article: {
        title: '',
        content: '',
        tags: [],
        image: null,
        postponeDate: '',
        postponeTime: ''
      },
      showPostponeForm: false
    }
  },
  methods: {
    handleSubmit() {
      // Handle form submission logic here
    },
    handleImageUpload(event) {
      this.article.image = event.target.files[0]
    },
    togglePostponeForm() {
      this.showPostponeForm = !this.showPostponeForm
    },
    setPostponeDateTime() {
      // Perform any additional logic to handle the selected postpone date and time
      this.togglePostponeForm()
    }
  }
}
</script>

<style lang="scss">
.article-creation-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;

  background-color: #f0f0f0;
  background-image: linear-gradient(
      45deg,
      #eaeaea 25%,
      transparent 25%,
      transparent 75%,
      #eaeaea 75%,
      #eaeaea
    ),
    linear-gradient(45deg, #eaeaea 25%, transparent 25%, transparent 75%, #eaeaea 75%, #eaeaea);
  background-size: 20px 20px;

  h1 {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 30px;
    color: #333;
    text-align: center;
  }

  form {
    width: 800px; /* Updated width */
    padding: 30px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    font-weight: bold;
    color: #555;
    display: block;
    margin-bottom: 5px;
  }

  .form-input,
  .form-textarea,
  .form-select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f7f7f7;
    font-size: 14px;
    color: #333;
    transition: border-color 0.3s ease;
  }

  .form-input:focus,
  .form-textarea:focus,
  .form-select:focus {
    outline: none;
    border-color: #666;
  }

  .form-textarea {
    resize: vertical;
    min-height: 150px;
  }

  .btn-submit {
    padding: 12px 20px;
    background-color: #2979ff;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .btn-submit:hover {
    background-color: #0056b3;
  }

  .btn-postpone {
    padding: 12px 20px;
    background-color: #777;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 10px;
  }

  .btn-postpone:hover {
    background-color: #555;
  }

  .postpone-form {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f7f7f7;
  }

  .postpone-form h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .btn-cancel,
  .btn-confirm {
    padding: 8px 16px;
    font-size: 14px;
    margin-top: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-cancel {
    background-color: #777;
    color: #fff;
    margin-right: 10px;
  }

  .btn-confirm {
    background-color: #2979ff;
    color: #fff;
  }
}
</style>
