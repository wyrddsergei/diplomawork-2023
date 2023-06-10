<template>
  <div>
    <div class="blog-block">
      <div v-if="articles" class="blog-block-grid">
        <ArticlePostPreview
          v-for="article in articles"
          :key="article._id"
          :id="article._id"
          :created_by="article.createdBy"
          :date="article.createdAt"
          :title="article.title"
          :cover_url="article.coverImage"
          :content="article.contents"
          :categories="article.categories"
        />
      </div>
      <div v-if="!articles">Nothing here :/</div>
      <div v-if="totalPages > 1" class="pagination">
        <button @click="previousPage" :disabled="currentPage === 1" class="pagination-button">
          <span class="arrow-left"></span>
        </button>
        <div class="page-buttons">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="goToPage(page)"
            :class="{ active: page === currentPage, 'pagination-button': true }"
          >
            {{ page }}
          </button>
        </div>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">
          <span class="arrow-right"></span>
        </button>
      </div>
    </div>
  </div>

  <FooterImage />
</template>

<style scoped>
.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-button {
  border: none;
  background-color: #7396d4;
  color: white;
  width: 40px;
  height: 40px;
  font-size: 14px;
  border-radius: 20px;
  margin: 0 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
}

.pagination-button:hover {
  background-color: #5c7fae;
}

.pagination-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination .active {
  background-color: #b2c8e5;
  color: white;
}

.page-buttons {
  display: flex;
}

.page-buttons button:not(:last-child) {
  margin-right: 6px;
}

.arrow-left:before {
  content: '';
  border-style: solid;
  border-width: 0.2em 0.2em 0 0;
  border-color: white;
  display: inline-block;
  width: 0.4em;
  height: 0.4em;
  transform: rotate(225deg);
  margin-right: 0.15em;
}

.arrow-right:before {
  content: '';
  border-style: solid;
  border-width: 0.2em 0.2em 0 0;
  border-color: white;
  display: inline-block;
  width: 0.4em;
  height: 0.4em;
  transform: rotate(45deg);
  margin-left: 0.15em;
}

.button-label {
  margin-left: 6px;
}
</style>

<script>
import { ref, watchEffect } from 'vue'
import ArticlePostPreview from '../components/ArticlePostPreview.vue'
import FooterImage from '../components/FooterImage.vue'

export default {
  components: { ArticlePostPreview, FooterImage },
  setup() {
    const currentPage = ref(1)
    const totalPages = ref(0)
    const limit = 8 // Number of posts per page
    const postsPerPage = ref(8) // Number of posts to display per page
    const displayedPages = ref([]) // Array to store the displayed page numbers
    const articles = ref([])

    const fetchPosts = () => {
      fetch(`http://localhost:4000/api/posts?page=${currentPage.value}&limit=${limit}`)
        .then((response) => response.json())
        .then((data) => {
          articles.value = data.posts
          totalPages.value = data.totalPages
          updateDisplayedPages()
        })
        .catch((error) => {
          console.error('Error fetching posts:', error)
        })
    }

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        fetchPosts()
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        fetchPosts()
      }
    }

    const goToPage = (page) => {
      if (page !== currentPage.value) {
        currentPage.value = page
        fetchPosts()
      }
    }

    const updateDisplayedPages = () => {
      const maxDisplayedPages = 5 // Maximum number of displayed pages

      if (totalPages.value <= maxDisplayedPages) {
        displayedPages.value = Array.from({ length: totalPages.value }, (_, index) => index + 1)
      } else {
        const halfMaxDisplayedPages = Math.floor(maxDisplayedPages / 2)
        let startPage = Math.max(1, currentPage.value - halfMaxDisplayedPages)
        let endPage = Math.min(totalPages.value, startPage + maxDisplayedPages - 1)

        if (endPage - startPage + 1 < maxDisplayedPages) {
          startPage = Math.max(1, endPage - maxDisplayedPages + 1)
        }

        displayedPages.value = Array.from(
          { length: endPage - startPage + 1 },
          (_, index) => startPage + index
        )
      }
    }

    watchEffect(() => {
      fetchPosts()
    })

    return {
      currentPage,
      totalPages,
      limit,
      postsPerPage,
      displayedPages,
      articles,
      previousPage,
      nextPage,
      goToPage
    }
  }
}
</script>
