const posts = [
  {
    owner: "Marie Kondo",
    username: "sparkjoy",
    location: "Tokyo, Japan",
    avatar: "images/avatar-marie.jpeg",
    post: "images/post-marie.jpg",
    caption:
      "Just thanked my 200th item before donating. Minimalism but make it ✨ wholesome ✨",
    likes: 215,
  },
  {
    owner: "Joshua Fields Millburn",
    username: "minimalistjosh",
    location: "Missoula, Montana",
    avatar: "images/avatar-joshua.jpeg",
    post: "images/post-joshua.jpeg",
    caption:
      "Sold my car, donated half my wardrobe. Catch me thriving in my tiny home 🏡",
    likes: 132,
  },
];

document.addEventListener("DOMContentLoaded", function () {
  const mainElement = document.querySelector("main");

  for (const post of posts) {
    // Create post container
    const newPost = document.createElement("article");
    newPost.className = "post";

    // ====== Post Header (Avatar & User Info) ======
    const newPostHeader = document.createElement("header");
    newPostHeader.className = "post__header";

    const newPostAvatar = document.createElement("img");
    newPostAvatar.className = "post__avatar";
    newPostAvatar.src = post.avatar;
    newPostAvatar.alt = `Avatar of ${post.owner}`;

    const newPostAuthorInfo = document.createElement("div");
    newPostAuthorInfo.className = "post__author-info";

    const postOwner = document.createElement("p");
    postOwner.className = "post__owner";
    postOwner.textContent = post.owner;

    const postLocation = document.createElement("p");
    postLocation.className = "post__location";
    postLocation.textContent = post.location;

    newPostAuthorInfo.append(postOwner, postLocation);
    newPostHeader.append(newPostAvatar, newPostAuthorInfo);
    newPost.append(newPostHeader);

    // ====== Post Image ======
    const postImage = document.createElement("img");
    postImage.className = "post__image";
    postImage.src = post.post;
    postImage.alt = `Post by ${post.owner}`;
    newPost.append(postImage);

    // ====== Post Details (Actions, Likes, Caption) ======
    const postDetails = document.createElement("div");
    postDetails.className = "post__details";

    // Actions (Like, Comment, Share)
    const postActions = document.createElement("div");
    postActions.className = "post__actions";

    const likeButton = createButton("images/icon-heart.png", "Like this post");
    const commentButton = createButton(
      "images/icon-comment.png",
      "Comment on this post"
    );
    const shareButton = createButton("images/icon-dm.png", "Share this post");

    postActions.append(likeButton, commentButton, shareButton);

    // Likes
    const postLikes = document.createElement("p");
    postLikes.className = "post__likes";
    postLikes.innerHTML = `<strong>${post.likes}</strong> likes`;

    // Caption
    const postCaption = document.createElement("p");
    postCaption.className = "post__caption";
    postCaption.innerHTML = `<span class="username">${post.username}</span> ${post.caption}`;

    // Append all details
    postDetails.append(postActions, postLikes, postCaption);
    newPost.append(postDetails);

    // Append full post to main
    mainElement.append(newPost);
  }
});

// ====== Helper Function: Create a Button ======
function createButton(iconSrc, altText) {
  const button = document.createElement("button");
  button.classList.add("btn");

  const icon = document.createElement("img");
  icon.classList.add("icon");
  icon.src = iconSrc;
  icon.alt = altText;

  button.appendChild(icon);
  return button;
}
