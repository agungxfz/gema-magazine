var myApp = new Framework7({
    modalTitle: 'Gema Petrokimia',
    tapHold: true,
    pushState: true,
});

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.addEventListener('backbutton', function(){
        function removeParam(key, sourceURL) {
            var rtn = sourceURL.split("?")[0],
                param,
                params_arr = [],
                queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
            if (queryString !== "") {
                params_arr = queryString.split("&");
                for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                    param = params_arr[i].split("=")[0];
                    if (param === key) {
                        params_arr.splice(i, 1);
                    }
                }
                rtn = rtn + "?" + params_arr.join("&");
            }
            return rtn;
        }
        var curpage = mainView.activePage.url;
        var curpage_convert = removeParam("edisi", curpage);
        if(curpage_convert=="home.html?"){
            myApp.confirm('Do you want to Exit?', 'Exit App',function () {
                navigator.app.clearHistory();
                navigator.app.exitApp();
            }); 
        }else if(curpage=="login.html" || curpage=="edisi.html" || curpage=="file:///android_asset/www/index.html") {
            navigator.app.clearHistory(); 
            navigator.app.exitApp();
        }else{
            mainView.router.back();
        }

        if (curpage_convert=="each-news.html") {
            $('#seacrhbarfitur').hide();
        } else {
            $('#seacrhbarfitur').show();
        }

        if (curpage_convert=="profile.html" || curpage_convert=="about.html") {
            navigator.app.clearHistory();
        }

        stop_video();

    });
}

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    pushState: true
});

var mySwiper = myApp.swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    slidesPerView: 'auto',
    paginationHide: false,
    paginationClickable: true,
    preloadImages: false,
    lazyLoading: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 0
});

var glb_sts_act = 0;

var eachSwiper = myApp.swiper('#each_slider', {
    preloadImages: false,
    lazyLoading: true,
    pagination: '#each_pagination'
});

var glb_username = '';
var selected_edisi = '';
var edisi_terbaru = '';
var selected_edisi_content;
var all_edition;
var glb_iduser = '';
var glb_edisi = '';
var mySwiper;

var mydate = new Date();
var tahun_now = mydate.getFullYear();
var bulan_now = mydate.getMonth();

var monthName = ["00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthNum = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

//Display Year in Select Option Edisi
$.getJSON("http://gema-petro.com/API.php", {page: 'cover'}, function (data) {   // rvc halaman awal after login page
    var arrayOfData = data.Berita;
    all_edition = arrayOfData;
    var optlistyear = '';
    var optlistmonth = '';
    for (var i = 0; i < arrayOfData.length; i++) {
        var year = arrayOfData[i].Year;
        // console.log(year);
        if (i == parseInt(arrayOfData.length) - 1) {
            optlistyear += '<option value="' + year + '" selected>' + year + '</option>';

            var listedisi =  arrayOfData[i].Edisi;    
            $.each( listedisi, function( key, value ) {
              selected_edisi = key;

              optlistmonth += '<option value="' + monthNum[parseInt(key)] + '">' + monthName[parseInt(key)] + '</option>';
            });

            selected_edisi_content =  listedisi[selected_edisi][0];
            edisi_terbaru =  selected_edisi;

            localStorage.setItem("edisimajalah", selected_edisi);
            
            document.getElementById('bulan_edisi').innerHTML = optlistmonth;

            document.getElementById('bulan_edisi').value = monthNum[parseInt(selected_edisi)];
            if (selected_edisi_content['Cover']) {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';
                    
                $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

            } else {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';

                $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
            }

            document.getElementById('list_edisi').innerHTML = content;

        } else {
            optlistyear += '<option value="' + year + '">' + year + '</option>';
        }  
    }

    document.getElementById('tahun_edisi').innerHTML = optlistyear;  

});

//Display When Tahun Edisi was Selected
$$('select[name="tahun_edisi"]').on('change', function (ev) {
    var tahun = ev.srcElement.value;
});

$$('.col-edisi').on('taphold', function () {
    myApp.alert('Tap hold fired!');
});

myApp.onPageInit('index-edisi', function (page) {   

    $('.navbar').hide();
    //Display Year in Select Option Edisi
    $.getJSON("http://gema-petro.com/API.php", {page: 'cover'}, function (data) {
        var arrayOfData = data.Berita;
        all_edition = arrayOfData;
        var optlistyear = '';
        var optlistmonth = '';

        $('.navbar').hide();

        for (var i = 0; i < arrayOfData.length; i++) {
            var year = arrayOfData[i].Year;
            // console.log(year);
            if (i == parseInt(arrayOfData.length) - 1) {
                optlistyear += '<option value="' + year + '" selected>' + year + '</option>';

                var listedisi =  arrayOfData[i].Edisi;    
                $.each( listedisi, function( key, value ) {
                  selected_edisi = key;
                  optlistmonth += '<option value="' + monthNum[parseInt(key)] + '">' + monthName[parseInt(key)] + '</option>';
                });

                selected_edisi_content =  listedisi[selected_edisi][0];
                
                document.getElementById('bulan_edisi').innerHTML = optlistmonth;

                document.getElementById('bulan_edisi').value = monthNum[parseInt(selected_edisi)];

                // if (selected_edisi_content['Cover']) {
                //     content = '<a class="link">' +
                //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="http://gema-petro.com/COVER/' + selected_edisi_content['Cover'] + '" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
                //         +'</a>';
                        
                //     $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

                // } else {
                //     content = '<a class="link">' +
                //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="img/nocover.jpg" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row" style="min-width: 150 px;"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
                //         +'</a>';

                //     $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
                // }

                if (selected_edisi_content['Cover']) {
                    content = '<a class="link">' +
                        '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                        +'</a>';
                        
                    $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

                } else {
                    content = '<a class="link">' +
                        '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                        +'</a>';

                    $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
                }

                document.getElementById('list_edisi').innerHTML = content;

            } else {
                optlistyear += '<option value="' + year + '">' + year + '</option>';
            }   

        }


        $('.navbar').hide();

        document.getElementById('tahun_edisi').innerHTML = optlistyear;

    });

    $$('#tahun_edisi').on('change', function () {
        var optlistmonth = '';
        for (var i = 0; i < all_edition.length; i++) {
            var year = all_edition[i].Year;
            // console.log(year);
            if (year == parseInt($$('#tahun_edisi').val())) {

                var listedisi =  all_edition[i].Edisi;    
                $.each( listedisi, function( key, value ) {
                  selected_edisi = key;

                  optlistmonth += '<option value="' + monthNum[parseInt(key)] + '">' + monthName[parseInt(key)] + '</option>';
                });

                selected_edisi_content =  listedisi[selected_edisi][0];
                
                document.getElementById('bulan_edisi').innerHTML = optlistmonth;

                document.getElementById('bulan_edisi').value = monthNum[parseInt(selected_edisi)];

                // if (selected_edisi_content['Cover']) {
                //     content = '<a class="link">' +
                //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="http://gema-petro.com/COVER/' + selected_edisi_content['Cover'] + '" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
                //         +'</a>';
                        
                //     $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

                // } else {
                //     content = '<a class="link">' +
                //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="img/nocover.jpg" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row" style="min-width: 150 px;"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
                //         +'</a>';

                //     $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
                // }

                if (selected_edisi_content['Cover']) {
                    content = '<a class="link">' +
                        '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                        +'</a>';
                        
                    $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

                } else {
                    content = '<a class="link">' +
                        '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                        +'</a>';

                    $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
                }
            

                document.getElementById('list_edisi').innerHTML = content;

            }
        }
    });

    $$('#bulan_edisi').on('change', function () {
        for (var i = 0; i < all_edition.length; i++) {
            var year = all_edition[i].Year;
            // console.log(year);
            if (year == parseInt($$('#tahun_edisi').val())) {

                selected_edisi = $$('#bulan_edisi').val();

                var listedisi =  all_edition[i].Edisi;    

                selected_edisi_content =  listedisi[selected_edisi+"-"+year][0];

                // if (selected_edisi_content['Cover']) {
                //     content = '<a class="link">' +
                //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="http://gema-petro.com/COVER/' + selected_edisi_content['Cover'] + '" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
                //         +'</a>';
                        
                //     $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

                // } else {
                //     content = '<a class="link">' +
                //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="img/nocover.jpg" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row" style="min-width: 150 px;"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
                //         +'</a>';

                //     $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
                // }

                if (selected_edisi_content['Cover']) {
                    content = '<a class="link">' +
                        '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi+"-"+year + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                        +'</a>';
                        
                    $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

                } else {
                    content = '<a class="link">' +
                        '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi+"-"+year + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                        +'</a>';

                    $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
                }
            

                document.getElementById('list_edisi').innerHTML = content;

                // console.log(content);

            }
        }
    });

});

//Sambutan
myApp.onPageInit('sambutan', function (page) {

    document.getElementById('kata-sambutan').innerHTML += '<a class="link" style="color: black;">' +
                    '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner" style = "margin-top:-40px;font-size:14px;"><h3 align = "center">'+selected_edisi_content['Judul']+'</h3><p class="color-gray"></p><p style="color: #fff;text-align: justify;">'+(selected_edisi_content['Sambutan']).replace("src=\"FOTO", "src=\"http://gema-petro.com/FOTO")+'</p><p class="color-gray"><div class="row"><a href="home.html?edisi=' + page.query.edisi + '" onclick="readarticle(\''+page.query.edisi+'\')" class="button button-small button-fill color-green" style="float: right;">Next</a></div></p></div></div></div>'
                    +'</a>';

    $("#homegae").attr("href", "home.html?edisi=" + page.query.edisi);
    // $("#searchbar-cancel").attr("href", "home.html?edisi=" + page.query.edisi);

});

//Edisi
myApp.onPageInit('edisi', function (page) {

    $('.navbar').hide();

    $.getJSON("http://gema-petro.com/API.php", {page: 'cover'}, function (data) {
        var arrayOfData = data.Berita;
        all_edition = arrayOfData;
        var optlistyear = '';
        var optlistmonth = '';

        $('.navbar').hide();

        for (var i = 0; i < arrayOfData.length; i++) {
            var year = arrayOfData[i].Year;
            // console.log(year);
            if (i == parseInt(arrayOfData.length) - 1) {
                optlistyear += '<option class="custom-select" value="' + year + '" selected>' + year + '</option>';

                var listedisi =  arrayOfData[i].Edisi;    
                $.each( listedisi, function( key, value ) {
                  selected_edisi = key;
                  optlistmonth += '<option value="' + monthNum[parseInt(key)] + '">' + monthName[parseInt(key)] + '</option>';
                });

                selected_edisi_content =  listedisi[selected_edisi][0];
                
                document.getElementById('pilih_bulan_edisi').innerHTML = optlistmonth;

                document.getElementById('pilih_bulan_edisi').value = monthNum[parseInt(selected_edisi)];

                // if (selected_edisi_content['Cover']) {
                //     content = '<a class="link">' +
                //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="http://gema-petro.com/COVER/' + selected_edisi_content['Cover'] + '" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
                //         +'</a>';
                        
                //     $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

                // } else {
                //     content = '<a class="link">' +
                //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="img/nocover.jpg" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row" style="min-width: 150 px;"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
                //         +'</a>';

                //     $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
                // }

                if (selected_edisi_content['Cover']) {
                    content = '<a class="link">' +
                        '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                        +'</a>';
                        
                    $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

                } else {
                    content = '<a class="link">' +
                        '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                        +'</a>';

                    $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
                }

                document.getElementById('pilih_list_edisi').innerHTML = content;

            } else {
                optlistyear += '<option value="' + year + '">' + year + '</option>';
            }   

        }

        $('.navbar').hide();

        document.getElementById('pilih_tahun_edisi').innerHTML = optlistyear;  

    });           
});

//Home Article List
myApp.onPageInit('search.html', function (page) {
    $('.navbar').show();
    $('#btn-search-art').hide();
    document.getElementById('listsearchart').innerHTML = '';

    $.getJSON("http://gema-petro.com/API.php", {page: 'SEARCHALL', where: ''}, function (data) {
        var arrayOfkategori = data.kategori;
        for (var k = 0; k < arrayOfkategori.length; k++) {

        }

        $('#btn-search-art').show();

        var arrayOfData = data.articles;
                var listarticle = '';
                var j = 0;
        for (var i = 0; i < arrayOfData.length; i++) {
            var id_berita = arrayOfData[i]["id_berita"];
            var desc = arrayOfData[i].description;
            var shortdesc = arrayOfData[i].short_desc;
            var title = arrayOfData[i].title;
            // var img = arrayOfData[i].gambar[0];
            var pub = arrayOfData[i].publishedAt;
            var like = arrayOfData[i].jum_like;
            var dislike = arrayOfData[i].jum_dislike;
            var comments_n = arrayOfData[i].jum_comment;
            var kategori = arrayOfData[i].kategori[0];

            

            var gambar = arrayOfData[i].gambar;
            // console.log(gambar);

            var gambarsource = '';

            if(gambar){
                gambarsource = gambar[0];
            }
            if (kategori[0] != 'Salam Redaksi') {
                if (j % 3 == 1 &&  j != parseInt(arrayOfData.length) - 1 ) {
                    listarticle += '<table width="100%"><tbody><td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:18;">'+ title +'</div></div>'
                                    +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                    +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                    '</p></div></div></div></a></td>';

                } else if (j % 3 == 2) {
                    listarticle += '<td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div>'
                                    +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                    +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                    '</p></div></div></div></a></td></tbody></table>';


                } else {
                    listarticle += '<a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic"><div style="background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div><div class="card-content"><div class="card-content-inner" style="color: black;"><p class="color-gray">Posted on ' 
                                    + pub + '</p><p style="color: #000000;text-align: justify;">' + shortdesc + ' ...</p>' 
                                    +'<p><span style="background-color:#006547;padding:5px 5px 5px 5px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +'</p></div></div></div></a>';
                
                }
                j++;
            }
            // console.log(listarticle);
        }

        document.getElementById('listsearchart').innerHTML += listarticle;

    });
});

//Home Article List
myApp.onPageInit('home.html', function (page) {
    $('#inputsearch').val('');
    $('#seacrhbarfitur').show();
    $('.navbar').show();
    $('#btn-search-art').hide();
    document.getElementById('listfilterkategori').innerHTML = '';
    document.getElementById('home_image_slider').innerHTML = '';

    var edisimajalah;
    if (page.query.edisi) {
        edisimajalah = page.query.edisi;
        localStorage.setItem("edisimajalah", edisimajalah);
    } else {
        edisimajalah = localStorage.edisimajalah;
    }


    // $("#searchbar-cancel").attr("href", "home.html?edisi=" + edisimajalah);

    // console.log(edisimajalah);

    $.getJSON("http://gema-petro.com/API.php", {page: 'berita', action: 'select', edisi: edisimajalah}, function (data) {
        var arrayOfkategori = data.kategori;
        for (var k = 0; k < arrayOfkategori.length; k++) {
            document.getElementById('listfilterkategori').innerHTML += '<li><label class="label-checkbox item-content"><input type="checkbox" name="listkategori[]" class="listKategori" value="'+arrayOfkategori[k].ID_KATEGORI+'">'
                                                                    +'<div class="item-media"><i class="icon icon-form-checkbox"></i></div><div class="item-inner"><div class="item-title">'+arrayOfkategori[k].KATEGORI+'</div></div></label></li>';
        }

        $('#btn-search-art').show();

        var arrayOfData = data.articles;
                var listarticle = '';
                var j = 0;
        for (var i = 0; i < arrayOfData.length; i++) {
            var id_berita = arrayOfData[i]["id_berita"];
            var desc = arrayOfData[i].description;
            var shortdesc = arrayOfData[i].short_desc;
            var title = arrayOfData[i].title;
            // var img = arrayOfData[i].gambar[0];
            var pub = arrayOfData[i].publishedAt;
            var like = arrayOfData[i].jum_like;
            var dislike = arrayOfData[i].jum_dislike;
            var comments_n = arrayOfData[i].jum_comment;
            var kategori = arrayOfData[i].kategori[0];

            

            var gambar = arrayOfData[i].gambar;
            // console.log(gambar);

            var gambarsource = '';

            if(gambar){
                gambarsource = gambar[0];
            }
            if (kategori[0] != 'Salam Redaksi') {
                if (j % 3 == 1 &&  j != parseInt(arrayOfData.length) - 1 ) {
                    listarticle += '<table width="100%"><tbody><td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:18;">'+ title +'</div></div>'
                                    +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                    +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                    '</p></div></div></div></a></td>';

                } else if (j % 3 == 2) {
                    listarticle += '<td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div>'
                                    +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                    +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                    '</p></div></div></div></a></td></tbody></table>';


                } else {
                    listarticle += '<a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic"><div style="background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div><div class="card-content"><div class="card-content-inner" style="color: black;"><p class="color-gray">Posted on ' 
                                    + pub + '</p><p style="color: #000000;text-align: justify;">' + shortdesc + ' ...</p>' 
                                    +'<p><span style="background-color:#006547;padding:5px 5px 5px 5px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +'</p></div></div></div></a>';
                
                }
                j++;
            }
            // console.log(listarticle);
        }

        document.getElementById('list_selected_edisi').innerHTML += listarticle;

        localStorage.setItem("listarticleinedisi", listarticle);

    });

    $.getJSON("http://gema-petro.com/API.php", {page: 'slider', edisi: edisimajalah}, function (data) {
        var arrayOfData = data["Slider Image"];
        var imageslider = '';

        if (arrayOfData["Image"]) {
            for (var i = 0; i < 5; i++) {
                if (arrayOfData["Image"][i]) {
                    var id_berita = arrayOfData["Image"][i]["id_berita"];
                    var berita = arrayOfData["Image"][i].berita;
                    var title = arrayOfData["Image"][i].judul;
                    var img = arrayOfData["Image"][i].urlToImage;
                    
                    imageslider += '<div onclick="detail_article(\''+id_berita+'\',\''+edisimajalah+'\')" id="slider-'+i+'" style="background-image:url('+img+'), url(\'img/noimage.jpg\');" valign="bottom" class="card-header color-white no-border swiper-slide"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:19px;">' + title + '</div></div>';
                    
                } else {

                }
                
            }

            document.getElementById('home_image_slider').innerHTML += imageslider;

            mySwiper = myApp.swiper('#slider_home', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
            });
        }        

        if (arrayOfData["Video"]) {
            for (var i = 0; i < arrayOfData["Video"].length; i++) {
                var id_berita = arrayOfData["Video"][i]["id_berita"];
                var berita = arrayOfData["Video"][i].berita;
                var title = arrayOfData["Video"][i].judul;
                var video = arrayOfData["Video"][i].urlToVideo;
                document.getElementById('video_highlight').innerHTML = '<div class="card-content card-content-padding">'+'<iframe id="articlevideo_player" style="min-height: 208px;" allowfullscreen="allowfullscreen" width="100%" src="'+ video +'modestbranding=1&amp;rel=1&amp;controls=0&amp"></iframe>'+'</div>'
                    +'<div class="card-footer"></div>';
            }

            if (arrayOfData["Video"].length > 0) {
                $('#video_list').show();
            } else {
                $('#video_list').hide();
            }
        } else {
            $('#video_list').hide();
        }
    });
});

