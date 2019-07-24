<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<div class="navbar">
    <div class="navbar-inner">
        <div class="left">
            <a href="#" data-panel="left" class="link open-panel icon-only"><img src="img/menu-icon.png" style="width: 35px;"></a>
        </div>
        <div class="center sliding">Home</div>
        <div class="right">
            <!-- <a href="#" data-panel="right" class="link open-panel icon-only panel-right-sort-filter" ><img src="img/search.png" style="width: 25px;"></a> -->
        </div>
    </div>
</div>
<div class="pages">
    <div data-page="about" class="page">
        <div class="page-content">
            <!-- <div class="content-block"> -->

                <!-- <div class = "swiper-container">
                   <div class = "swiper-wrapper">
                      <div class = "swiper-slide">Slide 1</div>
                      <div class = "swiper-slide">Slide 2</div>
                      <div class = "swiper-slide">Slide 3</div>
                   </div>
                   <div class = "swiper-pagination"></div>
                </div> -->
				
				

				<div class="w3-container">
				  <h2>Slideshow Caption</h2>
				  <p>Add a caption text for each image slide with the w3-display-* classes (topleft, topmiddle, topright, bottomleft, bottommiddle, bottomright or middle).</p>
				</div>

				<div class="w3-content w3-display-container">

				<div class="w3-display-container mySlides">
				  <img src="http://gema-petro.com/FOTO/3-REAL-1.png" style="width:100%">
				  <div class="w3-display-bottomleft w3-large w3-container w3-padding-16 w3-black">
					French Alps
				  </div>
				</div>

				<div class="w3-display-container mySlides">
				  <img src="http://gema-petro.com/FOTO/3-REAL-2.png" style="width:100%">
				  <div class="w3-display-bottomright w3-large w3-container w3-padding-16 w3-black">
					Northern Lights
				  </div>
				</div>

				<div class="w3-display-container mySlides">
				  <img src="http://gema-petro.com/FOTO/4-REAL-1.png" style="width:100%">
				  <div class="w3-display-topleft w3-large w3-container w3-padding-16 w3-black">
					Beautiful Mountains
				  </div>
				</div>

				<div class="w3-display-container mySlides">
				  <img src="http://gema-petro.com/FOTO/5-REAL-1.png" style="width:100%">
				  <div class="w3-display-topright w3-large w3-container w3-padding-16 w3-black">
					The Rain Forest
				  </div>
				</div>

				<button class="w3-button w3-display-left w3-black" onclick="plusDivs(-1)">&#10094;</button>
				<button class="w3-button w3-display-right w3-black" onclick="plusDivs(1)">&#10095;</button>

				</div>


				
				
                <div class="ks-slider-custom" style="height: 360px">
                    <div style = "height:350px;" data-pagination=".swiper-pagination" data-space-between="0" data-next-button=".swiper-button-next" data-prev-button=".swiper-button-prev" data-pagination-clickable="true" class="swiper-container swiper-init" id="slider_home">
                        <div class="swiper-pagination"></div>
                        <div class="swiper-wrapper" id="home_image_slider">
                            <!-- <script src="js/jquery-1.10.2.js"></script>
                            <div id="slider-0" style="background-image:url(http://gema-petro.com/FOTO/4-SMALL-1.png), url('img/noimage.jpg');" valign="bottom" class="card-header color-white no-border swiper-slide">vvvvv</div>
                            <div id="slider-1" style="background-image:url(http://gema-petro.com/FOTO/4-SMALL-1.png), url('img/noimage.jpg');" valign="bottom" class="card-header color-white no-border swiper-slide">vvvvv</div>
                            <div id="slider-2" style="background-image:url(http://gema-petro.com/FOTO/4-SMALL-1.png), url('img/noimage.jpg');" valign="bottom" class="card-header color-white no-border swiper-slide">vvvvv</div>
                            <div id="slider-3" style="background-image:url(http://gema-petro.com/FOTO/4-SMALL-1.png), url('img/noimage.jpg');" valign="bottom" class="card-header color-white no-border swiper-slide">aaaaaaaaaaaa</div>
                            <div id="slider-4" style="background-image:url(http://gema-petro.com/FOTO/4-SMALL-1.png), url('img/noimage.jpg');" valign="bottom" class="card-header color-white no-border swiper-slide">aaaaaaaaaaaa</div> -->
                        </div>
                        <!-- <div class="swiper-button-prev"></div> -->
                        <!-- <div class="swiper-button-next"></div> -->
                    </div>
                </div>

                <div id="video_list" style="display: none;">
                    <div class="content-block-title">Latest Video</div>
                    <div class="card demo-facebook-card" id="video_highlight">                        
                        <!-- <div class="card-content card-content-padding">
                            <video width="100%" src="http://www.w3schools.com/html/mov_bbb.mp4" controls>
                                <source src="movie.mp4" type="video/mp4">
                                <source src="movie.ogg" type="video/ogg">
                            </video>
                        </div>
                        <div class="card-footer"><a href="#" class="link" style="color: black; text-decoration: none; text-decoration-color: black;">What a nice photo i took yesterday!</a></div> -->
                    </div>
                </div>

                <div class="row" id="list_selected_edisi" style="margin-bottom: 50px;">
                    <span></span>
                </div>

                <!-- <div class="row" id="list_selected_edisi-2" style="margin-bottom: 50px;">                    
                    <span></span>
                </div> -->


            <div class="flooter">
              <div class="row">
                <div class="col-50 right"><a style="border-radius:0px;" id="BtnSort" onclick="OpenPanelSort()" data-panel="right" class="link open-panel icon-only panel-right-sort-filter button button-big button-fill color-green" ><img src = 'img/sort.png' width = '15px' height = '15px'> Sort</a></div>
                <div class="col-50 right"><a style="border-radius:0px;" id="BtnFilt" onclick="OpenPanelFilter()" data-panel="right" class="link open-panel icon-only panel-right-sort-filter button button-big button-fill color-green" ><img src = 'img/filter.png' width = '15px' height = '15px'> Filter</a></div>
              </div>
            </div>

            <!-- </div> -->
        </div>
    </div>
</div>
<script>
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "block";  
}
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}
</script>