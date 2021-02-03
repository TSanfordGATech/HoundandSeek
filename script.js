$(document).ready(function () {
  $("#dogBtn").on("click", function () {
    $(".img").addClass("active")
    var $breed_select = $('select.breed_select');
    $breed_select.change(function () {
      var id = $(this).children(":selected").attr("id");
      getDogByBreed(id)
    });
    // Load all the Breeds
    function getBreeds() {
      ajax_get('https://api.thedogapi.com/v1/breeds', function (data) {
        populateBreedsSelect(data)
      });
    }
    // Put the breeds in the Select control
    function populateBreedsSelect(breeds) {
      $breed_select.empty().append(function () {
        var output = '';
        $.each(breeds, function (key, value) {
          output += '<option id="' + value.id + '">' + value.name + '</option>';
        });
        return output;
      });
    }
    // triggered when the breed select control changes
    function getDogByBreed(breed_id) {
      // search for images that contain the breed (breed_id=) and attach the breed object (include_breed=1)
      ajax_get('https://api.thedogapi.com/v1/images/search?include_breed=1&breed_id=' + breed_id, function (data) {
        if (data.length == 0) {
          // if there are no images returned
          clearBreed();
          $("#breed_data_table").append("<tr><td>Sorry, no Image for that breed yet</td></tr>");
        } else {
          //else display the breed image and data
          displayBreed(data[0])
        }
      });
    }
    // clear the image and table
    function clearBreed() {
      $('#breed_image').attr('src', "");
      $("#breed_data_table tr").remove();
    }
    // display the breed image and data
    function displayBreed(image) {
      $('#breed_image').attr('src', image.url);
      $("#breed_data_table tr").remove();
      var breed_data = image.breeds[0]
      $.each(breed_data, function (key, value) {
        // as 'weight' and 'height' are objects that contain 'metric' and 'imperial' properties, just use the metric string
        if (key == 'weight' || key == 'height') value = value.metric
        // add a row to the table
        //  $("#breed_data_table").append("<tr><td>" + key + "</td><td>" + value + "</td></tr>");
      });
    }
    // make an Ajax request
    function ajax_get(url, callback) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          //console.log('responseText:' + xmlhttp.responseText);
          try {
            var data = JSON.parse(xmlhttp.responseText);
          } catch (err) {
            // console.log(err.message + " in " + xmlhttp.responseText);
            return;
          }
          callback(data);
        }
      };
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
    }
    // call the getBreeds function which will load all the Dog breeds into the select control
    getBreeds();
  });

  $("#catBtn").on("click", function () {
    $(".img").addClass("active")
    var $breed_select = $('select.breed_select');
    $breed_select.change(function () {
      var id = $(this).children(":selected").attr("id");
      getDogByBreed(id)
    });
    // Load all the Breeds
    function getBreeds() {
      ajax_get('https://api.thecatapi.com/v1/breeds', function (data) {
        populateBreedsSelect(data)
      });
    }
    // Put the breeds in the Select control
    function populateBreedsSelect(breeds) {
      $breed_select.empty().append(function () {
        var output = '';
        $.each(breeds, function (key, value) {
          output += '<option id="' + value.id + '">' + value.name + '</option>';
        });
        return output;
      });
    }
    // triggered when the breed select control changes
    function getDogByBreed(breed_id) {
      // search for images that contain the breed (breed_id=) and attach the breed object (include_breed=1)
      ajax_get('https://api.thecatapi.com/v1/images/search?include_breed=1&breed_id=' + breed_id, function (data) {
        if (data.length == 0) {
          // if there are no images returned
          clearBreed();
          $("#breed_data_table").append("<tr><td>Sorry, no Image for that breed yet</td></tr>");
        } else {
          //else display the breed image and data
          displayBreed(data[0])
        }
      });
    }
    // clear the image and table
    function clearBreed() {
      $('#breed_image').attr('src', "");
      $("#breed_data_table tr").remove();
    }
    // display the breed image and data
    function displayBreed(image) {
      $('#breed_image').attr('src', image.url);
      $("#breed_data_table tr").remove();
      var breed_data = image.breeds[0]
      $.each(breed_data, function (key, value) {
        // as 'weight' and 'height' are objects that contain 'metric' and 'imperial' properties, just use the metric string
        if (key == 'weight' || key == 'height') value = value.metric
        // add a row to the table
        //$("#breed_data_table").append("<tr><td>" + key + "</td><td>" + value + "</td></tr>");
      });
    }
    // make an Ajax request
    function ajax_get(url, callback) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          //console.log('responseText:' + xmlhttp.responseText);
          try {
            var data = JSON.parse(xmlhttp.responseText);
          } catch (err) {
            // console.log(err.message + " in " + xmlhttp.responseText);
            return;
          }
          callback(data);
        }
      };
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
    }
    // call the getBreeds function which will load all the Dog breeds into the select control
    getBreeds();
  });
  // -------------------------------Heather's piece, functions that call the shelter information and the recent search images ------------------------------------------------------------
  $(".submitzip").on("click", async function () {
    var zip = $("#inputZip").val()
    console.log(zip)
    var shelters = await getShelters(zip);
    async function grabTokenAndSave() {
      // Heather's api key
      var key = 'jHsDsv3x049sgsDoXqL7UesDeYAnPqlD7HtVn1KZaYWAckm3sn';
      // Heather's client secret
      var secret = 'PT0XQYzl4U14cmCngVymX721rRyobtT1qDSfKeK3';
      // petfinder query that fetches a token
      var queryURL = "https://api.petfinder.com/v2/oauth2/token";
      // waits for the ajax call before setting the response as a variable
      var response = await $.ajax({
        url: queryURL,
        // post request
        method: 'POST',
        // here put in the api key and secret
        data:
          'grant_type=client_credentials&client_id=' +
          key +
          '&client_secret=' +
          secret,
      })
      // saves the token to local storage
      localStorage.setItem("token", response.access_token);
    }
    // function that takes in the user's zipcode
    async function getShelters(zip) {
      // gets the saved token from local storage
      var token = localStorage.getItem('token');
      console.log(token)
      // if there's no saved token in local storage, this calls grabTokenAndSave() and waits for it to be done, saving a new token
      if (token === null) {
        console.log('token is null')
        await grabTokenAndSave();
        token = localStorage.getItem('token');
        console.log('saved new token' + token);
      }
      var devBaseQueryURL = "https://cors-anywhere.herokuapp.com/"
      // endpoint -- shelters
      var petFinderEndpoint = "https://api.petfinder.com/v2/organizations?location=" + zip + "&distance=100";
      var queryURL = devBaseQueryURL + petFinderEndpoint;
      return $.ajax({
        type: "GET",
        url: queryURL,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + token,
        }
        // if the ajax call fails, we'll see an error in the console
      }).catch(async function (error) {
        console.log('in the error handler')
        console.log(error);
        await grabTokenAndSave();
        return $.ajax({
          type: "GET",
          url: queryURL,
          dataType: "json",
          headers: {
            Authorization: "Bearer " + token,
          }
        })
      }).then(function (shelterList) {
        // the names of organization are in an array
        var organizations = shelterList.organizations;
        for (var i = 0; i < organizations.length; i++) {
          var listOfShelters = $("#shelterlist")
          var currentOrg = organizations[i]
          console.log(organizations[i])
          var shelterItem = $("<li>").text(currentOrg.name)
          listOfShelters.append(shelterItem);
        }
      })
    }
  })
})