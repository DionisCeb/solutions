$(document).ready(function () {
  $(".menu-hamburguer").on("click", function () {
    $(this).toggleClass("active");
    $("nav").toggleClass("active");
    $(".header-actions").toggleClass("active");
  });
});