myApp.onPageInit('each-news', function (page) { // rvc detail berita
    $('.navbar').show();
    stop_video();
    $('#seacrhbarfitur').hide();
    glb_sts_act = 0;
    $$.getJSON('http://gema-petro.com/API.php', {page: 'berita', action: 'select', where: page.query.id, edisi: page.query.edisi}, function (data) {
        var arrayOfData = data.articles
        var desc = arrayOfData[0].description;
        var id_berita = arrayOfData[0].id_berita;
        var title = arrayOfData[0].title;
        var img = arrayOfData[0].urlToImage;
        var pub = arrayOfData[0].publishedAt;
        var jum_like = arrayOfData[0].jum_like;
        var jum_dislike = arrayOfData[0].jum_dislike;
        var jum_comment = arrayOfData[0].jum_comment;
        var id_jenis = arrayOfData[0].id_jenis;

        var kategori = arrayOfData[0].kategori[0];
        var hashtaglist = arrayOfData[0].hashtag[0];
        var gambar = arrayOfData[0].gambar;
        var comment = arrayOfData[0].comment;

        var arr_comment = '';
        var arr_kategori = '';
        var arr_hashtag = '';
        var arr_gambar = '';

        if (id_jenis == 1) {
            $('#slider-each-image').show();
            $('#detail_video_highlight').hide();
            document.getElementById('detail_video_highlight').innerHTML = '';
        } else {
            $('#slider-each-image').hide();
            $('#detail_video_highlight').show();

            document.getElementById('detail_video_highlight').innerHTML = '<div class="card-content card-content-padding"><iframe id="articlevideo_player" style="min-height: 208px;" allowfullscreen="allowfullscreen" width="100%" src="'+ gambar +'modestbranding=1&amp;rel=1&amp;controls=0&amp"></iframe></div><div class="card-footer"></div>';
        }

        for (var a = 0; a < kategori.length; a++) {
            arr_kategori += '<div class="chip"><div class="chip-label">&nbsp;' + kategori[a] + '</div></div>&nbsp;';
        }

        for (var a = 0; a < hashtaglist.length; a++) {
            arr_hashtag += '<div class="chip"><div class="chip-label">&nbsp;' + hashtaglist[a] + '</div></div>&nbsp;';
            // console.log(arr_hashtag);
        }

        for (var a = 0; a < gambar.length; a++) {
            arr_gambar += '<div id="detail_slider-'+a+'" style="background-image:url('+ gambar[a] +'), url(\'img/noimage.jpg\');" valign="bottom" class="card-header color-white no-border swiper-slide"></div>';            
        }

        // console.log(arr_gambar);

        document.getElementById('detail_slider').innerHTML += arr_gambar;

        var mySwiper = myApp.swiper('#slider_detail', {
            pagination: '.swiper-pagination',
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
        });

        document.getElementById('tittle_article').innerHTML = kategori[0];

        for (var a = 0; a < comment.length; a++) {
            var a_comment = comment[a].split('~*~');
            if (parseInt(a_comment[0]) == 1) {
                arr_comment += '<div class="message message-received message-with-avatar"><div class="message-name">'+a_comment[1]+'</div><div class="message-text" style="text-align:justify; font-size: 12px;width: 275px; ">'+a_comment[2]+'</div><div style="background-image:url(img/logo_mini.png);" class="message-avatar"></div></div>';
            } else {
                arr_comment += '<div class="message message-received message-with-avatar"><div class="message-name">'+a_comment[1]+'</div><div class="message-text" style="text-align:justify; font-size: 12px;width: 275px; ">'+a_comment[2]+'</div><div style="background-image:url(img/man.png);" class="message-avatar"></div></div>';
            }
        }

        document.getElementById('detailed_articles').innerHTML += '<div class="card ks-card-header-pic spacer">' +
                '<div class="card-content">' +
                '<div class="card-content-inner">' +
                '<h2>' +title+ '</h2>' +
                '<p class="color-gray">Posted on ' + pub + '</p>' +
                '<p style="text-align: justify;">' + desc + '</p>' +
                '<div class="content-block"><div class="content-block-title">Hashtag :</div><div class="content-block-inner">' + arr_hashtag + '</div></div>' +
                '</div>' +
                '</div>' +
                '<div class="card-footer"><div class="row no-gutter" id="act-like-dislike" style="width=100%"><div class="col-30" style="border: none;"><a href="#" style="border: none;" id="btn_article_like" class="button link"><i id="like-'+page.query.id+'" class="fa fa-thumbs-o-up size-50 color-gray"></i><span id="count-like">' + jum_like + '</span></a></div><div class="col-30" style="border: none;"><a href="#" style="border: none;" id="btn_article_dislike" class="button link"><i id="dislike-'+page.query.id+'" class="fa fa-thumbs-o-down size-50 color-gray"></i><span id="count-dislike">' + jum_dislike + '</span></a></div><div class="col-30" style="border: none;"><a style="border: none;" class="button link"><i id="comment-'+page.query.id+'" class="fa fa-comment-o size-50 color-gray" ></i><span id="count-comment">' + jum_comment + '</span></a></div></div></div>' +
                '<div class="content-block" style="padding-bottom: 15px;"><div class="messages-content"><div class="messages" id="comment-listdata" style="border: none;">' + arr_comment + '</div></div></div>';


        var datauser = JSON.parse(localStorage.userdata);
        glb_iduser = datauser.id_user;   
             
        $.getJSON("http://gema-petro.com/API.php", {page: 'sts_like', idb: page.query.id, ids: glb_iduser}, function (data) {
            // console.log(data);
            if (parseInt(data.STATUS) == 1) {
                glb_sts_act = 1;
                $('#like-'+page.query.id).removeClass('color-gray');
            } else if (parseInt(data.STATUS) == 2) {
                glb_sts_act = 2;
                $('#dislike-'+page.query.id).removeClass('color-gray');
            } else {
                glb_sts_act = 0;
            }
            // console.log(glb_sts_act);
        });

        $$('#btn_article_like').on('click', function () {
            var datauser = JSON.parse(localStorage.userdata);
            glb_iduser = datauser.id_user;
            // console.log(glb_sts_act);
            if (glb_sts_act != 1) {
                $$.post('http://gema-petro.com/API.php', {page: 'like', action: 'input_like', id_berita: id_berita, id_user: glb_iduser}, function (respon) {
                    var datax = JSON.parse(respon);
                    refreshdetail(page.query.id, page.query.edisi, 'like-dislike');
                });
            }
            
        });

        $$('#btn_article_dislike').on('click', function () {
            var datauser = JSON.parse(localStorage.userdata);
            glb_iduser = datauser.id_user;
            // console.log(glb_sts_act);
            if (glb_sts_act != 2) {
                $$.post('http://gema-petro.com/API.php', {page: 'like', action: 'input_dislike', id_berita: id_berita, id_user: glb_iduser}, function (respon) {
                    var datax = JSON.parse(respon);
                    refreshdetail(page.query.id, page.query.edisi, 'like-dislike');
                });
            }
            
        });

        $$('#btn_article_comment').on('click', function () {    // rvc aksi comments
            var datauser = JSON.parse(localStorage.userdata);
            glb_iduser = datauser.id_user;
            var nik_user = datauser.nik;
            var nama_user = datauser.nama;
            var comments = $$('#txt_comment').val();
            if (comments && comments != '') {
                $$.post('http://gema-petro.com/API.php', {page: 'comments', action: 'input', id_berita: id_berita, id_user: nik_user, comments: comments, nama: nama_user}, function (respon) {
                    var datax = JSON.parse(respon);
                    // refreshdetail(page.query.id, page.query.edisi, 'comment');
                    if (parseInt(datax['status']) != 0 && datax['content'] == "Comment Berhasil") {
                        refreshdetail(page.query.id, page.query.edisi, 'comment');
                    }
                });
            }
           
        });
    });
});

