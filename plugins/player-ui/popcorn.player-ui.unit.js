test("Player UI Plugin", function () {

  function click(elem) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window,
    0, 0, 0, 0, 0, false, false, false, false, 0, null);
    return !button.dispatchEvent(evt);
  }

  var popcorn = Popcorn("#video");

  expect(4);
  
  ok(popcorn.playerui, "Player UI exists");
  
  popcorn.playerui();
  
  ok(popcorn.media.paused, "Start out paused");
                          
  var button = $(".player-ui-button-play")[0];
  
  click(button);
    
  ok(!popcorn.media.paused, "We started playing...");
  
  click(button);
  
  ok(popcorn.media.paused, "...then paused again.");
    
});