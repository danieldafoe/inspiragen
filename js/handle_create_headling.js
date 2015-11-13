// Insert into DB.
$.ajax({
  url:"php/add_headline.php",
  type:"POST",
  data:dataString,
  success:function(data) {
    console.log(data);
  },
  error:function(e) {
    
  }
});