function refreshdetail(idberita, edisi, action) {
    // body...

    glb_sts_act = 0;

    $.getJSON('http://gema-petro.com/API.php', {page: 'berita', action: 'select', where: idberita, edisi: edisi}, function (data) {
        var arrayOfData = data.articles
        var desc = arrayOfData[0].description;
        var id_berita = arrayOfData[0].id_berita;
        var title = arrayOfData[0].title;
        var img = arrayOfData[0].urlToImage;
        var pub = arrayOfData[0].publishedAt;
        var jum_like = arrayOfData[0].jum_like;
        var jum_dislike = arrayOfData[0].jum_dislike;
        var jum_comment = arrayOfData[0].jum_comment;
        var id_jenis = arrayOfData[0].id_jenis;

        var kategori = arrayOfData[0].kategori[0];
        var hashtaglist = arrayOfData[0].hashtag[0];
        var gambar = arrayOfData[0].gambar;
        var comment = arrayOfData[0].comment;

        var arr_comment = '';
        var arr_kategori = '';
        var arr_hashtag = '';
        var arr_gambar = '';

        if (parseInt(comment.length) > 0) {
            console.log(comment);
            console.log(comment[comment.length - 1]);
            var a_comment = comment[comment.length - 1].split('~*~');
            console.log(a_comment);
            // if (parseInt(a_comment[0]) == 1) {
            //     arr_comment += '<div class="message message-received message-with-avatar"><div class="message-name">'+a_comment[1]+'</div><div class="message-text" style="text-align:justify; font-size: 12px;width: 275px; ">'+a_comment[2]+'</div><div style="background-image:url(img/logo_mini.png);" class="message-avatar"></div></div>';
            // } else {
            //     arr_comment += '<div class="message message-received message-with-avatar"><div class="message-name">'+a_comment[1]+'</div><div class="message-text" style="text-align:justify; font-size: 12px;width: 275px; ">'+a_comment[2]+'</div><div style="background-image:url(img/man.png);" class="message-avatar"></div></div>';
            // }
            arr_comment += '<div class="message message-received message-with-avatar"><div class="message-name">'+a_comment[1]+'</div><div class="message-text" style="text-align:justify; font-size: 12px;width: 275px; ">'+a_comment[2]+'</div><div style="background-image:url(img/man.png);" class="message-avatar"></div></div>';

        }

        if (action == 'comment') {
            document.getElementById('comment-listdata').innerHTML += arr_comment;
            document.getElementById('txt_comment').value = '';
        } else {
            document.getElementById('count-like').innerHTML = jum_like;
            document.getElementById('count-dislike').innerHTML = jum_dislike;
            document.getElementById('count-comment').innerHTML = jum_comment;
        }

        var datauser = JSON.parse(localStorage.userdata);
        glb_iduser = datauser.id_user;   
             
        $.getJSON("http://gema-petro.com/API.php", {page: 'sts_like', idb: idberita, ids: glb_iduser}, function (data) {
            // console.log(data);
            if (parseInt(data.STATUS) == 1) {
                glb_sts_act = 1;
                $('#like-'+idberita).removeClass('color-gray');
                $('#dislike-'+idberita).addClass('color-gray');
            } else if (parseInt(data.STATUS) == 2) {
                glb_sts_act = 2;
                $('#like-'+idberita).addClass('color-gray');
                $('#dislike-'+idberita).removeClass('color-gray');
            } else {
                glb_sts_act = 0;
            }
            // console.log(glb_sts_act);
        });

    });
}

