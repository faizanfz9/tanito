/* ===============================================
 1. Textimonial owl (Home page)
=============================================== */
$(document).ready(function () {
	var owl = $('#owl-demo-testi');
	owl.owlCarousel({
		loop: true,
		margin: 10,
		nav: true,
		dots: true,
		responsiveClass: true,
		responsive: {
			0: {


				margin: 10,
				items: 2
			},

			600: {

				margin: 10,
				items: 2
			},
			768: {

				margin: 10,
				items: 3
			},


			960: {
				items: 4,
				margin: 10,
			},
			1200: {
				items: 5,
				margin: 10,
			}

		}


	})
})

/* ===============================================
    2. COUNTER (Home page)
=============================================== */

$(document).ready(function () {
	$('.counter').each(function () {
		$(this).prop('Counter', 0).animate({
			Counter: $(this).text()
	
		}, {
			duration: 4000,
			easing: 'swing',
			step: function (now) {
				$(this).text(Math.ceil(now));
			}
		});
	});

});


/* ===============================================
    2.1. COUNTER (Home page)
=============================================== */
$('.counter').each(function () {
	var $this = $(this),
		countTo = $this.attr('data-count');
	$({
		countNum: $this.text()
	}).animate({
			countNum: countTo
		},

		{
			duration: 8000,
			easing: 'linear',
			step: function () {
				$this.text(Math.floor(this.countNum));
			},
			complete: function () {
				$this.text(this.countNum);
				//alert('finished');
			}

		});
});


/* ===============================================
 3. Show Password
=============================================== */


$(".toggle-password").click(function () {
	$(this).toggleClass("fa-eye fa-eye-slash");
	var input = $($(this).attr("toggle"));
	if (input.attr("type") == "password") {
		input.attr("type", "text");
	} else {
		input.attr("type", "password");
	}
});


/* ===============================================
 3. WORD COUNT  student timeline
=============================================== */


$('#writeSomething').on('input', function () {
	var $this = $(this).val().length;
	$('#charCount').text($this);
});

$('.media_card ul li').click(function () {
	var $this = $(this).attr('data-item');
	$('.media_card ul li').removeClass('active');
	$(this).addClass('active');
	$('.text_box, .media_box').hide()

	$('#' + $this).show();
})


/* ===============================================
 3. accordian student timeline
=============================================== */

$('.accord_btn').click(function () {
	if ($(this).hasClass('active')) {
		$(this).removeClass('active');
		$(this).next('.content').slideUp();
		$(this).find('i').removeClass('fa-caret-down').addClass('fa-caret-right');
	} else {
		$('.accord_btn').removeClass('active');
		$(this).addClass('active');
		$('.accord_btn').find('i').removeClass('fa-caret-down').addClass('fa-caret-right');
		$(this).find('i').addClass('fa-caret-down').removeClass('fa-caret-right')
		$('.content').slideUp();
		$(this).next('.content').slideDown();
	}
});


/* ===============================================
 3.  OTP
=============================================== */
$('.verfOtp_box input').on('keyup', function () {
	if ($(this).val().length == $(this).attr('maxlength')) {
		$(this).next('input').focus();
	}

	if ($(this).val().length == '') {
		$(this).prev('input').focus();
	}
})


$('.see_more_btn').click(function () {
	$(this).prev('.see_more_content').css({
		"height": "initial",
		"overflow": "auto"
	});
	$(this).hide();
})


$('.tabs_follow li').click(function () {
	var $this_e = $(this).attr('data-item');

	$('.tabs_follow li').removeClass('active');
	$(this).addClass('active');

	$('.follow_ple').hide();
	$('#' + $this_e).show();
})


/* ===============================================
  Pricing tabs
=============================================== */


var tabs = $(".pricing .tabs li");
$(".pricing .tab-content[data-tab-id='" + $(".pricing .tabs li.active").attr("id") + "']").show();
tabs.click(function () {
	var tabId = $(this).attr("id");
	console.log(tabId)
	tabs.removeClass("active");
	$(this).addClass("active");
	$(".pricing .tab-content").hide()
	$(".pricing .tab-content[data-tab-id='" + tabId + "']").fadeIn();
})


/* ===============================================
Pricing card slider
=============================================== */


$(document).ready(function () {
	var cardSlider = $('.pricing .slider-wrap');
	cardSlider.owlCarousel({
		loop: true,
		dots: true,
		margin: 30,
		responsive: {
			992: {
				items: 3
			},
			576: {
				items: 2,
			},
			0: {
				items: 1
			}
		}
	});
})






/* ===============================================
chat 
=============================================== */


      
$('.message_tgle').click(function() {
	$('.msg_panel').toggleClass('right');
	$('.chat_box_body').toggleClass('width_body');
	$('.chat_box_ftr').toggleClass('width_body');
})

// $(document).on("click", "#logindrop", function(event){
// 	event.preventDefault();
// 	$(".my_account_dropmenu").slideToggle(300);
// })

$(document).click(function(e) {
  var container = $("#logindrop");
  var container2 = $("#clickable");
  var container3 = $("#submenu_click01");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container3.is(e.target) && container3.has(e.target).length === 0 && !container.is(e.target) && container.has(e.target).length === 0 && !container2.is(e.target) && container2.has(e.target).length === 0) 
    {
     $(".my_account_dropmenu").hide();
    }
});





