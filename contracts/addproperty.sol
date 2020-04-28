pragma solidity >=0.4.0 <=0.6.0;

contract addproperty {
    //Modeling The property 
    struct Property {
        uint Id;
        address payable propertyowner;
        bool isExist;
        bool checkin;
        string [] reviews;
        uint reviewCount;
    }

    struct PropertyDetails {
        string propertyname;
        string propertytype;
        string propertydesc;
        string propertyaddress;
        string propertycity; 
        uint rent;
        mapping (address => Member) members;

    }
    
    //Modeling the Member
    
    struct Member {
        uint memberid;
        bool checkinned;
    }

    
    //storing property
    mapping(uint=> Property) public properties;
    //storing property details
    mapping(uint =>PropertyDetails) public propertiesdet;
    //properties count
    uint public propertyCount;
    uint [] propertyIds;
    
    //adding Property
    function addingproperty(uint propertyId, string memory propertyname, string memory propertytype, string memory propertydesc, string memory propertyaddress,string memory propertycity, uint rent) public {
         require(properties[propertyId].isExist == false, "Property already exists");
         properties[propertyId].Id = propertyId;
         properties[propertyId].propertyowner = msg.sender;
         propertiesdet[propertyId].propertyname = propertyname;
         propertiesdet[propertyId].propertyaddress = propertyaddress;
         propertiesdet[propertyId].propertytype = propertytype;
         propertiesdet[propertyId].propertydesc = propertydesc;
         propertiesdet[propertyId].propertycity= propertycity;
         propertiesdet[propertyId].rent = rent;
         properties[propertyId].isExist = true;
         propertyCount+=1;
         propertyIds.push(propertyId);
    }
    
    //checkin
    function checking(uint propertyId) public  {
    
        propertiesdet[propertyId].members[msg.sender].checkinned = true;  //checkin for the member
        properties[propertyId].checkin = true; // checkin is for property
        }
        
    //adding review
    function addreview(uint propertyId, string memory review) public{
        // require(propertiesdet[propertyId].members[msg.sender].checkinned == true , "You haven't checked in in this property");
        properties[propertyId].reviews.push(review);
        properties[propertyId].reviewCount++;
    }
    
    //get review
    function getAReview(uint propertyId, uint index) public view returns (string memory review ){
        review = properties[propertyId].reviews[index];
        }    

    function getReviewsCountOfaProduct(uint propertyId) public view returns (uint reviewcount) {
        reviewcount = properties[propertyId].reviewCount;
    }
    
    
    function getproperty (uint propertyId) public view returns(uint Id, string memory propertyname, string memory propertytype, string memory propertydesc, string memory propertyaddress, string memory propertycity, uint rent, bool propertystatus) {
        Id = properties[propertyIds[propertyId]].Id;
        propertyname = propertiesdet[ propertyIds[propertyId] ].propertyname;
        propertytype = propertiesdet[ propertyIds[propertyId] ].propertytype;
        propertydesc = propertiesdet[propertyIds[propertyId]].propertydesc;
        propertyaddress = propertiesdet[propertyIds[propertyId]].propertyaddress;
        propertycity = propertiesdet[propertyIds[propertyId]].propertycity;
        rent = propertiesdet[propertyIds[propertyId]].rent;
        propertystatus = properties[propertyIds[propertyId]].checkin;
    }
    
}