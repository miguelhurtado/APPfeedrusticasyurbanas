function execute() {

  // Global feed loader
  var loader;

  // List of feeds to retrieve
	var feeds = {
    section_a: "http://www.rusticasyurbanas.com/2.0/index.php/respuestajbpoint/get/zoo/categories?app=9",
    section_b: "http://www.rusticasyurbanas.com/2.0/index.php/respuestajbpoint/get/zoo/categories/444?app=9",
    section_c: "http://www.rusticasyurbanas.com/2.0/index.php/respuestajbpoint/get/zoo/items?category=444&app=9"
  };

  // List of feeds to retrieve
  /*var feeds = {
    section_a: "feed.php?id=9",
    section_b: "feed.php?id=444",
    section_c: "feed.php?id=445"
  };*/

  // Back buttons must load first page
  $('#btnRssBack').on('click', function(e) {
    gotoPage(1);
  });
  $('#btnRssBottomBack').on('click', function(e) {
    gotoPage(1);
  });

  // Default view settings
  var def = {
    ShowDesc: true,
    ShowPubDate: true,
    DescCharacterLimit: 100
  }

  // Default feeds options
  var opt = {
     FeedUrl: feeds.home,
     MaxCount: 10,
     DateFormat: "dddd, YYYY-MM-DD HH:mm",
     DateFormatLang: "en"
  }

  // Default image positions
  var sides = ["left", "right"];

  // Manage asynchronous feeds loading and page refresh
  function loadFeeds(url) {

    // Return to page list in any case
    gotoPage(1);

    // Clean current list and show loader
    $('#divRss').empty().append('<p class="text-center"><img src="img/loader.gif" /></p>');

    // Get asynchronous feeds
    opt.FeedUrl = url;
    var f = getFeeds(opt);

    // On success
    f.done(function( data ) {
      $('#divRss').empty();
      $('#divRss').data("feeds", data.articles);
      var s = "";
      $.each(data.articles, function (e, item) {
          a = e % 2;
          s += '<div id="' + e + '" class="row media">';
          if ((item.images !== undefined) && (item.images !== null)) {
            if (typeof item.images.image_intro !== 'undefined') {
              s += '<a href="#" class="' + sides[a] + '"><img class="media-object" src="' + item.images.image_intro + '"></a>';
            }
          }
          s += '<div class="media-body"><h4 class="media-heading">' + item.title + '</h4></div>';
          if (def.ShowPubDate){
            s += '<div><small><i>' + item.published_date + "</i></small></div>";
          }
          if (def.ShowDesc) {
              var tmpDesc = document.createElement("div");
              tmpDesc.innerHTML = item.content;
              var desc = tmpDesc.textContent || tmpDesc.innerText;
              if (def.DescCharacterLimit > 0 && desc.length > def.DescCharacterLimit) {
                  s += '<p>' + desc.substr(0, def.DescCharacterLimit) + "...</p>";
              }
              else {
                  s += '<p>' + desc + "</p>";
              }
          }
          s += '</div>'; // .media
      });

      $('#divRss').append('<div class="jFeedList">' + s + "</div>");

      $('div.media').on('click', function(e) {
        var item = $('#divRss').data("feeds")[$(this).attr('id')];
        var content = '<div class="jFeedItem"><div class="row media">';
        content += '<div class="page-header"><h3>' + item.title + ' <br /><small>' + item.published_date + '</small></h3></div>';
        content += '<div>' + item.content + '</div>';
        content += '</div></div>';
        $('#divRssItem').empty().append(content);
        $('#divRssItem a').attr('dest', function() {
          var dest = $(this).attr('href');
          $(this).attr('href', 'javascript:void(0);');
          return dest;
        }).on('click', function(e) {
          var extPage = window.open($(this).attr('dest'), '_system', 'location=yes');
        });
        gotoPage(2);
      });

    });

    // On error
    f.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
      console.log(jqXHR);
    });

    return f;
  }

  // Load home feeds
  loader = loadFeeds(feeds.section_a);

  // Load feeds when click on navigation buttons
  $("#menu li a").on('click', function(e) {
    if(loader && loader.readystate != 4) {
      // Abort running request
      loader.abort();
    }
    var $thisLi = $(this).parent('li');
    var $ul = $thisLi.parent('ul');
    if (!$thisLi.hasClass('active')) {
      $ul.find('li.active').removeClass('active');
      $thisLi.addClass('active');
    }
    var menu = $(this).attr('href');
    switch (menu) {
      case '#section-b':
        loader = loadFeeds(feeds.section_b);
        break;
      case '#section-c':
        loader = loadFeeds(feeds.section_c);
        break;
      case '#section-a':
      default:
        loader = loadFeeds(feeds.section_a);
    }
  });

}