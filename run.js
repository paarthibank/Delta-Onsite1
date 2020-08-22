var exp=require("express");
var mysql=require("mysql");
var reqq=require("request");
var bodyparser=require("body-parser");
var token="Bearer BQAwTiug4v8Y3vWcIth9-NbMFD4EI7F6u97vdgPgkWAHblfTHUkuxIqzw9F_4NuWAwAOVgydajJjCgfLT-sMd59y24bqOsy7jSbHJD7YoDGd96p9pl42d39cHkNh-lLcGqRlSlEuX83vFMQS-Lcgpic4cjpVyOw"
var id1="00hL0oJD4pWef0kPYIaSTy";
var id2="3m49WVMU4zCkaVEKb8kFW7";
var no=0;
var finish=0,ans=[],art=[id1];
var dataa={
	art:art,
	finish:finish,
	id2:id2
};
var ww;
con=exp();
con.use(bodyparser.json());
con.use(bodyparser.urlencoded({extended: true}));
con.use(exp.static("public"));

var sql=mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Arizona"
})
sql.connect(function(err) {
  if (err) {
  	console.log(err);
  }
  console.log("Connected!");
});
con.get("/",function(req,res){
	res.render("open.ejs");
	res.end();
})
con.post("/get",async function(req,response){
	
	var i1=[req.body.id1];
	var i2=req.body.id2;
	var dat={
		art: i1,
		id2:i2,
		finish:no
	};
	var a=check(dat);
	function check(dat){
		var i=0;j=0;
		var ans=[];
		var data;
		var art=[];
		var no=0;
		for(j=0;j<dat.art.length;j++){
			if(no==1){
				break;			
			}
		var x=reqq({url:"https://api.spotify.com/v1/artists/"+dat.art[j]+"/related-artists",headers:{"Authorization":token}},function(err,res){
			if(err) throw err;
			
			
			var name=JSON.parse(res.body);
					
			if(name.artists){
			for(i=0;i<name.artists.length;i++){
				if(no==1){
					break;
				}
				console.log(j+"="+i);
				
				
				if(name.artists[i].id==dat.id2){
					
						dat.finish=1;
						ans.push(name.artists[i].name);
						
						no=1;
						data={
							ans:ans,
							finish:no
						};
						ww={
							fr:i,
							en:j,
							id1:i1,
							id2:i2
						}
						console.log(i+"="+j+"success");
						response.redirect("/final");
						response.end();
						break;
									
				}
				
				else{
					
						art.push(name.artists[i].id);
						data={
							art:art,
							id2:id2,
							finish:no
						}

						
						
					
					
				}
			}
			}
			

			if(j>=dat.art.length-1){
				if(no!=1){
					check(data);
				}
				else{
					return 1;
				}
			}				

		})
		if(no==1){
			break;
		}
		

		
		

	}
	if(no==1)
		return 1;

	}

	
})
con.get("/final",function(req,response){
	var k=[];
	console.log(ww);
	var inu=ww.en+1;
	var fin=ww.fr;
	var id1=ww.id1[0];
	var id2=ww.id2;
	if(inu<1){
		reqq({url:"https://api.spotify.com/v1/artists/"+id1+"/related-artists",headers:{"Authorization":token}},function(err,res){
			var name=JSON.parse(res.body);
			k.push(name.artists[fin].name);
			console.log(name.artists[0].name);
			var f={
				k:k
			};
			response.render("path.ejs",f);
			response.end();

		})
	}
	else if(inu<20){
		reqq({url:"https://api.spotify.com/v1/artists/"+id1+"/related-artists",headers:{"Authorization":token}},function(err,res){
			var name=JSON.parse(res.body);
			console.log(name.artists[0].name);
			k.push(name.artists[inu].name);
			var bv=name.artists[inu].id
			reqq({url:"https://api.spotify.com/v1/artists/"+bv+"/related-artists",headers:{"Authorization":token}},function(err,res){
				var name=JSON.parse(res.body);
				console.log(fin);
				k.push(name.artists[fin].name);
				var f={
				k:k
				};
				response.render("path.ejs",f);
				response.end();
			})
			

		})
	}
	else if(inu<400){
		var nit=inu%20;
		var nir=parseInt(inu/20-1);
		console.log(nir);
		reqq({url:"https://api.spotify.com/v1/artists/"+id1+"/related-artists",headers:{"Authorization":token}},function(err,res){
			var name=JSON.parse(res.body);
			k.push(name.artists[nir].name);
			var bv=name.artists[nir].id
			reqq({url:"https://api.spotify.com/v1/artists/"+bv+"/related-artists",headers:{"Authorization":token}},function(err,res){
				var name=JSON.parse(res.body);
				console.log(name.artists[0].name);
				k.push(name.artists[nit].name);
				var bvv=name.artists[nit].id;
				reqq({url:"https://api.spotify.com/v1/artists/"+bvv+"/related-artists",headers:{"Authorization":token}},function(err,res){
					var name=JSON.parse(res.body);
					console.log(name.artists[0].name);
					k.push(name.artists[fin].name);
					var f={
					k:k
					};
					response.render("path.ejs",f);
					response.end();
				})
			

		})

	})
	}
	else{
		res.send("too big link");
		res.end();
	}
})




	






//api.spotify.com/v1/artists/{id}/related-artists



con.listen(3000)