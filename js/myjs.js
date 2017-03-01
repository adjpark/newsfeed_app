//____________________________________User input module (FB, Google Map, and user input)___________________________________
var UserModule = React.createClass({
    render:function(){
        return(
            <div className="col-sm-4" id="userModule">
                <img id="userImg" src={this.props.imgInfo} />
                <div id="printUserName">{this.props.usernameInfo}</div>
                <input className="form-control" onKeyUp={this.props.grabInfo} id="username" placeholder="Enter your username."/>
                <input className="form-control" onKeyUp={this.props.grabInfo} id="avatar" placeholder="Enter image link."/>
                <input className="form-control" onKeyUp={this.props.grabInfo} id="country" placeholder="Enter country."/>
                <button className="btn btn-primary" onClick={this.props.fbFunc} id="fbLogin">Grab info from Facebook</button>
                <div id="googleMap"></div> 
            </div>
        )
    }
})

//___________________________________Post module (post message)___________________________________
var PostModule = React.createClass({
    render:function(){
        var messageDiv = this.props.msgListInfo.map(function(obj,index){
            return(
                <div key={index} className="panel panel-default">
                    <div className="panel-heading">
                        <img id="postImg" height="50" width="50" src={obj.avatar} />
                        <span id="postCountry">
                            <b>From: </b> 
                            {obj.country}
                        </span> 
                    </div>
                    <div id="postMessage" className="panel-body">
                        {obj.message}
                    </div>
                    <div id="postUsername" className="panel-footer">
                        <b>By: </b>
                        {obj.username}
                    </div>
                </div>
            )
        })
        
        return(
            <div className="col-sm-8" id="postModule">
                <textarea className="form-control" id="postArea" placeholder="Type a post"></textarea>
                <button className="btn btn-primary" onClick={this.props.postMsg} id="postBut">Post</button>
                <div id="postedMsgs">
                    {messageDiv}
                </div>
            </div>
        )
    }
})

//___________________________________App module (post module and user module)___________________________________
var App = React.createClass({
//___________________________________Ajax call for grabbing posts on DB___________________________________
    getInitialState:function(){
        var self = this;
        $.ajax({
            url:"post.php",
            type:"POST",
            data:{
                type: "download"
            },
            dataType:"json",
            success:function(resp){
                self.setState({
                    msgList : resp
                })
            }
        });
//___________________________________Variable to watch over___________________________________       
        return{
            userName:"No name",
            imgLink:"",
            country:"",
            msgList:[]
        }    
    },
//___________________________________Grab new input info and set new state___________________________________
    grabInfo:function(){
        var username = document.getElementById("username").value;
        var avatar = document.getElementById("avatar").value;
        var country = document.getElementById("country").value;
        
        this.setState({
            userName:username,
            imgLink:avatar,
            country:country
        })
    },
//___________________________________Grab post and input values and set new state for post array___________________________________
    postMsg:function(){
        var postArea = document.getElementById("postArea").value;
        var imgInput = document.getElementById("avatar").value;
        var nameInput = document.getElementById("username").value;
        var countryInput = document.getElementById("country").value;
        
        var stateMsgList = this.state.msgList;
        
        var postObj = {
            username:nameInput,
            avatar:imgInput,
            country:countryInput,
            message:postArea
        }
        
        stateMsgList.push(postObj);
        
        this.setState({
            msgList: stateMsgList 
            
        });
        
//___________________________________Ajax call for posting values to DB___________________________________    
        $.ajax({
            url:"post.php",
            type:"post",
            data:{
                type: "upload",
                username: postObj.username,
                avatar: postObj.avatar,
                country: postObj.country,
                message: postObj.message
            },
            dataType:"json",
            success:function(resp){
                console.log(resp);
            }
        })
        
        document.getElementById("postArea").value = "";
    },
//___________________________________Window FB object___________________________________ 
    facebookFunction: function() {
      window.fbUser = {
            userID: "",
            userName: "",
            userPicture:""
        }
      
      var self = this;
//___________________________________Connecting FB API___________________________________   
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '720626808112993',
          xfbml      : true,  
          version    : 'v2.8'
        });
          console.log(FB);
              FB.login(function(resp){
                  if(resp.status == "connected"){
                          FB.api("/me?fields=id,name,picture",
                            function(uresp){
                              
                                  console.log(uresp)
                                  window.fbUser.userID = uresp.id;  
                                  window.fbUser.userName = uresp.name;
                                  window.fbUser.userPicture = uresp.picture.data.url;
                              
                                  var avatar = document.getElementById("avatar");
                                  var username = document.getElementById("username");
                                  avatar.value = window.fbUser.userPicture;
                                  username.value = window.fbUser.userName;
                              
                                    self.setState({
                                        userName:window.fbUser.userName,
                                        imgLink:window.fbUser.userPicture
                                    })
                          });
                  }
              })
      }; // remember to include semicolon it breaks the code if you dont
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    },
    render:function(){
//___________________________________Passing variables and functions___________________________________   
        return(
            <div>
                <UserModule 
                    usernameInfo={this.state.userName} 
                    imgInfo={this.state.imgLink} 
                    countryInfo={this.state.country} 
                    grabInfo={this.grabInfo}
                    fbFunc = {this.facebookFunction}
                />
                <PostModule 
                    msgListInfo={this.state.msgList} 
                    postMsg = {this.postMsg}
                />
            </div>
        )
    }
})

//___________________________________Print app on html__________________________________   
ReactDOM.render(
    <App />,
    document.getElementById("display")
)

//___________________________________Load google map__________________________________  
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {lat: 48.998634, lng: -123.024824},
        zoom: 3
    });
    
//___________________________________Google geocorder__________________________________  
    var geoCoder = new google.maps.Geocoder();

    google.maps.event.addListener(map, 'click', function(event) {
      geoCoder.geocode({
          'latLng': event.latLng
        },

        function(results, status) {
          var location = results[0].address_components;
          console.log(results[0].address_components);
          for (var i = location.length - 1; i >= 0; i--) {
            if (location[i].types.indexOf("country") != -1) {
              document.getElementById("country").value = location[i].long_name;
            }
          }
        });
    });
}

initMap();