//Profile Page
$$('#gotohomearticle').on('click', function () {        // rvc halaman home

    $('#inputsearch').val('');

    setTimeout(function () {
        var edisimajalah;

        stop_video();

        document.getElementById('listfilterkategori').innerHTML = '';
        document.getElementById('home_image_slider').innerHTML = '';
        $('#list_selected_edisi').html('');

        edisimajalah = localStorage.edisimajalah;
        // console.log(localStorage.edisimajalah);
        // console.log(edisimajalah);        

        $.getJSON("http://gema-petro.com/API.php", {page: 'berita', action: 'select', edisi: edisimajalah}, function (data) {

            var arrayOfkategori = data.kategori;
            for (var k = 0; k < arrayOfkategori.length; k++) {
                document.getElementById('listfilterkategori').innerHTML += '<li><label class="label-checkbox item-content"><input type="checkbox" name="listkategori[]" class="listKategori" value="'+arrayOfkategori[k].ID_KATEGORI+'">'
                                                                        +'<div class="item-media"><i class="icon icon-form-checkbox"></i></div><div class="item-inner"><div class="item-title">'+arrayOfkategori[k].KATEGORI+'</div></div></label></li>';
            }

            var arrayOfData = data.articles;
                var listarticle = '';
                var j = 0;
            for (var i = 0; i < arrayOfData.length; i++) {
                var id_berita = arrayOfData[i]["id_berita"];
                var desc = arrayOfData[i].description;
                var shortdesc = arrayOfData[i].short_desc;
                var title = arrayOfData[i].title;
                var img = arrayOfData[i].gambar;
                var pub = arrayOfData[i].publishedAt;
                var like = arrayOfData[i].jum_like;
                var dislike = arrayOfData[i].jum_dislike;
                var comments_n = arrayOfData[i].jum_comment;
                var kategori = arrayOfData[i].kategori[0];

                var gambar = arrayOfData[i].gambar;
                var gambarsource = '';

                if(gambar){
                    gambarsource = gambar[0];
                }

                if (kategori) {
                    if (kategori[0] != 'Salam Redaksi') {
                        if (j % 3 == 1 &&  j != parseInt(arrayOfData.length) - 1 ) {
                            listarticle += '<table width="100%"><tbody><td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:18;">'+ title +'</div></div>'
                                            +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                            +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                            '</p></div></div></div></a></td>';

                        } else if (j % 3 == 2) {
                            listarticle += '<td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div>'
                                            +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                            +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                            '</p></div></div></div></a></td></tbody></table>';


                        } else {
                            listarticle += '<a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic"><div style="background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div><div class="card-content"><div class="card-content-inner" style="color: black;"><p class="color-gray">Posted on ' 
                                            + pub + '</p><p style="color: #000000;text-align: justify;">' + shortdesc + ' ...</p>' 
                                            +'<p><span style="background-color:#006547;padding:5px 5px 5px 5px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +'</p></div></div></div></a>';
                        
                        }
                        j++;
                    }
                }
            }

            document.getElementById('list_selected_edisi').innerHTML += listarticle;

            localStorage.setItem("listarticleinedisi", listarticle);

            console.log(listarticle);

        });

        var imageslider = '';

        var videoslider = '';

        $.getJSON("http://gema-petro.com/API.php", {page: 'slider', edisi: edisimajalah}, function (data) {
            var arrayOfData = data["Slider Image"];
            var imageslider = "";
            if (arrayOfData["Image"]) {
                for (var i = 0; i < 5; i++) {
                    if (arrayOfData["Image"][i]) {
                        var id_berita = arrayOfData["Image"][i]["id_berita"];
                        var berita = arrayOfData["Image"][i].berita;
                        var title = arrayOfData["Image"][i].judul;
                        var img = arrayOfData["Image"][i].urlToImage;

                        imageslider += '<div onclick="detail_article(\''+id_berita+'\',\''+edisimajalah+'\')" id="slider-'+i+'" style="background-image:url('+img+'), url(\'img/noimage.jpg\');" valign="bottom" class="card-header color-white no-border swiper-slide"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:19px;">' + title + '</div></div>';
                        
                    } else {

                    }
                    
                }

                document.getElementById('home_image_slider').innerHTML += imageslider;

                mySwiper = myApp.swiper('#slider_home', {
                    pagination: '.swiper-pagination',
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                });                
            }

            if (arrayOfData["Video"]) {
                for (var i = 0; i < arrayOfData["Video"].length; i++) {
                    var id_berita = arrayOfData["Video"][i]["id_berita"];
                    var berita = arrayOfData["Video"][i].berita;
                    var title = arrayOfData["Video"][i].judul;
                    var video = arrayOfData["Video"][i].urlToVideo;
                    document.getElementById('video_highlight').innerHTML = '<div class="card-content card-content-padding">'+'<iframe id="articlevideo_player" style="min-height: 208px;" allowfullscreen="allowfullscreen" width="100%" src="'+ video +'modestbranding=1&amp;rel=1&amp;controls=0&amp"></iframe>'+'</div>'
                        +'<div class="card-footer"></div>';
                }

                if (arrayOfData["Video"].length > 0) {
                    $('#video_list').show();
                } else {
                    $('#video_list').hide();
                }
            } else {
                $('#video_list').hide();
            }
        });
    }, 10);    
});

function shownavbar() {
    // body...
    setTimeout(function () {
        stop_video();
        $('.navbar').show();
        $('#seacrhbarfitur').show();
    }, 700);    
}

$$('#backtohome').on('click', function () {     // rvc halaman home
    $('.navbar').show();
    $('#seacrhbarfitur').show();
    setTimeout(function () {
        var edisimajalah;

        $('#btn-search-art').hide();
        document.getElementById('listfilterkategori').innerHTML = '';
        document.getElementById('home_image_slider').innerHTML = '';

        edisimajalah = localStorage.edisimajalah;
        // console.log(localStorage.edisimajalah);
        // console.log(edisimajalah);        

        $.getJSON("http://gema-petro.com/API.php", {page: 'berita', action: 'select', edisi: edisimajalah}, function (data) {

            var arrayOfkategori = data.kategori;
            for (var k = 0; k < arrayOfkategori.length; k++) {
                document.getElementById('listfilterkategori').innerHTML += '<li><label class="label-checkbox item-content"><input type="checkbox" name="listkategori[]" class="listKategori" value="'+arrayOfkategori[k].ID_KATEGORI+'">'
                                                                        +'<div class="item-media"><i class="icon icon-form-checkbox"></i></div><div class="item-inner"><div class="item-title">'+arrayOfkategori[k].KATEGORI+'</div></div></label></li>';
            }

            $('#btn-search-art').show();

            var arrayOfData = data.articles;
                var listarticle = '';
                var j = 0;
            for (var i = 0; i < arrayOfData.length; i++) {
                var id_berita = arrayOfData[i]["id_berita"];
                var desc = arrayOfData[i].description;
                var shortdesc = arrayOfData[i].short_desc;
                var title = arrayOfData[i].title;
                var img = arrayOfData[i].gambar;
                var pub = arrayOfData[i].publishedAt;
                var like = arrayOfData[i].jum_like;
                var dislike = arrayOfData[i].jum_dislike;
                var comments_n = arrayOfData[i].jum_comment;
                var kategori = arrayOfData[i].kategori[0];

                var gambar = arrayOfData[i].gambar;
                var gambarsource = '';

                if(gambar){
                    gambarsource = gambar[0];
                }

                if (kategori) {
                    if (kategori[0] != 'Salam Redaksi') {
                        if (j % 3 == 1 &&  j != parseInt(arrayOfData.length) - 1 ) {
                            listarticle += '<table width="100%"><tbody><td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:18;">'+ title +'</div></div>'
                                            +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                            +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                            '</p></div></div></div></a></td>';

                        } else if (j % 3 == 2) {
                            listarticle += '<td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div>'
                                            +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                            +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                            '</p></div></div></div></a></td></tbody></table>';


                        } else {
                            listarticle += '<a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic"><div style="background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div><div class="card-content"><div class="card-content-inner" style="color: black;"><p class="color-gray">Posted on ' 
                                            + pub + '</p><p style="color: #000000;text-align: justify;">' + shortdesc + ' ...</p>' 
                                            +'<p><span style="background-color:#006547;padding:5px 5px 5px 5px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +'</p></div></div></div></a>';
                        
                        }
                        j++;
                    }
                }
            }

            document.getElementById('list_selected_edisi').innerHTML += listarticle;

            localStorage.setItem("listarticleinedisi", listarticle);
        });

        var imageslider = '';

        var videoslider = '';

        $.getJSON("http://gema-petro.com/API.php", {page: 'slider', edisi: edisimajalah}, function (data) {
            var arrayOfData = data["Slider Image"];
            var imageslider = "";
            if (arrayOfData["Image"]) {                
                for (var i = 0; i < 5; i++) {
                    if (arrayOfData["Image"][i]) {
                        var id_berita = arrayOfData["Image"][i]["id_berita"];
                        var berita = arrayOfData["Image"][i].berita;
                        var title = arrayOfData["Image"][i].judul;
                        var img = arrayOfData["Image"][i].urlToImage;
                        
                        imageslider += '<div onclick="detail_article(\''+id_berita+'\',\''+edisimajalah+'\')" id="slider-'+i+'" style="background-image:url('+img+'), url(\'img/noimage.jpg\');" valign="bottom" class="card-header color-white no-border swiper-slide"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:19px;">' + title + '</div></div>';
                        
                    } else {

                    }
                    
                }

                document.getElementById('home_image_slider').innerHTML += imageslider;

                mySwiper = myApp.swiper('#slider_home', {
                    pagination: '.swiper-pagination',
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                });
            }

            if (arrayOfData["Video"]) {
                for (var i = 0; i < arrayOfData["Video"].length; i++) {
                    var id_berita = arrayOfData["Video"][i]["id_berita"];
                    var berita = arrayOfData["Video"][i].berita;
                    var title = arrayOfData["Video"][i].judul;
                    var video = arrayOfData["Video"][i].urlToVideo;
                    document.getElementById('video_highlight').innerHTML = '<div class="card-content card-content-padding">'+'<iframe id="articlevideo_player" style="min-height: 208px;" allowfullscreen="allowfullscreen" width="100%" src="'+ video +'modestbranding=1&amp;rel=1&amp;controls=0&amp"></iframe>'+'</div>'
                        +'<div class="card-footer"></div>';
                }

                if (arrayOfData["Video"].length > 0) {
                    $('#video_list').show();
                } else {
                    $('#video_list').hide();
                }
            } else {
                $('#video_list').hide();
            }
        });
    }, 500);    
});

//About Page
$$('#newest').on('click', function () {
    var edisimajalah;

    edisimajalah = localStorage.edisimajalah;
    // console.log(localStorage.edisimajalah);
    // console.log(edisimajalah);        

    $.getJSON("http://gema-petro.com/API.php", {page: 'berita', action: 'select', edisi: edisimajalah}, function (data) {
        var arrayOfData = data.articles;
            var listarticle = '';
            var j = 0;
        for (var i = 0; i < arrayOfData.length; i++) {
            var id_berita = arrayOfData[i]["id_berita"];
            var desc = arrayOfData[i].description;
            var shortdesc = arrayOfData[i].short_desc;
            var title = arrayOfData[i].title;
            var img = arrayOfData[i].gambar;
            var pub = arrayOfData[i].publishedAt;
            var like = arrayOfData[i].jum_like;
            var dislike = arrayOfData[i].jum_dislike;
            var comments_n = arrayOfData[i].jum_comment;
            var kategori = arrayOfData[i].kategori[0];

            var gambar = arrayOfData[i].gambar;
            var gambarsource = '';

            if(gambar){
                gambarsource = gambar[0];
            }
            if (kategori) {
                if (kategori[0] != 'Salam Redaksi') {
                    if (j % 3 == 1 &&  j != parseInt(arrayOfData.length) - 1 ) {
                        listarticle += '<table width="100%"><tbody><td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:18;">'+ title +'</div></div>'
                                        +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                        +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                        '</p></div></div></div></a></td>';

                    } else if (j % 3 == 2) {
                        listarticle += '<td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div>'
                                        +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                        +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                        '</p></div></div></div></a></td></tbody></table>';


                    } else {
                        listarticle += '<a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic"><div style="background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div><div class="card-content"><div class="card-content-inner" style="color: black;"><p class="color-gray">Posted on ' 
                                        + pub + '</p><p style="color: #000000;text-align: justify;">' + shortdesc + ' ...</p>' 
                                        +'<p><span style="background-color:#006547;padding:5px 5px 5px 5px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +'</p></div></div></div></a>';
                    
                    }
                    j++;
                }
            }
        }

        document.getElementById('list_selected_edisi').innerHTML = listarticle;


        localStorage.setItem("listarticleinedisi", listarticle);

    });
});

