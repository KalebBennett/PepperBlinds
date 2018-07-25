console.log("Injected!");
$('#paypalstuff').hide();
$('#profilebtnstuff').hide();
$('#sOfferInfo').hide();
$('#mOfferInfo').hide();
const delay = false
var signintoggle = false


$(document).on("click","#buypepplusbtn",function() {
  $('#paypalstuff').fadeIn();
});
$("#closepaypal").click(function() {
  $('#paypalstuff').fadeOut();
});

var isAnimating1 = false;
$('#signin').click(function() {
    if (isAnimating1) {
        return;
    }
    isAnimating1 = true;
    $("#profilebtnstuff").slideToggle();
    setTimeout(function() {
        isAnimating1 = false;
    }, 500);
});

var specialpoptoggle = false
var isAnimating2 = false;
$('#sOffers').hover(function() {
    if (isAnimating2) {
        return;
    }
    isAnimating2 = true;
    specialpoptoggle = true;
    $("#sOfferInfo").slideToggle();
    setTimeout(function() {
        isAnimating2 = false;
    }, 350);
});
var morepoptoggle = false
var isAnimating3 = false;
$('#mOffers').hover(function() {
    if (isAnimating3) {
        return;
    }
    isAnimating3 = true;
    morepoptoggle = true;
    $("#mOfferInfo").slideToggle();
    setTimeout(function() {
        isAnimating3 = false;
    }, 350);
});

$('#profilebtn').click(function() {
  location.href= "/profile/<%=users[i].id%>"
})
$('#logoutbtn').click(function() {
  window.location.href = '/logout'
})
