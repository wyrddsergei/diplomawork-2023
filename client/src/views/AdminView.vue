<template>
  <div class="article-list-container">
    <a href="#">Home</a>
    <h1 id="list-name">Article List</h1>

    <div id="find-add-article">
      <input id="search-area" type="textarea" placeholder="Search Article" />
      <a id="add-article" href="#">Add New Article</a>
    </div>

    <div class="table-container">
      <table id="article-list">
        <thead class="has-shadow">
          <tr>
            <th class="article-checkbox"><input class="global-checkbox" type="checkbox" /></th>
            <th>IMAGE</th>
            <th>TITLE</th>
            <th>AUTHOR</th>
            <th>LAST MODIFIED</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 20" :key="i">
            <td class="article-checkbox"><input class="global-checkbox" type="checkbox" /></td>
            <td class="blog-image"></td>
            <td>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</td>
            <td>John Smith</td>
            <td>02/01/2023</td>
            <td>Published</td>
            <td class="action-btns">
              <a class="edit-btn" href="#">
                <img
                  src="https://cdn.icon-icons.com/icons2/2248/PNG/512/pencil_icon_135316.png"
                  alt="edit"
                />
              </a>
              <a class="delete-btn" href="#">
                <img
                  src="https://static-00.iconduck.com/assets.00/trash-icon-462x512-njvey5nf.png"
                  alt="edit"
              /></a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