//About Page
$$('#popular').on('click', function () { 

    $('#inputsearch').val('');
    $('#seacrhbarfitur').show();

    var edisimajalah;

    edisimajalah = localStorage.edisimajalah;
    // console.log(localStorage.edisimajalah);
    // console.log(edisimajalah);        

    $.getJSON("http://gema-petro.com/API.php", {page: 'popular' , edisi: edisimajalah}, function (data) {
        var arrayOfData = data.articles;
            var listarticle = '';
            var j = 0;
        for (var i = 0; i < arrayOfData.length; i++) {
            var id_berita = arrayOfData[i]["id_berita"];
            var desc = arrayOfData[i].description;
            var shortdesc = arrayOfData[i].short_desc;
            var title = arrayOfData[i].title;
            var img = arrayOfData[i].gambar;
            var pub = arrayOfData[i].publishedAt;
            var like = arrayOfData[i].jum_like;
            var dislike = arrayOfData[i].jum_dislike;
            var comments_n = arrayOfData[i].jum_comment;
            var kategori = arrayOfData[i].kategori[0];

            var gambar = arrayOfData[i].gambar;
            var gambarsource = '';

            if(gambar){
                gambarsource = gambar[0];
            }
            if (kategori) {
                if (kategori[0] != 'Salam Redaksi') {
                    if (j % 3 == 1 &&  j != parseInt(arrayOfData.length) - 1 ) {
                        listarticle += '<table width="100%"><tbody><td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:18;">'+ title +'</div></div>'
                                        +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                        +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                        '</p></div></div></div></a></td>';

                    } else if (j % 3 == 2) {
                        listarticle += '<td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div>'
                                        +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                        +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                        '</p></div></div></div></a></td></tbody></table>';


                    } else {
                        listarticle += '<a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic"><div style="background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div><div class="card-content"><div class="card-content-inner" style="color: black;"><p class="color-gray">Posted on ' 
                                        + pub + '</p><p style="color: #000000;text-align: justify;">' + shortdesc + ' ...</p>' 
                                        +'<p><span style="background-color:#006547;padding:5px 5px 5px 5px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +'</p></div></div></div></a>';
                    
                    }
                    j++;
                }
            }
        }

        document.getElementById('list_selected_edisi').innerHTML = listarticle;

        localStorage.setItem("listarticleinedisi", listarticle);

    });
});

//About Page
$$('#visited').on('click', function () {        // rvc Most Viewed
    var edisimajalah;

    $('#inputsearch').val('');
    $('#seacrhbarfitur').show();
    edisimajalah = localStorage.edisimajalah;
    // console.log(localStorage.edisimajalah);
    // console.log(edisimajalah);        

    $.getJSON("http://gema-petro.com/API.php", {page: 'visited' , edisi: edisimajalah}, function (data) {
        var arrayOfData = data.articles;
            var listarticle = '';
            var j = 0;
        for (var i = 0; i < arrayOfData.length; i++) {
            var id_berita = arrayOfData[i]["id_berita"];
            var desc = arrayOfData[i].description;
            var shortdesc = arrayOfData[i].short_desc;
            var title = arrayOfData[i].title;
            var img = arrayOfData[i].gambar;
            var pub = arrayOfData[i].publishedAt;
            var like = arrayOfData[i].jum_like;
            var dislike = arrayOfData[i].jum_dislike;
            var comments_n = arrayOfData[i].jum_comment;
            var kategori = arrayOfData[i].kategori[0];

            var gambar = arrayOfData[i].gambar;
            var gambarsource = '';

            if(gambar){
                gambarsource = gambar[0];
            }
            if (kategori) {
                if (kategori[0] != 'Salam Redaksi') {
                    if (j % 3 == 1 &&  j != parseInt(arrayOfData.length) - 1 ) {
                        listarticle += '<table width="100%"><tbody><td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:18;">'+ title +'</div></div>'
                                        +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                        +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                        '</p></div></div></div></a></td>';

                    } else if (j % 3 == 2) {
                        listarticle += '<td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div>'
                                        +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                        +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                        '</p></div></div></div></a></td></tbody></table>';


                    } else {
                        listarticle += '<a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic"><div style="background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div><div class="card-content"><div class="card-content-inner" style="color: black;"><p class="color-gray">Posted on ' 
                                        + pub + '</p><p style="color: #000000;text-align: justify;">' + shortdesc + ' ...</p>' 
                                        +'<p><span style="background-color:#006547;padding:5px 5px 5px 5px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +'</p></div></div></div></a>';
                    
                    }
                    j++;
                }
            }
        }

        document.getElementById('list_selected_edisi').innerHTML = listarticle;

        localStorage.setItem("listarticleinedisi", listarticle);

    });
});

function changepass() {
    // body...
    var username = JSON.parse(localStorage.userdata);
    var userpass = localStorage.userpassword;
    var curr = $$('#curr_pass').val();
    var newp = $$('#new_pass').val();
    var retype = $$('#retype_pass').val();
    // console.log(userpass);
    // console.log(curr);
    // console.log(newp);
    // console.log(retype);
    // console.log(username.username);

    if (curr != '' && userpass == curr) {
        if (newp != '' && retype != '' && newp == retype) {

            $$.post('http://gema-petro.com/API.php', {page: 'change', username: username.username, current: curr, new: newp, renew: retype}, function (respon) {
                myApp.alert(respon, function () {
                    $('#curr_pass').val('');
                    $('#new_pass').val('');
                    $('#retype_pass').val('');
                });
            });
        } else {
            $('#retype_pass').val('');
            $('#retype_pass').focus();
            myApp.alert('Wrong Confirmation', function () {
                $('#retype_pass').val('');
                $('#retype_pass').focus();
            });
        }
    } else {
        $('#curr_pass').val('');
        $('#curr_pass').focus();
        myApp.alert('Wrong Password', function () {
            $('#curr_pass').val('');
            $('#curr_pass').focus();
        });
    }
}

$$('#btn-search-art').on('click', function () { // rvc Search by kategori
    var edisimajalah;
    edisimajalah = localStorage.edisimajalah;

    $('#inputsearch').val('');
    $('#seacrhbarfitur').show();
    var arrJenis = new Array();
    var arrKategori = new Array();
    var jenis = document.getElementsByName("listjenis[]");
    // console.log(jenis);
    for (var i=0; i < jenis.length; i++) {
        if (jenis[i].checked == true) {
            arrJenis.push(jenis[i].value);
        }
        
    }
    // console.log(arrJenis.toString());
    var kategori = document.getElementsByName("listkategori[]");
    // console.log(kategori);
    for (var i=0; i < kategori.length; i++) {
        if (kategori[i].checked == true) {
            arrKategori.push(kategori[i].value);
        }
        
    }
    // console.log(arrKategori.toString());
    var hashtag = $('#selected_hashtag').val();
    // console.log(hashtag);

    document.getElementById('list_selected_edisi').innerHTML = '';

    $$.post('http://gema-petro.com/API.php', {page: 'search', edisi: edisimajalah, jenis: arrJenis.toString(), kategori: arrKategori.toString(), hashtag: hashtag}, function (respon) {
        var data = JSON.parse(respon);
        var arrayOfData = data.article;
            var listarticle = '';
            var j = 0;
        for (var i = 0; i < arrayOfData.length; i++) {
            var id_berita = arrayOfData[i]["id_berita"];
            var desc = arrayOfData[i].description;
            var shortdesc = arrayOfData[i].short_desc;
            var title = arrayOfData[i].title;
            var img = arrayOfData[i].gambar;
            var pub = arrayOfData[i].publishedAt;
            var like = arrayOfData[i].jum_like;
            var dislike = arrayOfData[i].jum_dislike;
            var comments_n = arrayOfData[i].jum_comment;
            var kategori = arrayOfData[i].kategori[0];

            var gambar = arrayOfData[i].gambar;
            var gambarsource = '';

            if(gambar){
                gambarsource = gambar[0];
            }
            if (kategori) {
                if (kategori[0] != 'Salam Redaksi') {
                    if (j % 3 == 1 &&  j != parseInt(arrayOfData.length) - 1 ) {
                        listarticle += '<table width="100%"><tbody><td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%;">'+ title +'</div></div>'
                                        +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                        +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                        '</p></div></div></div></a></td>';

                    } else if (j % 3 == 2) {
                        listarticle += '<td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%;">'+ title +'</div></div>'
                                        +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                        +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                        '</p></div></div></div></a></td></tbody></table>';


                    } else {
                        listarticle += '<a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic"><div style="background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%;">'+ title +'</div></div><div class="card-content"><div class="card-content-inner" style="color: black;"><p class="color-gray">Posted on ' 
                                        + pub + '</p><p style="color: #000000;text-align: justify;">' + shortdesc + ' ...</p>' 
                                        +'<p><span style="background-color:#006547;padding:5px 5px 5px 5px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +'</p></div></div></div></a>';
                    
                    }
                    j++;
                }
            }
        }

        document.getElementById('list_selected_edisi').innerHTML = listarticle;
    });
});

$$('.back').on('click', function () {
    $('.navbar').show();
    $('#seacrhbarfitur').show();
});

//About Page
$$('#getprofileuser').on('click', function () {

    $('#seacrhbarfitur').hide();

    setTimeout(function () {
        stop_video();
        $('#inputsearch').hide();
        $('#seacrhbarfitur').hide();
        var datauser = JSON.parse(localStorage.userdata);
        // console.log(datauser);
        document.getElementById("img_user").src = datauser.img;
        document.getElementById('nama_user').innerHTML = datauser.nama;
        document.getElementById('jabatan_user').innerHTML = datauser.nm_jabatan;
        document.getElementById('dept_user').innerHTML = datauser.Dept;
    }, 500);
});

