App = {
  web3Provider: null,
  contracts: {},


  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    web3 = new Web3(App.web3Provider);

    return App.initContract();

  },

  initContract: function() {
    $.getJSON('addproperty.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PropertyArtifact = data;
      App.contracts.addproperty = TruffleContract(PropertyArtifact);
    
      // Set the provider for our contract
      App.contracts.addproperty.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      // return App.markAdopted();
      return App.init();

    });

    // return App.bindEvents();
      return App.AddPropButton();

  },
  init: async function() {
    var propInstance;

    App.contracts.addproperty.deployed().then(function(instance){
      propInstance = instance;
      return propInstance.propertyCount();
    }).then(function(result){

      var counts = result.c[0];
      console.log("Total Properties : "+counts);

      for (i = 0; i < counts; i ++) {

         App.GetProperty(i);
      }
    });
     return App.bindEvents();  
  },

  GetProperty:function(index){
    App.contracts.addproperty.deployed().then(function(instance){
          propInstance = instance;
          return propInstance.getproperty(index);
        }).then(function(result){
          // console.log(result);
          console.log("Name : "+result[1]);
          console.log("Type : "+result[2]);
          console.log("Desc : "+result[3]);
          console.log("address : "+result[4]);
          console.log("City : "+result[5]);
         // console.log("Rent : "+result[6]);
          //console.log("Property Status:"+result[7]);

 
    
        });
  },

  bindEvents: function() {
    $(document).on('click', '.marginAuto1', App.checkIn);
  },

    checkIn: function(event) {
    event.preventDefault();

    var propId = parseInt($(event.target).data('id'));
    var propInstance;
      App.contracts.addproperty.deployed().then(function(instance) {
        propInstance = instance;
        //var price = parseInt($(event.target).data('attribute'));
        //alert(price)
        // Execute adopt as a transaction by sending account
        return propInstance.checking(propId);
      }).then(function(result) {
        //return App.markcheckin();
        console.log("checkin");
      });
  },


  AddReview: function(){

    var review = document.getElementById('RText').value;
    var id = this.id;
    var propInstance;
      App.contracts.addproperty.deployed().then(function(instance) {
        propInstance = instance;
        // Execute adopt as a transaction by sending account
        return propInstance.addreview(id, review);
      }).then(function(result) {
        console.log("Reviewed");
       console.log(result);

      var myReview = JSON.stringify(result);
         alert(myReview);


            

      });
      App.GetReviews(id);
  },

  GetReviews: function(id) {
    // var id = this.id;
    var propInstance;
      App.contracts.addproperty.deployed().then(function(instance) {
        propInstance = instance;
        return propInstance.getReviewsCountOfaProduct(id);
      }).then(function(result) {

        counts = result.c[0]
        console.log("Total Reviews : "+counts);
        for (i = 0; i < counts; i ++) {
          App.GetOneReview(id,i);
        }
      });
  },

  GetOneReview:function(id,index){
    var propInstance;
      App.contracts.addproperty.deployed().then(function(instance) {
        propInstance = instance;
        return propInstance.getAReview(id,index).then(function(result) {
        console.log("Reviews:" +result);
       
         // var reviewrow = $('#ReviewRow');
         //  var revTemplate = $('#reviewTemplate');
         //  revTemplate.find('.reviewholder').text(result[0]);
         //   reviewrow.append(revTemplate.html());

      });
      });
  },



  AddPropButton: function() {
    $(document).on('click', '.add', App.handleAdd);
  },

    handleAdd: function(event) {
    var e = document.getElementById('Types');
        var resultType = e.options[e.selectedIndex].text;
        // var type= resultType.value;

    var e2 = document.getElementById('cities');
        var resultCity = e2.options[e2.selectedIndex].text;
        // var city = resultCity.value;
    
    //var id = document.getElementById('OtherInformation').value
    var name = document.getElementById('Name').value
    
    var desc = document.getElementById('Des').value
    var address = document.getElementById('Address').value
   
    var id = document.getElementById('Price').value

    var propInstance;
    App.contracts.addproperty.deployed().then(function(instance){
      propInstance = instance;
      return propInstance.addingproperty(id, name, resultType, desc, address, resultCity);
     
     


    }); 
    console.log("Property added to blockchain..");
    
      

    
  },



};

$(function() {
  $(window).load(function() {
    App.initWeb3();
  });
});

$(document).on('click', '.btn__submit', App.AddReview);
// $(document).on('click', '.get-all-reviews', App.GetReviews);