//Edisi Page
$$('#getnewsedition').on('click', function () { // rvc edisi pada menu samping kiri

    $('.navbar').hide();
    $('#seacrhbarfitur').show();

    setTimeout(function () {
        stop_video();
        $.getJSON("http://gema-petro.com/API.php", {page: 'cover'}, function (data) {

            $('.navbar').hide();
            $('#seacrhbarfitur').show();

            var arrayOfData = data.Berita;
            all_edition = arrayOfData;
            var optlistyear = '';
            var optlistmonth = '';
            for (var i = 0; i < arrayOfData.length; i++) {
                var year = arrayOfData[i].Year;
                // console.log(year);
                if (i == parseInt(arrayOfData.length) - 1) {
                    optlistyear += '<option value="' + year + '" selected>' + year + '</option>';

                    var listedisi =  arrayOfData[i].Edisi;    
                    $.each( listedisi, function( key, value ) {
                      selected_edisi = key;
                      optlistmonth += '<option value="' + monthNum[parseInt(key)] + '">' + monthName[parseInt(key)] + '</option>';
                    });

                    selected_edisi_content =  listedisi[selected_edisi][0];
                    
                    document.getElementById('pilih_bulan_edisi').innerHTML = optlistmonth;

                    document.getElementById('pilih_bulan_edisi').value = monthNum[parseInt(selected_edisi)];

                    if (selected_edisi_content['Cover']) {
                        content = '<a class="link">' +
                            '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                            +'</a>';

                        $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

                    } else {
                        content = '<a class="link">' +
                            '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                            +'</a>';

                        $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
                    }

                    document.getElementById('pilih_list_edisi').innerHTML = content;

                } else {
                    optlistyear += '<option value="' + year + '">' + year + '</option>';
                }   

            }

            document.getElementById('pilih_tahun_edisi').innerHTML = optlistyear;  

        });  
    }, 500);
});

//About Page
$$('#getaboutapp').on('click', function () {

    $('#inputsearch').hide();
    $('#seacrhbarfitur').hide();

    setTimeout(function () {
        stop_video();
    $('#inputsearch').hide();
    $('#seacrhbarfitur').hide();
        $$.getJSON("http://gema-petro.com/API.php?page=account", {username: glb_username}, function (data) {
            var arrayOfData = data.account;
            var nama = arrayOfData[0].nama;
            var alamat = arrayOfData[0].alamat;
            var email = arrayOfData[0].email;
            var username = arrayOfData[0].username;
            document.getElementById('my_profile').innerHTML += '<div class="row no-gutter"><div class="col-50">Nama</div><div class="col-50"><b>' + nama + '</b></div><div class="col-50">Username</div><div class="col-50"><b id="username_apps">' + username + '</b></div><div class="col-50">Alamat</div><div class="col-50"><b>' + alamat + '</b></div><div class="col-50">Email</div><div class="col-50"><b>' + email + '</b></div> </div>';
        });
    }, 500);
});

$$('#tahun_edisi').on('change', function () {
    var optlistmonth = '';
    for (var i = 0; i < all_edition.length; i++) {
        var year = all_edition[i].Year;
        // console.log(year);
        if (year == parseInt($$('#tahun_edisi').val())) {

            var listedisi =  all_edition[i].Edisi;    
            $.each( listedisi, function( key, value ) {
              selected_edisi = key;

              optlistmonth += '<option value="' + monthNum[parseInt(key)] + '">' + monthName[parseInt(key)] + '</option>';
            });

            selected_edisi_content =  listedisi[selected_edisi][0];
            
            document.getElementById('bulan_edisi').innerHTML = optlistmonth;

            document.getElementById('bulan_edisi').value = monthNum[parseInt(selected_edisi)];

            // if (selected_edisi_content['Cover']) {
            //     content = '<a class="link">' +
            //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="http://gema-petro.com/COVER/' + selected_edisi_content['Cover'] + '" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
            //         +'</a>';
                    
            //     $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

            // } else {
            //     content = '<a class="link">' +
            //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="img/nocover.jpg" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row" style="min-width: 150 px;"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
            //         +'</a>';

            //     $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
            // }       

            if (selected_edisi_content['Cover']) {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';
                    
                $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

            } else {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';

                $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
            }

            document.getElementById('list_edisi').innerHTML = content;

        }
    }
});

$$('#bulan_edisi').on('change', function () {
    for (var i = 0; i < all_edition.length; i++) {
        var year = all_edition[i].Year;
        // console.log(year);
        if (year == parseInt($$('#tahun_edisi').val())) {

            selected_edisi = $$('#bulan_edisi').val();

            var listedisi =  all_edition[i].Edisi;    

            selected_edisi_content =  listedisi[selected_edisi+"-"+year][0];

            // if (selected_edisi_content['Cover']) {
            //     content = '<a class="link">' +
            //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="http://gema-petro.com/COVER/' + selected_edisi_content['Cover'] + '" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
            //         +'</a>';
                    
            //     $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

            // } else {
            //     content = '<a class="link">' +
            //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="img/nocover.jpg" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row" style="min-width: 150 px;"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
            //         +'</a>';

            //     $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
            // }

            if (selected_edisi_content['Cover']) {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi+"-"+year + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';
                    
                $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

            } else {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi+"-"+year + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';

                $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
            }

            document.getElementById('list_edisi').innerHTML = content;

            // console.log(content);

        }
    }
});

$$('#pilih_tahun_edisi').on('change', function () {
    var optlistmonth = '';
    for (var i = 0; i < all_edition.length; i++) {
        var year = all_edition[i].Year;
        // console.log(year);
        if (year == parseInt($$('#pilih_tahun_edisi').val())) {

            var listedisi =  all_edition[i].Edisi;    
            $.each( listedisi, function( key, value ) {
              selected_edisi = key;

              optlistmonth += '<option value="' + monthNum[parseInt(key)] + '">' + monthName[parseInt(key)] + '</option>';
            });

            selected_edisi_content =  listedisi[selected_edisi][0];
            
            document.getElementById('plih_bulan_edisi').innerHTML = optlistmonth;

            document.getElementById('plih_bulan_edisi').value = monthNum[parseInt(selected_edisi)];

            // if (selected_edisi_content['Cover']) {
            //     content = '<a class="link">' +
            //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="http://gema-petro.com/COVER/' + selected_edisi_content['Cover'] + '" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
            //         +'</a>';
                    
            //     $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

            // } else {
            //     content = '<a class="link">' +
            //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="img/nocover.jpg" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row" style="min-width: 150 px;"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
            //         +'</a>';

            //     $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
            // }       

            if (selected_edisi_content['Cover']) {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';
                    
                $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

            } else {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';

                $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
            }

            document.getElementById('pilih_list_edisi').innerHTML = content;

        }
    }
});

$$('#pilih_bulan_edisi').on('change', function () {
    for (var i = 0; i < all_edition.length; i++) {
        var year = all_edition[i].Year;
        // console.log(year);
        if (year == parseInt($$('#pilih_tahun_edisi').val())) {

            selected_edisi = $$('#pilih_bulan_edisi').val();

            var listedisi =  all_edition[i].Edisi;    

            selected_edisi_content =  listedisi[selected_edisi+"-"+year][0];

            // if (selected_edisi_content['Cover']) {
            //     content = '<a class="link">' +
            //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="http://gema-petro.com/COVER/' + selected_edisi_content['Cover'] + '" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
            //         +'</a>';
                    
            //     $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

            // } else {
            //     content = '<a class="link">' +
            //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="img/nocover.jpg" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row" style="min-width: 150 px;"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
            //         +'</a>';

            //     $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
            // }

            if (selected_edisi_content['Cover']) {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi+"-"+year + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';
                    
                $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

            } else {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi+"-"+year + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';

                $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
            }
            

            document.getElementById('pilih_list_edisi').innerHTML = content;

            // console.log(content);

        }
    }
});

function detail_article(id_berita, edisimajalah) {
    // body...
    stop_video();
    mainView.router.loadPage('each-news.html?id=' + id_berita + '&edisi=' + edisimajalah);

}

function setmonth() {
    var optlistmonth = '';
    for (var i = 0; i < all_edition.length; i++) {
        var year = all_edition[i].Year;
        // console.log(year);
        if (year == parseInt($$('#pilih_tahun_edisi').val())) {

            var listedisi =  all_edition[i].Edisi;    
            $.each( listedisi, function( key, value ) {
              selected_edisi = key;

              optlistmonth += '<option value="' + monthNum[parseInt(key)] + '">' + monthName[parseInt(key)] + '</option>';
            });

            selected_edisi_content =  listedisi[selected_edisi][0];
            
            document.getElementById('pilih_bulan_edisi').innerHTML = optlistmonth;

            document.getElementById('pilih_bulan_edisi').value = monthNum[parseInt(selected_edisi)];

            // if (selected_edisi_content['Cover']) {
            //     content = '<a class="link">' +
            //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="http://gema-petro.com/COVER/' + selected_edisi_content['Cover'] + '" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
            //         +'</a>';
                    
            //     $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

            // } else {
            //     content = '<a class="link">' +
            //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="img/nocover.jpg" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row" style="min-width: 150 px;"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
            //         +'</a>';

            //     $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
            // }       

            if (selected_edisi_content['Cover']) {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';
                    
                $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

            } else {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';

                $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
            }

            document.getElementById('pilih_list_edisi').innerHTML = content;

        }
    }
}

function setedisi() {

    for (var i = 0; i < all_edition.length; i++) {
        var year = all_edition[i].Year;
        // console.log(year);
        if (year == parseInt($$('#pilih_tahun_edisi').val())) {

            selected_edisi = $$('#pilih_bulan_edisi').val();

            var listedisi =  all_edition[i].Edisi;    

            selected_edisi_content =  listedisi[selected_edisi+"-"+year][0];

            // if (selected_edisi_content['Cover']) {
            //     content = '<a class="link">' +
            //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="http://gema-petro.com/COVER/' + selected_edisi_content['Cover'] + '" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
            //         +'</a>';
                    
            //     $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

            // } else {
            //     content = '<a class="link">' +
            //         '<div class="card ks-card-header-pic"><div class="card-content"><div class="card-content-inner"><img style="display: none;" src="img/nocover.jpg" onerror="this.src=\'img/nocover.jpg\'" width="100%"><div class="item-text" style="min-height: 271px; text-align: center; margin-bottom: 10px;"></div><div class="row" style="min-width: 150 px;"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div></p></div></div></div>'
            //         +'</a>';

            //     $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
            // }

            if (selected_edisi_content['Cover']) {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi+"-"+year + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';
                    
                $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

            } else {
                content = '<a class="link">' +
                    '<div class="row"><a href="sambutan.html?edisi=' + selected_edisi+"-"+year + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                    +'</a>';

                $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
            }

            document.getElementById('pilih_list_edisi').innerHTML = content;

            // console.log(content);

        }
    }
}

function getedisi() {   // rvc Edisi awal
    // body...

    $('.navbar').hide();
    $('#seacrhbarfitur').hide();

    setTimeout(function () {
        $.getJSON("http://gema-petro.com/API.php", {page: 'cover'}, function (data) {
            var arrayOfData = data.Berita;
            all_edition = arrayOfData;
            var optlistyear = '';
            var optlistmonth = '';
            for (var i = 0; i < arrayOfData.length; i++) {
                var year = arrayOfData[i].Year;
                // console.log(year);
                if (i == parseInt(arrayOfData.length) - 1) {
                    optlistyear += '<option value="' + year + '" selected>' + year + '</option>';

                    var listedisi =  arrayOfData[i].Edisi;    
                    $.each( listedisi, function( key, value ) {
                      selected_edisi = key;
                      optlistmonth += '<option value="' + monthNum[parseInt(key)] + '">' + monthName[parseInt(key)] + '</option>';
                    });

                    selected_edisi_content =  listedisi[selected_edisi][0];
                    
                    document.getElementById('pilih_bulan_edisi').innerHTML = optlistmonth;

                    document.getElementById('pilih_bulan_edisi').value = monthNum[parseInt(selected_edisi)];

                    if (selected_edisi_content['Cover']) {
                        content = '<a class="link">' +
                            '<div class="row" style="min-width: 150 px;"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                            +'</a>';
                            
                        $('.edisi-bg').css("background-image", "url('http://gema-petro.com/COVER/" + selected_edisi_content['Cover'] + "')");

                    } else {
                        content = '<a class="link">' +
                            '<div class="row" style="min-width: 150 px;"><a href="sambutan.html?edisi=' + selected_edisi + '" class="button button-small button-fill color-green" style="right: 30px;bottom: 30px;position:absolute;font-size: 20px;padding: 1px 20px 30px 20px;font-family: Tw Cen MT;background-color: #006547;box-shadow: 2px 2px #aaaaaa;">Next</a></div>'
                            +'</a>';

                        $('.edisi-bg').css("background-image", "url('img/nocover.jpg')");
                    }

                    document.getElementById('pilih_list_edisi').innerHTML = content;

                } else {
                    optlistyear += '<option value="' + year + '">' + year + '</option>';
                }   

            }

            document.getElementById('pilih_tahun_edisi').innerHTML = optlistyear;  

        });  
    }, 500);
}

function readarticle(a) {
    
    $('#inputsearch').val('');
    $('#seacrhbarfitur').show();
    $('.navbar').show();

    setTimeout(function () {

        $('#btn-search-art').hide();
        document.getElementById('listfilterkategori').innerHTML = '';
        document.getElementById('home_image_slider').innerHTML = '';

        edisimajalah = a;

        localStorage.setItem("edisimajalah", a);

        // $("#searchbar-cancel").attr("href", "home.html?edisi=" + edisimajalah);

        $.getJSON("http://gema-petro.com/API.php", {page: 'berita', action: 'select', edisi: edisimajalah}, function (data) {

            var arrayOfkategori = data.kategori;
            for (var k = 0; k < arrayOfkategori.length; k++) {
                document.getElementById('listfilterkategori').innerHTML += '<li><label class="label-checkbox item-content"><input type="checkbox" name="listkategori[]" class="listKategori" value="'+arrayOfkategori[k].ID_KATEGORI+'">'
                                                                        +'<div class="item-media"><i class="icon icon-form-checkbox"></i></div><div class="item-inner"><div class="item-title">'+arrayOfkategori[k].KATEGORI+'</div></div></label></li>';
            }

            $('#btn-search-art').show();

            var arrayOfData = data.articles;
                var listarticle = '';
                var j = 0;
            for (var i = 0; i < arrayOfData.length; i++) {
                var id_berita = arrayOfData[i]["id_berita"];
                var desc = arrayOfData[i].description;
                var shortdesc = arrayOfData[i].short_desc;
                var title = arrayOfData[i].title;
                var img = arrayOfData[i].gambar;
                var pub = arrayOfData[i].publishedAt;
                var like = arrayOfData[i].jum_like;
                var dislike = arrayOfData[i].jum_dislike;
                var comments_n = arrayOfData[i].jum_comment;

                var gambar = arrayOfData[i].gambar;

                var kategori = arrayOfData[i].kategori[0];

                

                // console.log(gambar);
                var gambarsource = '';

                if(gambar){
                    gambarsource = gambar[0];
                }
                if (kategori) {

                    if (kategori[0] != 'Salam Redaksi') {
                        if (j % 3 == 1 &&  j != parseInt(arrayOfData.length) - 1 ) {
                            listarticle += '<table width="100%"><tbody><td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:18;">'+ title +'</div></div>'
                                            +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                            +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                            '</p></div></div></div></a></td>';

                        } else if (j % 3 == 2) {
                            listarticle += '<td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div>'
                                            +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                            +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                            '</p></div></div></div></a></td></tbody></table>';


                        } else {
                            listarticle += '<a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic"><div style="background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div><div class="card-content"><div class="card-content-inner" style="color: black;"><p class="color-gray">Posted on ' 
                                            + pub + '</p><p style="color: #000000;text-align: justify;">' + shortdesc + ' ...</p>' 
                                            +'<p><span style="background-color:#006547;padding:5px 5px 5px 5px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +'</p></div></div></div></a>';
                        
                        }
                        j++;
                    }

                }
            }
            document.getElementById('list_selected_edisi').innerHTML += listarticle;

            localStorage.setItem("listarticleinedisi", listarticle);

        });

        var imageslider = '';

        var videoslider = '';

        $.getJSON("http://gema-petro.com/API.php", {page: 'slider', edisi: edisimajalah}, function (data) {
            var arrayOfData = data["Slider Image"];
            var imageslider = "";
            if (arrayOfData["Image"]) {
                for (var i = 0; i < 5; i++) {
                    if (arrayOfData["Image"][i]) {
                        var id_berita = arrayOfData["Image"][i]["id_berita"];
                        var berita = arrayOfData["Image"][i].berita;
                        var title = arrayOfData["Image"][i].judul;
                        var img = arrayOfData["Image"][i].urlToImage;

                        imageslider += '<div onclick="detail_article(\''+id_berita+'\',\''+edisimajalah+'\')" id="slider-'+i+'" style="background-image:url('+img+'), url(\'img/noimage.jpg\');" valign="bottom" class="card-header color-white no-border swiper-slide"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:19px;">' + title + '</div></div>';

                    } else {
                    }
                    
                }

                document.getElementById('home_image_slider').innerHTML += imageslider;

                mySwiper = myApp.swiper('#slider_home', {
                    pagination: '.swiper-pagination',
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                });
            }

            if (arrayOfData["Video"]) {
                for (var i = 0; i < arrayOfData["Video"].length; i++) {
                    var id_berita = arrayOfData["Video"][i]["id_berita"];
                    var berita = arrayOfData["Video"][i].berita;
                    var title = arrayOfData["Video"][i].judul;
                    var video = arrayOfData["Video"][i].urlToVideo;
                    document.getElementById('video_highlight').innerHTML = '<div class="card-content card-content-padding">'+'<iframe id="articlevideo_player" style="min-height: 208px;" allowfullscreen="allowfullscreen" width="100%" src="'+ video +'modestbranding=1&amp;rel=1&amp;controls=0&amp"></iframe>'+'</div>'
                        +'<div class="card-footer"></div>';
                }

                if (arrayOfData["Video"].length > 0) {
                    $('#video_list').show();
                } else {
                    $('#video_list').hide();
                }
            } else {
                $('#video_list').hide();
            }
        });
    }, 500);
}

$$('.home').on('click', function () {
    mainView.router.loadPage('edisi.html');
});

function OpenPanelSort() {
    // body...
    $('#rightPanelTittle').html('Sort');
    $('#actSort').show();
    $('#actFilter').hide();
    // console.log('Open Right Panel : Sort');
}

function OpenPanelFilter() {
    // body...
    $('#rightPanelTittle').html('Filter');
    $('#actSort').hide();
    $('#actFilter').show();
    // console.log('Open Right Panel : Filter');
}

//Profile Page
myApp.onPageInit('password', function (page) {
    $$('#changepass').on('click', function () {
        var username = $$('#username_apps').val();
        var curr = $$('#curr_pass').val();
        var newp = $$('#new_pass').val();
        var retype = $$('#retype_pass').val();
        // console.log(username + '/' + curr + '/' + newp + '/' + retype);
    });
});

//Forgot Password
myApp.onPageInit('forgot_password', function (page) {
    $$('#btn_reset_pass').on('click', function () {
        var reset_email = $$('#reset_email').val();
        if (reset_email) {
            var emailuser = reset_email.split("@");
            // console.log(emailuser);
            if (emailuser[1]) {
                var emailuserdomain = emailuser[1];
                // console.log(emailuserdomain);
                var emailuserdomaincek = emailuserdomain.split(".");
                // console.log(emailuserdomaincek);
                if (emailuserdomaincek[1]) {
                    $$.post('http://gema-petro.com/API.php?page=reset', {email: reset_email}, function (respon) {
                        myApp.alert(respon, function () {
                            mainView.router.loadPage('login.html');
                        });
                    });
                } else {
                    $$('#reset_email').val('');
                    myApp.alert("Email Tidak Valid  ... ");
                }
            } else {
                $$('#reset_email').val('');
                myApp.alert("Domain Email Tidak Valid ... ");
            }
            
        } else {
            $$('#reset_email').focus();
            myApp.alert("Email Kosong ... ");
        }
    });
});

//Register New User
myApp.onPageInit('register', function (page) {
    $$('#btn_register').on('click', function () {
        var nama = $$('#reg_nama').val();
        var username = $$('#reg_username').val();
        var email = $$('#reg_email').val();
        var pass1 = $$('#reg_pass1').val();
        var pass2 = $$('#reg_pass2').val();
        var alamat = $$('#reg_addr').val();

        if (nama != '' && username != '' && email != '' && pass1 != '' && pass2 != '' && alamat) {

            var emailuser = email.split("@");
            // console.log(emailuser);
            if (emailuser[1]) {
                var emailuserdomain = emailuser[1];
                // console.log(emailuserdomain);
                var emailuserdomaincek = emailuserdomain.split(".");
                // console.log(emailuserdomaincek);
                if (emailuserdomaincek[1]) {
                    if (pass1 == pass2) {
                        $$.post('http://gema-petro.com/API.php?page=register', {nama: nama, username: username, password1: pass1, password2: pass2, alamat: alamat, email: email}, function (respon) {
                            myApp.alert(respon, function () {
                                mainView.router.loadPage('login.html');
                            });
                        });
                    } else {
                        myApp.alert('Wrong Confirmation Password', function () {
                            $('#reg_pass2').val('');
                            $('#reg_pass2').focus();
                        });
                    }
                } else {
                    $$('#reg_email').val('');
                    myApp.alert("Email Tidak Valid  ... ");
                }
            } else {
                $$('#reg_email').val('');
                myApp.alert("Domain Email Tidak Valid ... ");
            }

        } else {

            if (nama == '') {
                myApp.alert('Nama tidak boleh kosong', function () {
                    $('#reg_nama').val('');
                    $('#reg_nama').focus();
                });
            } else if (username == '') {
                myApp.alert('Username tidak boleh kosong', function () {
                    $('#reg_username').val('');
                    $('#reg_username').focus();
                });

            } else if (email == '') {
                myApp.alert('Email tidak boleh kosong', function () {
                    $('#reg_email').val('');
                    $('#reg_email').focus();
                });
                
            } else if (pass1 == '') {
                myApp.alert('Password tidak boleh kosong', function () {
                    $('#reg_pass1').val('');
                    $('#reg_pass1').focus();
                });
                
            } else if (pass2 == '') {
                myApp.alert('Wrong Confirmation Password', function () {
                    $('#reg_pass2').val('');
                    $('#reg_pass2').focus();
                });
                
            } else if (alamat == '') {
                myApp.alert('Alamat tidak boleh kosong', function () {
                    $('#reg_addr').val('');
                    $('#reg_addr').focus();
                });
                
            }
        }

    });
});

if (localStorage.userdata) {
    // console.log(localStorage);      
    var datauser = JSON.parse(localStorage.userdata);
    if (datauser.status == true) {
        $('.navbar').hide();
        myApp.alert('Welcome <b>' + datauser.nama + '</b>');
        // console.log(datauser);
        if (datauser.img) {
        	document.getElementById("img_user_sdbar").src = datauser.img;
        }
        document.getElementById('nama_user_sdbar').innerHTML = datauser.nama;
    } else {
        $('.navbar').hide();
        mainView.router.loadPage("login.html");
        localStorage.clear();
    }
} else {
    $('.navbar').hide();
    // console.log(localStorage);  
    mainView.router.loadPage('login.html');
    localStorage.clear();
}

myApp.onPageInit('login', function (page) {
    $('.navbar').hide();
    $$('#label_bawah').addClass('not-displayed');
    $$('#btn_login').on('click', function () {
        var username = $$('#username').val();
        var password = $$('#password').val();
        $$.post('http://gema-petro.com/API.php?page=login', {username: username, password: password}, function (respon) {
            var status = JSON.parse(respon);
            var loggedin = status.status;
            if (loggedin == true) {
                localStorage.setItem("userdata", JSON.stringify(status));
                localStorage.setItem("userpassword", password);

                // console.log(localStorage);

                myApp.alert('Login sukses', function () {
                    $('.navbar').hide();
                    // console.log(localStorage);
                    var datauser = JSON.parse(localStorage.userdata);
                    // console.log(datauser);
                    if (datauser.img) {
                    	document.getElementById("img_user_sdbar").src = datauser.img;
                    }
                    document.getElementById('nama_user_sdbar').innerHTML = datauser.nama;
                    getedisi();
                    mainView.router.loadPage('edisi.html');
                });

            } else {
                myApp.alert('Salah username / password');
            }
        });
    });
});

$$('.tutup_apps').on('click', function () {
    stop_video();
    myApp.confirm('Yakin logout dari aplikasi?','Log out',  function () {
        localStorage.setItem("edisimajalah", edisi_terbaru);
        localStorage.removeItem("userdata");
        myApp.alert('Logout Success');
        setTimeout(function () {
            mainView.router.loadPage('login.html');
        }, 1000);
    });

});

$$('.filter').on('click', function () {
    myApp.confirm('Yakin logout dari aplikasi?','Log out',  function () {
        
    });
});

$$('.sort').on('click', function () {
    myApp.confirm('Yakin logout dari aplikasi?','Log out',  function () {
    });
});

function stop_video() {
    // body...
    // console.log($("#articlevideo_player").attr("src"));
    if ($("#articlevideo_player").attr("src")) {
        $('#seacrhbarfitur').show();
    }
    $("#articlevideo_player").attr("src", $("#articlevideo_player").attr("src"));
}

function seararticl() {
    // body...
    // console.log($('#inputsearch').val());
    // console.log(localStorage.listarticleinedisi);

    var keysearch = $('#inputsearch').val();
    $('.navbar').show();
    $('#btn-search-art').hide();
    document.getElementById('list_selected_edisi').innerHTML = '<ul>'
                    +'<li class="item-content">'
                        +'<div class="item-inner">'
                            +'<div class="item-title">Processing ... </div>'
                        +'</div>'
                    +'</li>'
                +'</ul>';


    $$.post('http://gema-petro.com/API.php', {page: 'SEARCHALL', where: keysearch}, function (respon) {

        var data = JSON.parse(respon);
        
        $('#btn-search-art').show();

        var arrayOfData = data.article;
        var listarticle = '';
        var j = 0;

        if (arrayOfData && keysearch != '') {
            for (var i = 0; i < arrayOfData.length; i++) {
                var id_berita = arrayOfData[i]["id_berita"];
                var desc = arrayOfData[i].description;
                var shortdesc = arrayOfData[i].short_desc;
                var title = arrayOfData[i].title;
                // var img = arrayOfData[i].gambar[0];
                var pub = arrayOfData[i].publishedAt;
                var like = arrayOfData[i].jum_like;
                var dislike = arrayOfData[i].jum_dislike;
                var comments_n = arrayOfData[i].jum_comment;
                var kategori = arrayOfData[i].kategori[0];

                var gambar = arrayOfData[i].gambar;
                // console.log(gambar);

                var gambarsource = '';

                if(gambar){
                    gambarsource = gambar[0];
                }
                if (kategori[0] != 'Salam Redaksi') {
                    if (j % 3 == 1 &&  j != parseInt(arrayOfData.length) - 1 ) {
                        listarticle += '<table width="100%"><tbody><td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:18;">'+ title +'</div></div>'
                                        +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                        +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                        '</p></div></div></div></a></td>';

                    } else if (j % 3 == 2) {
                        listarticle += '<td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div>'
                                        +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                        +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                        '</p></div></div></div></a></td></tbody></table>';


                    } else {
                        listarticle += '<a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic"><div style="background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div><div class="card-content"><div class="card-content-inner" style="color: black;"><p class="color-gray">Posted on ' 
                                        + pub + '</p><p style="color: #000000;text-align: justify;">' + shortdesc + ' ...</p>' 
                                        +'<p><span style="background-color:#006547;padding:5px 5px 5px 5px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +'</p></div></div></div></a>';
                    
                    }
                    j++;
                }
                // console.log(listarticle);
            }
        
        } else if (!arrayOfData && arrayOfData == null && keysearch != '') {
            listarticle = '<ul>'
                    +'<li class="item-content">'
                        +'<div class="item-inner">'
                            +'<div class="item-title">Nothing Found ... </div>'
                        +'</div>'
                    +'</li>'
                +'</ul>';
        } else {

            // listarticle = '<ul>'
            //         +'<li class="item-content">'
            //             +'<div class="item-inner">'
            //                 +'<div class="item-title">Nothing Found ... </div>'
            //             +'</div>'
            //         +'</li>'
            //     +'</ul>';
                
            listarticle = localStorage.listarticleinedisi;
        }

        document.getElementById('list_selected_edisi').innerHTML = listarticle;

        // if (listarticle && listarticle != '') {
        //     document.getElementById('list_selected_edisi').innerHTML = listarticle;
        // } else {
        //     document.getElementById('list_selected_edisi').innerHTML = '<ul>'
        //             +'<li class="item-content">'
        //                 +'<div class="item-inner">'
        //                     +'<div class="item-title">Nothing Found ... </div>'
        //                 +'</div>'
        //             +'</li>'
        //         +'</ul>';
        // }
    });
}

myApp.onPageInit('search', function (page) {
    $('.navbar').show();
    $('#btn-search-art').hide();
    document.getElementById('listsearchart').innerHTML = '';

    $.getJSON("http://gema-petro.com/API.php", {page: 'SEARCHALL', where: ''}, function (data) {
        
        $('#btn-search-art').show();

        var arrayOfData = data.article;
                var listarticle = '';
                var j = 0;
        for (var i = 0; i < arrayOfData.length; i++) {
            var id_berita = arrayOfData[i]["id_berita"];
            var desc = arrayOfData[i].description;
            var shortdesc = arrayOfData[i].short_desc;
            var title = arrayOfData[i].title;
            // var img = arrayOfData[i].gambar[0];
            var pub = arrayOfData[i].publishedAt;
            var like = arrayOfData[i].jum_like;
            var dislike = arrayOfData[i].jum_dislike;
            var comments_n = arrayOfData[i].jum_comment;
            var kategori = arrayOfData[i].kategori[0];

            

            var gambar = arrayOfData[i].gambar;
            // console.log(gambar);

            var gambarsource = '';

            if(gambar){
                gambarsource = gambar[0];
            }
            if (kategori[0] != 'Salam Redaksi') {
                if (j % 3 == 1 &&  j != parseInt(arrayOfData.length) - 1 ) {
                    listarticle += '<table width="100%"><tbody><td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold; font-size:18;">'+ title +'</div></div>'
                                    +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                    +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                    '</p></div></div></div></a></td>';

                } else if (j % 3 == 2) {
                    listarticle += '<td style="width: 50%;"><a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic" style="margin: 0px;"><div style="max-height: 110px;font-size: 10px;background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div>'
                                    +'<div class="card-content"><div class="card-content-inner" style="color: black; font-size: 9px;"><p class="color-gray" style="font-size: 9px;">Posted on ' + pub + '</p><p style="font-size: 8px;color: #000000;text-align: justify;">' + shortdesc + ' ...</p>'
                                    +'<p><span style="background-color:#006547;padding:3px 3px 3px 3px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + ' &nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +
                                    '</p></div></div></div></a></td></tbody></table>';


                } else {
                    listarticle += '<a href="each-news.html?id=' + id_berita + '&edisi=' + edisimajalah + '" class="link"><div class="card ks-card-header-pic"><div style="background-image:url('+ gambarsource +'), url(\'img/noimage.jpg\');background-size: 100% 100%;" valign="bottom" class="card-header color-white no-border"><div style="background-color:rgba(0,0,0,0.25);padding:8px 10px 3px 20px; width:100%; font-weight:bold;">'+ title +'</div></div><div class="card-content"><div class="card-content-inner" style="color: black;"><p class="color-gray">Posted on ' 
                                    + pub + '</p><p style="color: #000000;text-align: justify;">' + shortdesc + ' ...</p>' 
                                    +'<p><span style="background-color:#006547;padding:5px 5px 5px 5px; width:100%;margin-left: 2px;border-radius: 3px;color: #ffffff;">'+ kategori[0] +'</span></p><p class="color-blue"><i class="fa fa-thumbs-o-up size-50"></i> ' + like + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-down size-50"></i> ' + dislike + ' &nbsp;&nbsp;<i class="fa fa-comment-o size-50"></i> '+ comments_n +'</p></div></div></div></a>';
                
                }
                j++;
            }
            // console.log(listarticle);
        }

        document.getElementById('listsearchart').innerHTML += listarticle;

    });
});

myApp.onPageInit('video', function (page) {
    $$('select[name="tahun_edisivd"]').on('change', function (ev) {
        var tahun = ev.srcElement.value;
    });
});

myApp.onPageInit('news', function (page) {
    $$('select[name="tahun_edisinw"]').on('change', function (ev) {
        var tahun = ev.srcElement.value;
    });
});