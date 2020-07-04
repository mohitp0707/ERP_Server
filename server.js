var express = require('express');
var app = express();
var sql = require("mssql");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
global.CO=1;
global.UID='Mohit';
global.FY=1;
	
	
  var config = {
        user: 'mohit',
        password: 'mohit123',
        server: 'DESKTOP-4ULIIM4\\SQLEXPRESS', 
        database: 'textile' ,
    options: {
        encrypt: true,
		abortTransactionOnError: true,
		enableArithAbort: true
    }
 };
  
  
	var connection = sql.connect(config, function (err) {
		if (err)
			throw err; 
	});
	
	app.use(function (req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,contentType,Content-Type, Accept, Authorization");  
    next();  
	});  

	


app.get('/api/Costcenter', function (req, res) {
        var request = new sql.Request();  
        request.query("select CO_ID,CO_CN from CO where CO_ST='Active'", function (err, recordset) {
            if (err) console.log(err)
			else res.send(recordset);	
		})
    });

	app.get('/api/FY', function (req, res) {
        var request = new sql.Request();  
        request.query("select FY_ID,FY_FT from FY", function (err, recordset) {
            if (err) console.log(err)
			else res.send(recordset);		
			})
    });


app.post('/api/userAuth' ,function (req, res) {
 var input=req.body;
 var user=input.user;
 var pass=input.password; 
 CO=input.CO;
 FY=input.FY;
 UID=input.user;
        var request = new sql.Request();
        request.query("select count(*) As count from usr where usr_Name='" +user + "' COLLATE SQL_Latin1_General_CP1_CS_AS and usr_pass='" +pass+ "' COLLATE SQL_Latin1_General_CP1_CS_AS and USR_ST='Active'", function (err, recordset) {
            if (err){ console.log(err); console.log("error");	
			}
			else{	
			res.send(recordset);
			}
    });
});

app.get('/api/itemId', function (req, res) {
        var request = new sql.Request();  
        request.query("SELECT MAX(convert(int,substring(IM_ID,3,len(isnull(IM_ID,0))))) As ID FROM dbo.IM where IM_CO='"+CO+"'", function (err, recordset) {
            if (err) console.log(err)
			else
			{
			if(recordset.recordset[0].ID==0){
				recordset.recordset[0].ID=1;
				res.send(recordset);
			}
			else
			{
				recordset.recordset[0].ID++;
				res.send(recordset);
			}}
        });
});

app.post('/api/itemInsert', function (req, res) { 
 var input=req.body;
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input.IM_ID)
   request.input('name', sql.VarChar(250), input.IM_NM)
   request.input('unit', sql.VarChar(50), input.IM_UM)
   request.input('cat', sql.VarChar(50), input.IM_CAT)
   request.input('typ', sql.VarChar(50), input.IM_TYP)
   request.input('brnd', sql.VarChar(50), input.IM_BRND)
   request.input('prtype', sql.VarChar(50), input.IM_PRTYP)
   request.input('hsn', sql.VarChar(50), input.IM_HSN)
   request.input('shnm', sql.VarChar(100), input.IM_SHNM)
   request.input('tax', sql.VarChar(50), input.IM_TAX)
   request.input('taxtyp', sql.VarChar(50), input.IM_TAXTYP)
   request.input('desc', sql.VarChar(250), input.IM_DESC)
   request.input('status', sql.VarChar(250), input.IM_STATUS)
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(100), UID)
   request.input('minstck', sql.Decimal(18,4), input.IM_MINSTK)
 request.execute('dbo.IM_Insert', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});


app.post('/api/GodownInsert', function (req, res) { 
 var input=req.body;
 // create Request object
 var request = new sql.Request();
   request.input('name', sql.VarChar(50), input.name)
   request.input('address', sql.VarChar(250), input.address)
   request.input('building', sql.VarChar(50), input.building)
   request.input('floor', sql.VarChar(50), input.floor)
   request.input('chamber', sql.VarChar(50), input.chamber)
   request.input('status', sql.VarChar(50), input.Status)
   request.input('length', sql.VarChar(50), input.length)
   request.input('widht', sql.VarChar(50), input.width)
   request.input('height', sql.VarChar(100), input.height)
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
   request.input('typ', sql.VarChar(100), input.type)
  
 // query to the database and get the data
 request.execute('dbo.GM_Insert', function (err, recordset) {
 
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/Godown', function (req, res) {
        var request = new sql.Request();  
        request.query("select * from GM where GM_CO='"+CO+"' and GM_STATUS='Active' order by GM_Name asc ", function (err, recordset) {
            if (err) {console.log(err); }
			else { res.send(recordset); }
					
			})
 });
	
app.get('/api/Godowncoal', function (req, res) {

        var request = new sql.Request();  
        request.query("select * from GM where GM_CO='"+CO+"' and GM_STATUS='Active' and GM_Typ='Coal Godown' ", function (err, recordset) {
            if (err) {console.log(err); }
			else { res.send(recordset); }
					
			})
 });
	
app.put('/api/itemInsert/:id', function (req, res) { 
 var id=req.params.id;
 var input=req.body;
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), id)
   request.input('name', sql.VarChar(250), input.IM_NM)
   request.input('unit', sql.VarChar(50), input.IM_UM)
   request.input('cat', sql.VarChar(50), input.IM_CAT)
   request.input('typ', sql.VarChar(50), input.IM_TYP)
   request.input('brnd', sql.VarChar(50), input.IM_BRND)
   request.input('prtype', sql.VarChar(50), input.IM_PRTYP)
   request.input('hsn', sql.VarChar(50), input.IM_HSN)
   request.input('shnm', sql.VarChar(100), input.IM_SHNM)
   request.input('tax', sql.VarChar(50), input.IM_TAX)
   request.input('taxtyp', sql.VarChar(50), input.IM_TAXTYP)
   request.input('desc', sql.VarChar(250), input.IM_DESC)
   request.input('status', sql.VarChar(250), input.IM_STATUS)
   request.input('co', sql.VarChar(50), CO)
   request.input('uid', sql.VarChar(100), UID)
   request.input('minstk', sql.Decimal(18,4), input.IM_MINSTK)
 request.execute('dbo.IM_Update', function (err, recordset) {
 
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});
app.get('/api/itemMaste',function (req, res) {
        var request = new sql.Request();  
        request.query("select IM_ID,IM_UM,IM_HSN,IM_TAX,IM_NM,IM_CAT,IM_TYP,IM_TAXTYP from IM  where IM_CO='"+CO+"' order by IM_NM asc", function (err, recordset) {
            if (err){ 
			console.log(err);
			}
			else{ 
			res.send(recordset);
			}		
			})
 });
	

app.get('/api/Inventory_Products_Retreive/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.ITM_Retrieve', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
		 res.send(recordset);
		 }
		 });
	});

	app.get('/api/Inventory_Products', function (req, res) {
        var request = new sql.Request();  
        request.query("select IM_ID,IM_UM,IM_HSN,IM_TAX,IM_NM,IM_CAT,IM_TYP,IM_IFOR,convert(decimal(18,2),isnull(AIMS_QTY,0)) as qty from IM left join AIMSR on (IM_ID=AIMS_ITM and IM_CO=AIMS_CO) where IM_CO='"+CO+"' and IM_STATUS='Active' and AIMS_WH='Store Godown' ", function (err, recordset) {
            if (err){ 
			console.log(err);
			}
			else{ 
			res.send(recordset);
			}		
			})
    });
	
	app.get('/api/Inventory_ProductsWithdate', function (req, res) {
		var data=JSON.parse(req.query.filter);
		console.log(data);
		var wh=data.GR_WH;
		var tdate=data.GR_Date;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('wh', sql.VarChar(50), wh)
		 request.input('tdate', sql.VarChar(50), tdate)
		 request.execute('dbo.Inventory_Productsdateopening', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		  }
		 });
	})
	
	
	app.get('/api/filterInventory_Products', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select * from IM where IM_CO='"+CO+"' and IM_STATUS='Active' and IM_TYP='"+type+"'", function (err, recordset) {
			
			if (err) { 
				console.log(err);
			}
			else{
				res.send(recordset);
			}          
        });
    });
app.get('/api/InventoryProductNotGrey', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select IM_ID,IM_NM,IM_UM,convert(decimal(18,2),isnull(AIMS_QTY,0)) as qty,IM_IFOR,IM_CAT,IM_TYP,IM_TAX from IM left join AIMSR on (IM_ID=AIMS_ITM and IM_CO=AIMS_CO) where IM_CO='"+CO+"' and IM_STATUS='Active' and IM_TYP!='"+type+"'", function (err, recordset) {
			if (err) { 
				console.log(err);
			}
			else{
				res.send(recordset);
			}
        });
    });
	
app.get('/api/InventoryProductInvoice', function (req, res) {
	var type=req.query.filter;
       var request = new sql.Request();  
        request.query("select IM_ID,IM_NM,IM_UM,IM_IFOR,IM_CAT,IM_TYP,IM_TAX,IM_TAXTYP,convert(decimal(18,2),isnull(TAX_IGST,0)) as igst,convert(decimal(18,2),isnull(TAX_SGST,0)) as sgst,convert(decimal(18,2),isnull(TAX_CGST,0)) as cgst from IM left join TAX on (IM_TAX=TAX_ID and IM_CO=TAX_CO) where IM_CO='"+CO+"' and IM_STATUS='Active' and IM_TYP!='"+type+"'", function (err, recordset) {
			
			if (err) { 
				console.log(err);
			}
			else{
				res.send(recordset);
			}
        });
    });
	
app.get('/api/InventoryProductNotGreyWithGodown', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select IM_ID,IM_NM,IM_UM,convert(decimal(18,2),isnull(AIMS_QTY,0)) as qty,isnull(AIMS_AGSTPRATE,0) as rate,IM_TYP from IM left join AIMSR on (IM_ID=AIMS_ITM and IM_CO=AIMS_CO) where IM_CO='"+CO+"' and IM_STATUS='Active' and IM_TYP!='Grey Material' and AIMS_WH='"+type+"' ", function (err, recordset) {	
			if (err) { 
				console.log(err);
			}
			else{
				res.send(recordset);
			}
		});
});

app.get('/api/InventoryProductNotGreyWithGodownandDate', function (req, res) {
		var data=JSON.parse(req.query.filter);
		console.log(data);
		var wh=data.GR_WH;
		var tdate=data.GR_Date;
		console.log(tdate);
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('wh', sql.VarChar(50), wh)
		 request.input('tdate', sql.VarChar(50), tdate)
		 request.execute('dbo.itemstockdatewise', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		  }
		 });
	})
	
	
app.get('/api/COALITM', function (req, res) {
	var type=req.query.filter;
         var request = new sql.Request();  
        request.query("select IM_ID,IM_NM,IM_UM,convert(decimal(18,2),isnull(AIMS_QTY,0)) as qty from IM left join AIMSR on (IM_ID=AIMS_ITM and IM_CO=AIMS_CO) where IM_CO='"+CO+"' and IM_STATUS='Active' and IM_TYP='COAL' and AIMS_WH='"+type+"' ", function (err, recordset) {			
			if (err) { 
				console.log(err);
				}
			else{
				res.send(recordset);
			}
        });
    });
	
app.get('/api/WATERITM', function (req, res) {
           var request = new sql.Request();  
        request.query("select IM_ID,IM_NM,IM_UM,convert(decimal(18,2),isnull(AIMS_QTY,0)) as qty from IM left join AIMSR on (IM_ID=AIMS_ITM and IM_CO=AIMS_CO) where IM_CO='"+CO+"' and IM_STATUS='Active' and IM_TYP='WATER' ", function (err, recordset) {
			
			if (err) { 
				console.log(err);
			}
			else{
				res.send(recordset);
			}
	    });
 });
	
	app.get('/api/Inventory_Products/:id', function (req, res) {
	var id=req.params.id;
        var request = new sql.Request();  
        request.query("select * from IM where IM_CO='"+CO+"' and IM_ID='"+id+"' and IM_STATUS='Active'", function (err, recordset) {
            if (err) console.log(err)
			else res.send(recordset);
			})  
        });

app.delete('/api/deleteItem/:id', function (req, res) {
	var id=req.params.id;
        var request = new sql.Request();  
        request.query("delete  from IM where IM_ID='"+id+"' and  IM_CO='"+CO+"'", function (err, recordset) {
            if (err){ console.log(err); }
			else
			{	
				return res.send(recordset);
			}})
  });

 
	app.get('/api/partyId/:PM_TYPE', function (req, res) {
		var type=req.params.PM_TYPE;
        var request = new sql.Request();  
        request.query("SELECT isnull(MAX(convert(int,substring(PM_ID,2,len(isnull(PM_ID,0))))),0) As PM_ID FROM dbo.PM where PM_CO='"+CO+"' and PM_TYPE='"+type+"' ", function (err, recordset) {
            if (err) console.log(err)
			else
			{
				recordset.recordset[0].PM_ID++;
				res.send(recordset);
			}
    });
	});
	
 app.post('/api/partyInsert', function (req, res) { 
 var input=req.body;
  console.log(input);

 // create Request object
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input.PM_ID)
   request.input('typ', sql.VarChar(50), input.PM_TYPE)
   request.input('name', sql.VarChar(50), input.PM_NAME)
   request.input('email', sql.VarChar(50), input.PM_EMAIL)
   request.input('mob', sql.VarChar(50), input.PM_MOBILE)
   request.input('dob', sql.VarChar(50), input.PM_DOB)
   request.input('web', sql.VarChar(50), input.PM_WEB)
   request.input('fax', sql.VarChar(50), input.PM_FAX)
   request.input('add', sql.VarChar(50), input.PM_ADD)
   request.input('loc', sql.VarChar(50), input.PM_LOC)
   request.input('area', sql.VarChar(100), input.PM_AREA)
   request.input('city', sql.VarChar(50), input.PM_CITY)
   request.input('state', sql.VarChar(50), input.PM_STATE)
   request.input('country', sql.VarChar(50), input.PM_COUNTRY)
   request.input('pin', sql.VarChar(50), input.PM_PIN)
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(100), UID)
   request.input('status', sql.VarChar(50), input.PM_STATUS)
   request.input('ptyp', sql.VarChar(50), input.PM_PTYP)
   request.input('gstNo', sql.VarChar(50), input.PM_GST)
   request.input('panNo', sql.VarChar(50), input.PM_PANNO)
   request.input('bkrId', sql.VarChar(50), input.BrokName)
 request.execute('dbo.PM_Insert', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

 app.get('/api/Party', function (req, res) {
	var type=req.query.filter;
      var request = new sql.Request();  
        request.query("select * from PM where PM_CO='"+CO+"' and PM_TYPE='"+type+"' and PM_STATUS='Active' and PM_PTYP!='Grey Material'", function (err, recordset) {
            if(err) { 
				console.log(err);
		
			}else
			{
				res.send(recordset);
			}})
 });
		
	
app.get('/api/PartyAll', function (req, res){
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select *,dbo.[BrokerName](PM_BrkID,'"+CO+"') as PM_NAME1 from PM where PM_CO='"+CO+"' and PM_TYPE='"+type+"' order by ltrim(PM_NAME)  asc", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
   });
	
 app.get('/api/PartyName', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select PM_NAME from PM where PM_CO='"+CO+"' and PM_TYPE='"+type+"' ", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
				}})
    });
	
 app.get('/api/employeeName', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select EM_Name from EM where EM_CO='"+CO+"'  ", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
    });
	
 app.get('/api/productName', function (req, res) {
	var type=req.query.filter;
	var request = new sql.Request();  
        request.query("select IM_NM from IM where IM_CO='"+CO+"' ", function (err, recordset) {
            if(err) { 
				console.log(err);
				}else
			{
				res.send(recordset);
			}})
	});
	

 app.get('/api/categoryName', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select CAT_Name from Category where CAT_CO='"+CO+"' ", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
    });

app.get('/api/AllcategoryName', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select CAT_Name,CAT_PName from Category where CAT_CO='"+CO+"' ", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
    });
	
 app.get('/api/taxName', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select TAX_Name from TAX where TAX_CO='"+CO+"' ", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
    });

 app.get('/api/getMachineName', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select Machine_name from MachineMaster where Machine_CO='"+CO+"' ", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
  });
 app.get('/api/getAllMachineName', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select  MAchine_ID as id,Machine_name,Machine_srNo,Machine_Status as status1,convert(varchar(20),Machine_Pdate,106) as Machine_PDate,Machine_Mtyp from MachineMaster where MACHINE_CO='"+CO+"'", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
    });

 app.get('/api/getAllStorage/:id', function (req, res) {
	var id=req.params.id;
        var request = new sql.Request();  
        request.query("select GM_Name as name,GM_ID as id,GM_Typ as type,GM_Add as address,GM_Building as building,GM_Floor as floor,GM_Status as chamber,GM_Status as Status,GM_Length as length,GM_Width as width,GM_Height as height from GM where GM_CO='"+CO+"' and GM_ID='"+id+"' ", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
    });	

 app.get('/api/getStorageName', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select GM_Name from GM where GM_CO='"+CO+"' ", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
    });	

app.get('/api/GreyParty', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select * from PM where PM_CO='"+CO+"' and PM_TYPE='"+type+"' and PM_STATUS='Active' and PM_PTYP='Grey Material'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
    });
	
app.get('/api/waterParty', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select * from PM where PM_CO='"+CO+"' and PM_TYPE='"+type+"' and PM_PTYP='water Supp'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
    });
	
app.get('/api/employee', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select EM_ID,EM_NAME from EM where EM_CO='"+CO+"' and EM_ST='Active'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
 });
	
app.get('/api/Taxdetails', function (req, res) {		
	var id=req.query.filter;
	var request = new sql.Request();  
        request.query("select convert(decimal(18,2),isnull(TAX_IGST,0)) as igst,convert(decimal(18,2),isnull(TAX_SGST,0)) as sgst,convert(decimal(18,2),isnull(TAX_CGST,0)) as cgst from Tax where TAX_CO='"+CO+"' and TAX_ID='"+id+"'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
    });

app.get('/api/Party/:PM_ID', function (req, res) {
		var id=req.params.PM_ID;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.Party_Retrieve', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
		 res.send(recordset);
		 }
		 });
});

 app.put('/api/partyupdate/:id', function (req, res) { 
 var input=req.body;
 // create Request object
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input.PM_ID)
   request.input('typ', sql.VarChar(50), input.PM_TYPE)
   request.input('name', sql.VarChar(50), input.PM_NAME)
   request.input('email', sql.VarChar(100), input.PM_EMAIL)
   request.input('mob', sql.VarChar(50), input.PM_MOBILE)
   request.input('dob', sql.VarChar(50), input.PM_DOB)
   request.input('web', sql.VarChar(50), input.PM_WEB)
   request.input('fax', sql.VarChar(50), input.PM_FAX)
   request.input('add', sql.VarChar(50), input.PM_ADD)
   request.input('loc', sql.VarChar(50), input.PM_LOC)
   request.input('area', sql.VarChar(100), input.PM_AREA)
   request.input('city', sql.VarChar(50), input.PM_CITY)
   request.input('state', sql.VarChar(50), input.PM_STATE)
   request.input('country', sql.VarChar(50), input.PM_COUNTRY)
   request.input('pin', sql.VarChar(250), input.PM_PIN)
   request.input('co', sql.VarChar(100), CO)
   request.input('uid', sql.VarChar(100), UID)
   request.input('status', sql.VarChar(50), input.PM_STATUS)
   request.input('ptyp', sql.VarChar(50), input.PM_PTYP)
   request.input('gstNo', sql.VarChar(50), input.PM_GST)
   request.input('panNo', sql.VarChar(50), input.PM_PANNO)
   request.input('bkrId', sql.VarChar(50), input.BrokName)
 // query to the database and get the data
 request.execute('dbo.PM_update', function (err, recordset) {
 
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

	app.get('/api/GrayBatchNo', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select isnull(MAX(convert(int,substring(GR_Batch,3,len(isnull(GR_Batch,0))))),0) As ID from GRC where GR_CO='"+CO+"' and GR_FY='"+FY+"' ", function (err, recordset) {
            if (err){
				console.log(err)
			}
			else{
			res.send(recordset);
			}		
			})
    });


 app.post('/api/greyReceive', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('IM_ID', sql.VarChar(50));  
	tvp_item.columns.add('quantity', sql.Decimal(18, 4)); 
	tvp_item.columns.add('unit', sql.VarChar(50));
	
 for (var i = 0; i <input.RecQtyList.length; i++) {  
	   tvp_item.rows.add( input.RecQtyList[i].IM_ID , input.RecQtyList[i].quantity,input.RecQtyList[i].unit);  
	} 
 // create Request object
 console.log(input.GR_Date);
 console.log(input.GR_Chdate);
 var request = new sql.Request();
   request.input('supp', sql.VarChar(50), input.PM_ID)
   request.input('date', sql.VarChar(50), input.GR_Date)
   request.input('batch', sql.VarChar(50), input.GR_Batch)
   request.input('challNo', sql.VarChar(250), input.GR_ChallNo)
   request.input('chdate', sql.VarChar(50), input.GR_Chdate)
   request.input('co', sql.VarChar(100), CO)
   request.input('uid', sql.VarChar(100), UID)
   request.input('FY', sql.VarChar(100), FY)
   request.input('RecQtyList',tvp_item)
   request.input('totQty', sql.VarChar(250), input.GR_TQTY) 
   request.input('pcs', sql.VarChar(250), input.pcs)
   request.input('meter', sql.Decimal(18, 4), input.TMeter)
   request.input('vehicle', sql.VarChar(100), input.vhNo)
   request.input('process', sql.VarChar(100), input.process)
   request.input('width', sql.Decimal(18,4), input.GR_Width)
   request.input('warehouse', sql.VarChar(100), input.GR_WH)
   request.input('quality', sql.VarChar(100), input.quality)
   request.input('rmk', sql.VarChar(250), input.GR_Rmk)
 // query to the database and get the data
 request.execute('dbo.GR_insert', function (err, recordset) {
 
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});

app.post('/api/greyReceiveUpdate', function (req, res) { 
 var input=req.body;
 
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('IM_ID', sql.VarChar(50));  
	tvp_item.columns.add('quantity', sql.Decimal(18, 4)); 
	tvp_item.columns.add('unit', sql.VarChar(50));
	
 for (var i = 0; i <input.RecQtyList.length; i++) {  
	   tvp_item.rows.add( input.RecQtyList[i].IM_NM, input.RecQtyList[i].quantity,input.RecQtyList[i].unit);  

	} 
 var request = new sql.Request();
 console.log(input);
 request.input('id', sql.VarChar(50), input.id)
   request.input('supp', sql.VarChar(50), input.PM_NAME)
   request.input('date', sql.VarChar(50), input.GR_Date)
   request.input('batch', sql.VarChar(50), input.GR_Batch)
   request.input('challNo', sql.VarChar(250), input.GR_ChallNo)
   request.input('chdate', sql.VarChar(50), input.GR_Chdate)
   request.input('co', sql.VarChar(100), CO)
   request.input('uid', sql.VarChar(100), UID)
   request.input('FY', sql.VarChar(100), FY)
   request.input('RecQtyList',tvp_item)
   request.input('totQty', sql.VarChar(250), input.GR_TQTY) 
   request.input('pcs', sql.VarChar(250), input.pcs)
   request.input('meter', sql.Decimal(18, 4), input.TMeter)
   request.input('vehicle', sql.VarChar(100), input.vhNo)
   request.input('process', sql.VarChar(100), input.process)
   request.input('width', sql.Decimal(18,4), input.GR_Width)
   request.input('warehouse', sql.VarChar(100), input.GR_WH)
   request.input('quality', sql.VarChar(100), input.quality)
   request.input('rmk', sql.VarChar(250), input.GR_Rmk)
 // query to the database and get the data
 request.execute('dbo.GR_update', function (err, recordset) {
 
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/getToday', function (req, res) {
        var request = new sql.Request();  
        request.query("select convert(varchar(20),getDate(),106) as dat,convert(varchar(20),DATEADD(mm, DATEDIFF(mm, 0, GETDATE()), 0),106) as fdat, convert(varchar(20),DATEADD (dd, -1, DATEADD(mm, DATEDIFF(mm, 0, GETDATE()) + 1, 0)),106) as tdat ", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else
			{
				res.send(recordset);
			}           
        });
   });	
  app.get('/api/GreyRecieveView', function (req, res) {
        var request = new sql.Request();  
        request.query("select GR_ID,dbo.[getPartyName](GR_Supp,'"+CO+"') As Supp,Convert(varchar(20),GR_Date,106) As Dat, GR_Batch,GR_ChallNo,convert(decimal(18,2),GR_TPcs) As TQTY,convert(decimal(18,2),GR_TMeter) As TMTR,GR_PROCESS,GR_Check,GR_WH from GRC where GR_CO='"+CO+"' and (GR_IsDelete is null or GR_IsDelete='') and GR_FY='"+FY+"'  order by convert(int,substring(GR_ID,3,len(GR_ID))) desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else
			{
				res.send(recordset);
			}
					
			})
   });	
   
   
  app.get('/api/GreyRecieveRecord', function (req, res) {
	  var data=JSON.parse(req.query.filter);
	  var fdate=data.GR_Fdat;
	  var tdate=data.GR_Tdat;
        var request = new sql.Request();  
        request.query("select GR_ID,dbo.[getPartyName](GR_Supp,'"+CO+"') As Supp,Convert(varchar(20),GR_Date,106) As Dat, GR_Batch,GR_ChallNo,convert(decimal(18,2),GR_TPcs) As TQTY,convert(decimal(18,2),GR_TMeter) As TMTR,GR_PROCESS,GR_Vehcile as vehicle,GR_Check,GR_WH from GRC where GR_CO='"+CO+"' and (GR_IsDelete is null or GR_IsDelete='') and GR_FY='"+FY+"' and GR_Date between '"+fdate+"' and '"+tdate+"' order by convert(int,substring(GR_ID,3,len(GR_ID)))", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else
			{
				res.send(recordset);
			}			
        });
 });	
   
   app.get('/api/jobIntakeReport', function (req, res) {
	  var data=JSON.parse(req.query.filter);
	  var fdate=data.GR_Fdat;
	  var tdate=data.GR_Tdat;
          var request = new sql.Request();  
        request.query("SELECT convert(varchar(20),JBC_Date,106) as Dat, dbo.SuppName(JBC_PartyId,'"+CO+"') as Supp,JBC_JBatch as GR_Batch, convert(decimal(18,2),JBC_TPCS) as TQTY,convert(decimal(18,2),JBC_TMtr) as TMTR,GR_PROCESS  from JobCard left join GRC on (JBC_PBatch=GR_Batch and JBC_CO=GR_CO and JBC_FY=GR_FY) where JBC_JIntake=1 and JBC_CO='"+CO+"' and JBC_FY='"+FY+"' and (JBC_Isdelted is null or JBC_Isdelted='') and JBC_Date between '"+fdate+"' and '"+tdate+"' order by convert(int,substring(JBC_ID,3,len(JBC_ID)))", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else
			{
				res.send(recordset);
			}       
        });
   });	
	
	app.get('/api/GreyRecieveId/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.GR_Retrieve', function (err, recordset) {
		 if (err){ console.log(err);}
		 else{
		 res.send(recordset);
		 }
		 });
	});
	
   app.get('/api/partyBatch', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select GR_Batch from GRC where GR_Supp='"+id+"' and GR_CO='"+CO+"' and (GR_Check='pending' or GR_Check='' or GR_check is null) and GR_FY='"+FY+"'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}
					
			})

    });	

app.get('/api/GetGreyDetail', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var batch=data.batch;
		var partyId=data.partyId;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('batch', sql.VarChar(50), batch)
		 request.input('partyid', sql.VarChar(50), partyId)
		 request.execute('dbo.GRDetail', function (err, recordset) {
		 
		 if (err){ console.log(err); 	}
		 else{
		 res.send(recordset);
		 }
		 });
});


app.get('/api/GRCHK_Retrieve/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.GRCHK_Retrieve', function (err, recordset) {
		 if (err){ console.log(err); 	 }
		 else{
		 res.send(recordset);
		 }
	});
});

app.get('/api/JobCard_Retrieve/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.JOBCard_retrieve', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
		 res.send(recordset);
		 }
		 });
});
	
	
// app.get('/api/GRCHK_Retrieve', function (req, res) {
		// var id=JSON.parse(req.query.filter);
		 // sql.connect(config, function (err) {
		 // if (err) console.log(err);
		 // var request = new sql.Request();
		 // request.input('co', sql.Int, 1)
		 // request.input('batch', sql.VarChar(50), batch)
		 // request.input('partyid', sql.VarChar(50), partyId)
		 // request.execute('dbo.GRDetail', function (err, recordset) {
		 // if (err){ console.log(err); 	 sql.close();}
		 // else{
		 // res.send(recordset);
		 // sql.close();
		 // }
		 // });
		 // });
// });

	
app.post('/api/greyCheck', function (req, res){ 
 var input=req.body;
 console.log(input);	
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('IM_ID', sql.VarChar(50));  
	tvp_item.columns.add('unit', sql.VarChar(50) ); 
	tvp_item.columns.add('Cqty', sql.Decimal(18, 4));
	tvp_item.columns.add('Rqty', sql.Decimal(18, 4));
	tvp_item.columns.add('srNo', sql.Decimal(18, 4));
 for (var i = 0; i <input.dataList.length; i++) {  
	   tvp_item.rows.add(input.dataList[i].item , input.dataList[i].unit,input.dataList[i].cquantity,input.dataList[i].quantity,i+1);  
	}

 var request = new sql.Request();
   request.input('partyid', sql.VarChar(50), input.PM_ID)
   request.input('batch', sql.VarChar(50), input.GR_Batch)
   request.input('co', sql.VarChar(100), CO)
   request.input('FY', sql.VarChar(100), FY)
   request.input('uid', sql.VarChar(100), UID)
   request.input('dattlist',tvp_item)
   request.input('tqty', sql.Decimal(18, 4), input.TotQty)
   request.input('rpcs', sql.Decimal(18, 4), input.RecTPCS)
   request.input('tpcs', sql.Decimal(18, 4), input.Topcs)
   request.input('tmeter', sql.Decimal(18, 4), input.TotcQty)
   request.input('rmeter', sql.Decimal(18, 4), input.GR_RecMeter)
   request.input('diffMeter', sql.Decimal(18, 4), input.diffMeter)
   request.input('diffPcs', sql.Decimal(18, 4), input.diffPcs)
   request.input('date', sql.VarChar(50), input.RecDate)
   request.input('warehouse', sql.VarChar(50), input.GR_WH)
   request.input('rmk', sql.VarChar(50), input.GRCHK_RMK)
   request.input('Gfld', sql.VarChar(50), input.GRCHK_GFLD)
   request.input('pwght', sql.VarChar(50), input.GRCHK_PWGHT)
   request.input('pwidth', sql.VarChar(50), input.GRCHK_PWIDHT)
   
 request.execute('dbo.grchk_insert', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});


app.post('/api/greyCheckupdate', function (req, res){ 
 var input=req.body;	
  var tvp_item = new sql.Table();   
	tvp_item.columns.add('IM_ID', sql.VarChar(50));  
	tvp_item.columns.add('unit', sql.VarChar(50) ); 
	tvp_item.columns.add('Cqty', sql.Decimal(18, 4));
	tvp_item.columns.add('Rqty', sql.Decimal(18, 4));
	tvp_item.columns.add('srNo', sql.Decimal(18, 4));
 for (var i = 0; i <input.dataList.length; i++) {  
	   tvp_item.rows.add(input.dataList[i].item , input.dataList[i].unit,input.dataList[i].cquantity,input.dataList[i].quantity,i+1);  
	}
  var request = new sql.Request();
   request.input('partyName', sql.VarChar(150), input.PM_NAME)
   request.input('batch', sql.VarChar(50), input.GR_Batch)
   request.input('co', sql.VarChar(100), CO)
   request.input('FY', sql.VarChar(100), FY)
   request.input('uid', sql.VarChar(100), UID)
   request.input('dattlist',tvp_item)
   request.input('tqty', sql.Decimal(18, 4), input.TotQty)
   request.input('rpcs', sql.Decimal(18, 4), input.RecTPCS)
   request.input('tpcs', sql.Decimal(18, 4), input.Topcs)
   request.input('tmeter', sql.Decimal(18, 4), input.TotcQty)
   request.input('rmeter', sql.Decimal(18, 4), input.GR_RecMeter)
   request.input('diffMeter', sql.Decimal(18, 4), input.diffMeter)
   request.input('diffPcs', sql.Decimal(18, 4), input.diffPcs)
   request.input('date', sql.VarChar(50), input.RecDate)
   request.input('warehouse', sql.VarChar(50), input.GR_WH)
   request.input('id', sql.VarChar(50), input.id)
   request.input('rmk', sql.VarChar(50), input.GRCHK_RMK)
   request.input('Gfld', sql.VarChar(50), input.GRCHK_GFLD)
   request.input('pwght', sql.VarChar(50), input.GRCHK_PWGHT)
   request.input('pwidth', sql.VarChar(50), input.GRCHK_PWIDHT)
 request.execute('dbo.GRCHK_update', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 }); 
});

app.get('/api/GreyCheckView', function (req, res) {
        var request = new sql.Request();  
        request.query("select GRCHK_ID,dbo.[getPartyName](GRCHK_PartyId,'"+CO+"') As Supp, GRCHK_Batch,convert(decimal(18,2),GRCHK_RPCS) As RPCS,convert(decimal(18,2),GRCHK_TQTY) As Rmtr,convert(decimal(18,2),GRCHK_TMeter) As Tmeter,convert(decimal(18,2),isnull(GRCHK_TQTY,0)-isnull(GRCHK_TMeter,0)) As Dmtr,GRCHK_JBC,convert(varchar(20),GRCHK_DE,106) as Dat,GR_Process  from GRCHCK left join GRC on (GRCHK_Batch=GR_Batch and GRCHK_CO=GR_CO and GRCHK_FY=GR_FY) where GRCHK_CO='"+CO+"' and GRCHK_FY='"+FY+"' and (GRCHK_IsDelete is null or GRCHK_IsDelete='')   order by convert(int,substring(GRCHK_ID,4,len(GRCHK_ID))) desc ", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else{
				res.send(recordset);
			}	
        });
 });	

app.get('/api/GreyCheckingRecord', function (req, res) {
	var data=JSON.parse(req.query.filter);
	  var fdate=data.GR_Fdat;
	  var tdate=data.GR_Tdat;
        var request = new sql.Request();  
        request.query("select GRCHK_ID,dbo.[getPartyName](GRCHK_PartyId,'"+CO+"') As Supp, GRCHK_Batch,convert(decimal(18,2),GRCHK_RPCS) As RPCS,convert(decimal(18,2),GRCHK_TQTY) As Rmtr,convert(decimal(18,2),GRCHK_TMeter) As Tmeter,convert(decimal(18,2),isnull(GRCHK_TQTY,0)-isnull(GRCHK_TMeter,0)) As Dmtr,GRCHK_JBC,convert(varchar(20),GRCHK_DE,106) as Dat,GR_Process  from GRCHCK left join GRC on (GRCHK_Batch=GR_Batch and GRCHK_CO=GR_CO and GRCHK_FY=GR_FY) where GRCHK_CO='"+CO+"' and GRCHK_FY='"+FY+"' and (GRCHK_IsDelete is null or GRCHK_IsDelete='') and GRCHK_DE between '"+fdate+"' and '"+tdate+"'  order by convert(int,substring(GRCHK_ID,4,len(GRCHK_ID))) ", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else{
				res.send(recordset);
			}	})
});	

	app.get('/api/partyBatchJobCard', function (req, res) {
	var id=req.query.filter;
	console.log(id);
        var request = new sql.Request();  
        request.query("select GRCHK_Batch from GRCHCK where GRCHK_PartyId='"+id+"' and GRCHK_CO='"+CO+"' and (GRCHK_JBC='pending' or GRCHK_JBC='' or GRCHK_JBC is null) and GRCHK_FY='"+FY+"'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				res.send(recordset);
			}
        });
    });
	
	
	app.get('/api/GreyCheckJRecord', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var batch=data.batch;
		var partyId=data.partyId;
		var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('fy', sql.Int, FY)
		 request.input('batch', sql.VarChar(50), batch)
		 request.input('partyid', sql.VarChar(50), partyId)
		 request.execute('dbo.GRJBCDetails', function (err, recordset) {

		 if (err){ console.log(err);}
		 else{
			 console.log(recordset);
		 res.send(recordset);
		 }
	
		 });
		 });
	
// app.get('/api/JOBCardBatch', function (req, res) {
	// var data=JSON.parse(req.query.filter);
	// var batch=data.batch;
	// var partyId=data.partyId;
	// console.log(batch); console.log(partyId);
        // var request = new sql.Request();  
        // request.query("select count(*) As ID from jobcard where JBC_PartyId='"+partyId+"' and JBC_PBatch='"+batch+"' and JBC_FY='"+FY+"' and JBC_CO='"+CO+"' and isnull(JBC_Isdelted,0)!=1", function (err, recordset) {
            // if (err){
				// console.log(err);
			// }
			// else{
			// res.send(recordset);
			// }		
			// })
    // });
app.get('/api/JOBCardBatch', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var batch=data.batch;
		var partyId=data.partyId;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('batch', sql.VarChar(50), batch)
		 request.input('party', sql.VarChar(50), partyId)
		 request.execute('dbo.JobCardBatchId', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
		 });
	})

app.get('/api/JobCardIntakeBatch', function (req, res) {
        var request = new sql.Request();  
        request.query("select distinct JBC_JBatch from Jobcard where JBC_CO='"+CO+"' and (JBC_JIntake is null or JBC_JIntake='' or JBC_JIntake=0) and JBC_FY='"+FY+"' and (isnull(JBC_Isdelted,0)!=1)", function (err, recordset) {
            if (err){
				console.log(err);
			}
			else{
			res.send(recordset);
			}
          
        });
 });
	
app.post('/api/JobCardInsert', function (req, res){ 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('IM_ID', sql.VarChar(50));  
	tvp_item.columns.add('unit', sql.VarChar(50) ); 
	tvp_item.columns.add('qty', sql.Decimal(18,4));
	tvp_item.columns.add('check', sql.VarChar(50));
	tvp_item.columns.add('srNo', sql.Decimal(18,4));
	tvp_item.columns.add('No', sql.Decimal(18, 4));
 for (var i = 0; i <input.dataList.length; i++) {  
	   tvp_item.rows.add(input.dataList[i].item , input.dataList[i].unit,input.dataList[i].Qty,input.dataList[i].checked,input.dataList[i].SrNo,i+1);  
	}
  var request = new sql.Request();
   request.input('party', sql.VarChar(50), input.PM_ID)
   request.input('date', sql.VarChar(50), input.JDate)
   request.input('batch', sql.VarChar(100), input.GRCHK_Batch)
   request.input('abatch', sql.VarChar(100), input.GR_Batch)
   request.input('challno',sql.VarChar(100), input.GR_ChallNo)
   request.input('process',sql.VarChar(100), input.processId)
   request.input('co', sql.Int, CO)
   request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(100), UID)
   request.input('det', tvp_item)
   request.input('tpcs',sql.Decimal(18, 4), input.TPCS)
   request.input('tmtr',sql.Decimal(18, 4), input.TMtr)
   request.input('rmk',sql.VarChar(200), input.JBC_RMK)
   request.input('shade',sql.VarChar(50), input.JBC_Shade)
   request.input('quality',sql.VarChar(50), input.GRCHK_Quality)
   request.input('procName',sql.VarChar(50), input.prcNameId)
   request.input('costfreeproc',sql.VarChar(50), input.costfrpco)
 request.execute('dbo.JOBCard_insert', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 }); 
});


app.get('/api/StockReport', function (req, res) {
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.execute('dbo.GREY_STOCK_REPORT', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
		 });
	})	
	
	
	app.get('/api/RawStockReport', function (req, res) {
       var request = new sql.Request();  
        request.query("select dbo.getemItemName(AIMS_ITM,'"+CO+"') As Item,AIMS_UNIT as Unit,AIMS_CAT as Cat,AIMS_TAx as Tax,AIMS_HSN as HSN, AIMS_WH as Ware,convert(decimal(18,2),isnull(AIMS_Qty,0)) As Qty,convert(decimal(18,2),(isnull(AIMS_QTY,0)*isnull(AIMS_AGSTPRATE,0))) as amt,convert(decimal(18,2),AIMS_AGSTPRATE) as PRATE,AIMS_TYPE,IM_MINSTK as mnstk from AIMSR left join IM on (AIMS_ITM=IM_ID and AIMS_CO=IM_CO) where AIMS_CO='"+CO+"' and AIMS_FY='"+FY+"'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else
			{
				res.send(recordset);
			}
        });
    });	


	

app.get('/api/JobCardStockReport', function (req, res) {
        var request = new sql.Request();  
        request.query("select dbo.getPartyName(JBC_PartyId,'"+CO+"') as Supp,JBC_JBatch as GR_Batch,GR_Quality as GR_Quality,JBC_Shade as shade, sum(JBC_TPCS) as Tpcs, sum(JBC_TMtr) as Qty from JobCard left join GRC  on (JBC_PBatch=GR_Batch and JBC_CO=GR_CO and JBC_FY=GR_FY) where JBC_JIntake=1 and (JBC_Isdelted is null or JBC_Isdelted='' or JBC_Isdelted=0) and (JBC_IsProcess='' or JBC_IsProcess is null) and JBC_CO='"+CO+"' and JBC_FY='"+FY+"' group by JBC_PartyId,JBC_JBatch,GR_Quality,JBC_Date,GR_WH,JBC_Shade order by JBC_Date desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}
        });
    });	
	
	
app.get('/api/JobProcess', function (req, res) {
        var request = new sql.Request();  
        request.query("SELECT  distinct dbo.ProcessName(Split.a.value('.', 'VARCHAR(100)'),'"+CO+"') AS Procs,Split.a.value('.', 'VARCHAR(100)') AS ProcsId FROM  (SELECT [JBC_ID],CAST ('<M>' +REPLACE(RIGHT(JBC_Process, LEN(JBC_Process) - 1), ',', '</M><M>') + '</M>' AS XML) AS String FROM  JobCard where JBC_CO='"+CO+"' and JBC_FY='"+FY+"') AS A CROSS APPLY String.nodes ('/M') AS Split(a);", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
    });	


app.get('/api/JobCardId', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var id=data.processId;
		var ptype=data.ptype;
        var request = new sql.Request();  
        request.query("select distinct ROW_NUMBER() OVER(ORDER BY (SELECT 1)) AS id, JBC_jbatch As itemName,dbo.SuppName(JBC_PartyId,'"+CO+"') As supp, convert(decimal(18,0),JBC_TPCS) As Tps,convert(decimal(18,2),JBC_TMtr) As tmr,JBC_RMK,JBC_Shade as shdNo,JBC_Quality as quality from jobcard left join GRC on (JBC_PBatch=GR_Batch and JBC_CO=GR_CO) where JBC_CO='"+CO+"' and JBC_Process like '%"+id+"%' and JBC_JIntake=1 and GR_Process='"+ptype+"' and JBC_FY='"+FY+"' and JBC_ISDoneProcess not like '%"+id+"%' and isnull(JBC_JIntakeIsdelte,0)!=1 and isnull(JBC_Isdelted,0)!=1", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else{
				res.send(recordset);
			}
        });
  });	
	
app.post('/api/MachineInsert', function (req, res) { 
 var input=req.body;
 var request = new sql.Request();
   request.input('name', sql.VarChar(50), input.Machine_name)
   request.input('srNo', sql.VarChar(250), input.Machine_srNo)
   request.input('pdate', sql.VarChar(50), input.Machine_PDate)
   request.input('mtyp', sql.VarChar(50), input.Machine_Mtyp)
   request.input('co', sql.VarChar(50), CO)
   request.input('uid', sql.VarChar(50), UID)
   request.input('status', sql.VarChar(50), input.status1)
 // query to the database and get the data
 request.execute('dbo.Machine_Insert', function (err, recordset) {
 
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});


app.post('/api/MachineUpdate', function (req, res) { 
 var input=req.body;
 var request = new sql.Request();
   request.input('name', sql.VarChar(50), input.Machine_name)
   request.input('srNo', sql.VarChar(250), input.Machine_srNo)
   request.input('pdate', sql.VarChar(50), input.Machine_PDate)
   request.input('mtyp', sql.VarChar(50), input.Machine_Mtyp)
   request.input('co', sql.VarChar(50), CO)
   request.input('uid', sql.VarChar(50), UID)
   request.input('status', sql.VarChar(50), input.status1)
   request.input('id', sql.VarChar(50), input.id)
 // query to the database and get the data
 request.execute('dbo.Machine_update', function (err, recordset) {
 
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});
app.get('/api/machine', function (req, res) {
        var request = new sql.Request();  
        request.query("select Machine_id as id, Machine_name from MachineMaster where Machine_co='"+CO+"' and  Machine_status='Active'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else{
				res.send(recordset);
			}
        });
    });	

app.get('/api/processId', function (req, res) {
        var request = new sql.Request();  
        request.query("SELECT isnull(MAX(convert(int,substring(JPR_ID,3,len(isnull(JPR_ID,0))))),0) As ID FROM dbo.JPRC where JPR_CO='"+CO+"'", function (err, recordset) {
            if (err) console.log(err)
			else
			{
				recordset.recordset[0].ID++;
				res.send(recordset);
			
			}
			
        });
});
	
app.post('/api/JPRC_Insert', function (req, res){ 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('IM_ID', sql.VarChar(50));  
	tvp_item.columns.add('unit', sql.VarChar(50) ); 
	tvp_item.columns.add('qty', sql.Decimal(18,4));
	tvp_item.columns.add('rmk', sql.VarChar(200) );
 for (var i = 0; i <input.RecQtyList.length; i++) {  
	   tvp_item.rows.add(i+1,input.RecQtyList[i].IM_ID , input.RecQtyList[i].unit,input.RecQtyList[i].quantity,input.RecQtyList[i].rmk);  
	}
var tvp_item2 = new sql.Table();   
	tvp_item2.columns.add('No', sql.Decimal(18, 4));
	tvp_item2.columns.add('IM_ID', sql.VarChar(50));  
 for (var j = 0; j <input.joblist.length; j++) {  
	   tvp_item2.rows.add(j+1,input.joblist[j].itemName);  
	}
 var request = new sql.Request(); 
   request.input('id', sql.VarChar(50), input.PR_ID)
   request.input('batch', sql.VarChar(300), input.Batch)
   request.input('process', sql.VarChar(100), input.process)
   request.input('date', sql.VarChar(100), input.JDate)
   request.input('machine',sql.VarChar(100), input.machine)
   request.input('shadNo',sql.VarChar(100), input.shdNo)
   request.input('rmk', sql.VarChar(100), input.JPR_RMK)
   request.input('partyName',sql.VarChar(100), input.partyName)
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
   request.input('FY', sql.VarChar(50), FY)
   request.input('itmdetail', tvp_item)
   request.input('jobId', tvp_item2)
   request.input('type',sql.VarChar(100), input.type)
   request.input('tpcs',sql.VarChar(100), input.tpcs)
   request.input('tmtr',sql.VarChar(100), input.Tmeter)
   request.input('ptyp',sql.VarChar(100), input.ptype)
   request.input('quality',sql.VarChar(100), input.quality)
 request.execute('dbo.jprc_insert', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 }); 
});

app.get('/api/jobCardView', function (req, res) {
        var request = new sql.Request();  
        request.query("select JBC_ID,Convert(varchar(20),JBC_Date,106) As dat,dbo.SuppName(JBC_PartyId,'"+CO+"') as supp, JBC_PBatch as batch, JBC_JBatch as JBatch,convert(decimal(18,2),JBC_TPCS) as tpcs,convert(decimal(18,2),JBC_TMtr) As tmtr,dbo.[CommaProcess](JBC_Process) as process,JBC_JIntake,JBC_RMK from JobCard where JBC_CO='"+CO+"' and (JBC_Isdelted is null or JBC_Isdelted='') and JBC_FY='"+FY+"' order by convert(int,substring(JBC_ID,3,len(JBC_ID))) desc", function (err, recordset) {
            if (err) {console.log(err); }
			else
			{
				res.send(recordset);
			}
    });
});


app.get('/api/processView', function (req, res) {
        var request = new sql.Request();  
        request.query("select JPR_ID As ID,JPR_batch As Batch,dbo.ProcessName(JPR_Process,'"+CO+"') as JPR_Process,dbo.[MachineName](JPR_Machine,'"+CO+"') As machine,convert(varchar(20),JPR_Date,106) As Dat,isnull(JPR_Count,0) As count,JPR_Done,JPR_IsPack,JPR_Count as count1,dbo.CommaPartyName(JPR_PartyName) as partyName,case when JPR_PRTYPE='Process' then 'Process' else 'REPORCESS'  end as typ from JPRc where JPR_CO='"+CO+"' and (JPR_ISdelete is null or JPR_ISdelete='') and JPR_FY='"+FY+"'  order by convert(int,substring(JPR_ID,3,len(JPR_ID))) desc", function (err, recordset) {
            if (err) {console.log(err); }
			else
			{	res.send(recordset);
			}
        });
});

app.get('/api/processView/:id', function (req, res) {
	var id=req.params.id;
        var request = new sql.Request();  
        request.query("select JPR_ID As PR_ID,JPR_batch As Batch,dbo.ProcessName(JPR_Process,'"+CO+"') as process,convert(decimal(18,2),JPR_TPCs) as tpcs,convert(decimal(18,2),JPR_TMtr) as Tmeter,dbo.[MachineName](JPR_Machine,'"+CO+"') As machine,JPR_Date As JDate,JPR_ShadNo As shdNo ,dbo.CommaPartyName(JPR_PartyName) as partyName,JPR_PTYP as ptype,JPR_RMK,isnull(JPR_Count,0) As count,JPR_IsPack,JPR_Quality as quality,isnull(JPR_ISReprocess,0) as JPR_ISReprocess from JPRc where JPR_CO='"+CO+"' and JPR_id='"+id+"'", function (err, recordset) {
            if (err){
				console.log(err);  
				}
			else
			{
				res.send(recordset);
			}
        });
});



app.post('/api/JPRC_Update', function (req, res){ 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('IM_ID', sql.VarChar(50));  
	tvp_item.columns.add('unit', sql.VarChar(50) ); 
	tvp_item.columns.add('qty', sql.Decimal(18,4));
	tvp_item.columns.add('rmk', sql.VarChar(200));
 for (var i = 0; i <input.RecQtyList.length; i++) {  
	   tvp_item.rows.add(i+1,input.RecQtyList[i].IM_ID , input.RecQtyList[i].unit,input.RecQtyList[i].quantity,input.RecQtyList[i].rmk);  
	}

 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input.PR_ID)
   request.input('date', sql.VarChar(100), input.JDate)
   request.input('rmk', sql.VarChar(100), input.JPR_RMK)
   request.input('machine',sql.VarChar(100), input.machine)
   request.input('shadNo',sql.VarChar(100), input.shdNo)
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
   request.input('FY', sql.Int, FY)
   request.input('itmdetail', tvp_item)
	request.execute('dbo.jprc_update', function (err, recordset) {
	if (err){ console.log(err); }
	else
	{
	res.send(recordset);
	} });
});

app.post('/api/ProcDone', function (req, res) { 
 var input=req.body;
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input.ID)
    request.input('co', sql.Int, CO)
	request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
 request.execute('dbo.ProcessDone', function (err, recordset) {
 
 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }
 });
});

app.delete('/api/greyReDel/:id', function (req, res) { 
 var input=req.params.id;
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input)
    request.input('co', sql.Int, CO)
	request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
 request.execute('dbo.GR_delete', function (err, recordset) {
 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }
 });
});

app.delete('/api/dispatchdel/:id', function (req, res) { 
 var input=req.params.id;
 console.log(input);
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input)
    request.input('co', sql.Int, CO)
	request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
 request.execute('dbo.Dispat_delete', function (err, recordset) {
	if (err){ console.log(err); }
	else
	{
		res.send(recordset);
	}
	});
});

app.delete('/api/GRCHKDel/:id', function (req, res) { 
 var input=req.params.id;
 console.log(input);
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input)
   request.input('co', sql.Int, CO)
   request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
 request.execute('dbo.GRCHK_delete', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});

app.delete('/api/JobCarDel/:id', function (req, res) { 
 var input=req.params.id;
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input)
    request.input('co', sql.Int, CO)
	request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
 request.execute('dbo.JOBCard_delete', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});

app.delete('/api/JobProcDel/:id', function (req, res) { 
 var input=req.params.id;
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input)
    request.input('co', sql.Int, CO)
	request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
 request.execute('dbo.JPRC_delete', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});


app.get('/api/JobPRocssId', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var id=data.processId;
		var ptype=data.ptype;
	    var request = new sql.Request();  
        request.query("select  distinct dense_rank() over (order by   split.a.value('.', 'varchar(100)')) as id, split.a.value('.', 'varchar(100)') as itemName,dbo.[getPartyFromJobId](split.a.value('.', 'varchar(100)'),'"+CO+"','"+FY+"') as supp,dbo.[getJobMtrFromJobId](split.a.value('.', 'varchar(100)'),'"+CO+"','"+FY+"') as tmr,dbo.[getJobPCsFromJobId](split.a.value('.', 'varchar(100)'),'"+CO+"','"+FY+"') as Tps,RIGHT(JPR_SHADNO , LEN(REPLACE(JPR_ShadNo, ' ', '.') ) - 1) as shdNo,RIGHT(JPR_Quality , LEN(REPLACE(JPR_Quality, ' ', '.') ) - 1) as quality from  (select [jpr_id],cast ('<m>' +replace(right(jpr_batch, len(jpr_batch) -1), ',', '</m><m>') + '</m>' as xml) as string,JPR_ShadNo,JPR_Quality from  jprc where  JPR_Process='"+id+"' and JPR_PTYP='"+ptype+"' and JPR_CO='"+CO+"' and JPR_FY='"+FY+"' and isnull(JPR_ISdelete,0)!=1  and  JPR_PRTYPE='Process' and (JPR_Done is null or JPR_Done='')) as a cross apply string.nodes ('/m') as split(a) left join JobCard on (split.a.value('.', 'varchar(100)')=JBC_JBatch and JBC_CO='"+CO+"' and JBC_FY='"+FY+"') where (JBC_ISdispatchStart is null or JBC_ISdispatchStart='') and isnull(JBC_JIntakeIsdelte,0)!=1 and isnull(JBC_Isdelted,0)!=1;", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else
			{
				res.send(recordset);
			}	
        });
    });	
	
app.get('/api/machinewiseProcess', function (req, res) {
	var data=JSON.parse(req.query.filter);
	var fdate=data.GR_Fdat;
	var tdate=data.GR_Tdat;
        var request = new sql.Request();  
        request.query("SELECT dbo.MachineName(JPR_Machine,'"+CO+"') as machine,convert(varchar(20),JPR_Date,106) As dat,JPR_ShadNo as shade, RIGHT(JPR_batch, LEN(JPR_batch) - 1) AS batch,dbo.CommaPartyName(JPR_PartyName) as party,dbo.ProcessName(JPR_Process,'"+CO+"') as process,JPR_PTYP,JPR_TPCs,JPR_TMtr,case when JPR_PTYP='PD' then convert(decimal(18,2),isnull(JPR_TPCs,0)) else 0 end as Ptpcs,case when JPR_PTYP='TD' then convert(decimal(18,2),isnull(JPR_TPCs,0)) else 0 end as Ttpcs,  case when JPR_PTYP='RF' then convert(decimal(18,2),isnull(JPR_TPCs,0)) else 0 end as Rtpcs,case when JPR_PTYP='TD' then convert(decimal(18,2),isnull(JPR_TMtr,0)) else 0 end as Ttmtr,case when JPR_PTYP='PD' then convert(decimal(18,2),isnull(JPR_TMtr,0)) else 0 end as Ptmtr,case when JPR_PTYP='RF' then convert(decimal(18,2),isnull(JPR_TMtr,0)) else 0 end as Rtmr,case when JPR_PRTYPE='Process' then 'Process' else 'Re-Proces' end as JPR_PRTYPE from JPRC where JPR_CO='"+CO+"' and JPR_FY='"+FY+"' and JPR_Date between '"+fdate+"' and '"+tdate+"' and (JPR_ISdelete=0 or JPR_ISdelete='' or JPR_ISdelete is null) ", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else
			{
				res.send(recordset);
			}	
        });
   });

app.post('/api/PurchaeInvoice', function (req, res){ 
 var input=req.body;
 var tvp_item = new sql.Table();
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('IM_ID', sql.VarChar(50));  
	tvp_item.columns.add('unit', sql.VarChar(50) ); 
	tvp_item.columns.add('qty', sql.Decimal(18,4));
	tvp_item.columns.add('rate', sql.Decimal(18,4));
	tvp_item.columns.add('NA', sql.Decimal(18,4));
	tvp_item.columns.add('taxID', sql.VarChar(50));
	tvp_item.columns.add('cgst', sql.Decimal(18,4));
	tvp_item.columns.add('sgst', sql.Decimal(18,4));
	tvp_item.columns.add('igst', sql.Decimal(18,4));
	tvp_item.columns.add('tax', sql.Decimal(18,4));
	tvp_item.columns.add('total', sql.Decimal(18,4));
 for (var i = 0; i <input.particular.length; i++) {  
	   tvp_item.rows.add(i+1,input.particular[i].IM_ID , input.particular[i].IM_UM,input.particular[i].quantity,input.particular[i].sellingPrice,input.particular[i].subTotal,input.particular[i].IM_TAX,input.particular[i].cgst,input.particular[i].sgst,input.particular[i].igst,input.particular[i].taxSubTotal,input.particular[i].amount);  
	}

 var request = new sql.Request();
   request.input('supp', sql.VarChar(50), input.partyId)
   request.input('date', sql.VarChar(50), input.generatedate)
   request.input('total', sql.Decimal(18, 4), input.amount)
   request.input('taxtot', sql.Decimal(18, 4), input.taxSubTotal)
   request.input('namt', sql.Decimal(18, 4), input.subTotal)
   request.input('Tsgst',sql.Decimal(18, 4), input.tsgst)
   request.input('Tcgst',sql.Decimal(18, 4), input.tcgst)
   request.input('co', sql.Int, CO)
   request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
   request.input('itmdetail', tvp_item)
   request.input('Tigst',sql.Decimal(18, 4), input.tigst)
   request.input('gsttype',sql.VarChar(100), input.taxGType)
   request.input('rmk',sql.VarChar(250), input.remark)
   request.input('warehouse',sql.VarChar(100), input.GR_WH)
   request.input('pinv',sql.VarChar(100), input.invNo)
   request.input('pchno',sql.VarChar(100), input.chalNo)
   request.input('roundoff',sql.VarChar(100), input.roundoff)
   request.input('woramt',sql.VarChar(100), input.woramt)
 request.execute('dbo.Purchase_Insert', function (err, recordset) {
 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }
 }); 
});

app.get('/api/Purchase_Retrieve', function (req, res) {
        var request = new sql.Request();  
        request.query("select PI_ID,PI_PInvNo,dbo.getPartyName(PI_Supp,'"+CO+"') as supp,Convert(varchar(20),PI_Date,106) as dat,convert(decimal(18,2),PI_NA) as NA,convert(decimal(18,2),PI_TTax) as Tax, convert(decimal(18,2),PI_Total) as TA from PIC where PI_Co='"+CO+"' and PI_FY='"+FY+"' and (PI_IsDel is null or PI_IsDel='') order by  convert(int,substring(PI_ID,3,len(PI_ID))) desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				res.send(recordset);
			}	
		})
	})

	app.post('/api/PurchaeInvoice_update', function (req, res){ 
		var input=req.body;
		var tvp_item = new sql.Table();
		   tvp_item.columns.add('No', sql.Decimal(18, 4));
		   tvp_item.columns.add('IM_ID', sql.VarChar(50));  
		   tvp_item.columns.add('unit', sql.VarChar(50) ); 
		   tvp_item.columns.add('qty', sql.Decimal(18,4));
		   tvp_item.columns.add('rate', sql.Decimal(18,4));
		   tvp_item.columns.add('NA', sql.Decimal(18,4));
		   tvp_item.columns.add('taxID', sql.VarChar(50));
		   tvp_item.columns.add('cgst', sql.Decimal(18,4));
		   tvp_item.columns.add('sgst', sql.Decimal(18,4));
		   tvp_item.columns.add('igst', sql.Decimal(18,4));
		   tvp_item.columns.add('tax', sql.Decimal(18,4));
		   tvp_item.columns.add('total', sql.Decimal(18,4));
		for (var i = 0; i <input.particular.length; i++) {  
			  tvp_item.rows.add(i+1,input.particular[i].IM_ID , input.particular[i].IM_UM,input.particular[i].quantity,input.particular[i].sellingPrice,input.particular[i].subTotal,input.particular[i].IM_TAX,input.particular[i].cgst,input.particular[i].sgst,input.particular[i].igst,input.particular[i].taxSubTotal,input.particular[i].amount);  
		   }
	   
		var request = new sql.Request();
			request.input('id', sql.VarChar(50), input.id)
		  request.input('supp', sql.VarChar(50), input.partyId)
		  request.input('date', sql.VarChar(50), input.generatedate)
		  request.input('total', sql.Decimal(18, 4), input.amount)
		  request.input('taxtot', sql.Decimal(18, 4), input.taxSubTotal)
		  request.input('namt', sql.Decimal(18, 4), input.subTotal)
		  request.input('Tsgst',sql.Decimal(18, 4), input.tsgst)
		  request.input('Tcgst',sql.Decimal(18, 4), input.tcgst)
		  request.input('co', sql.Int, CO)
		  request.input('FY', sql.Int, FY)
		  request.input('uid', sql.VarChar(50), UID)
		  request.input('itmdetail', tvp_item)
		  request.input('Tigst',sql.Decimal(18, 4), input.tigst)
		  request.input('gsttype',sql.VarChar(100), input.taxGType)
		  request.input('rmk',sql.VarChar(250), input.remark)
		  request.input('warehouse',sql.VarChar(100), input.GR_WH)
		  request.input('pinv',sql.VarChar(100), input.invNo)
		  request.input('pchno',sql.VarChar(100), input.chalNo)
		  request.input('roundoff',sql.VarChar(100), input.roundoff)
		  request.input('woramt',sql.VarChar(100), input.woramt)
		request.execute('dbo.Purchase_update', function (err, recordset) {
		if (err){ console.log(err); }
		else
		{
		res.send(recordset);
		}
		}); 
	   });

app.get('/api/Sales_ALL_Retrieve', function (req, res) {
        var request = new sql.Request();  
        request.query("select SI_ID,SI_SInvNo,dbo.getPartyName(SI_Supp,'"+CO+"') as supp,Convert(varchar(20),SI_Date,106) as dat,convert(decimal(18,2),SI_NA) as NA,convert(decimal(18,2),SI_TTax) as Tax, convert(decimal(18,2),SI_Total) as TA from SIC_ALL where SI_Co='"+CO+"' and SI_FY='"+FY+"' and (SI_IsDel is null or SI_IsDel='') order by convert(int,substring(SI_ID,3,len(SI_ID))) desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				res.send(recordset);
			}	
		})
		})
		

app.get('/api/Sales_ALL_InvID', function (req, res) {
	var request = new sql.Request();
	request.query("SELECT convert(varchar, isnull(MAX(convert(int,substring([SI_SInvNo],3,len([SI_SInvNo])))),0) + 1) as inv from SIC_ALL Where SI_CO = '"+CO+"' and SI_FY = '"+FY+"' ", function (err, recordset) {
		if (err) {
			console.log(err);
		} else {
			res.send(recordset);
		}
	})
})
	app.get('/api/Purchase_Retrieve/:id', function (req, res) {
			var id=req.params.id;
			 var request = new sql.Request();
			 request.input('co', sql.Int, CO)
			 request.input('FY', sql.Int, FY)
			 request.input('id', sql.VarChar(50), id)
			 request.execute('dbo.Purchase_retrieve', function (err, recordset) {
			 if (err){ console.log(err); }
			 else{
				res.send(recordset);
			 }
			 });
		})
		
	app.delete('/api/deletePurchaseInv/:id', function (req, res) { 
		var id=req.params.id;

		var request = new sql.Request();
			request.input('id', sql.VarChar(50), id)
			request.input('co', sql.Int, CO)
			request.input('FY', sql.Int, FY)
			request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
	request.execute('dbo.Purchase_delete', function (err, recordset) {
	if (err){ console.log(err);  }
	else
		{
		res.send(recordset);
		}
 });
});
	
	
app.post('/api/SI_ALL_Insert', function (req, res){ 
 var input=req.body;
 var tvp_item = new sql.Table();
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('IM_ID', sql.VarChar(50));  
	tvp_item.columns.add('unit', sql.VarChar(50) ); 
	tvp_item.columns.add('qty', sql.Decimal(18,4));
	tvp_item.columns.add('rate', sql.Decimal(18,4));
	tvp_item.columns.add('NA', sql.Decimal(18,4));
	tvp_item.columns.add('taxID', sql.VarChar(50));
	tvp_item.columns.add('cgst', sql.Decimal(18,4));
	tvp_item.columns.add('sgst', sql.Decimal(18,4));
	tvp_item.columns.add('igst', sql.Decimal(18,4));
	tvp_item.columns.add('tax', sql.Decimal(18,4));
	tvp_item.columns.add('total', sql.Decimal(18,4));
 for (var i = 0; i <input.particular.length; i++) {  
	   tvp_item.rows.add(i+1,input.particular[i].IM_ID , input.particular[i].IM_UM,input.particular[i].quantity,input.particular[i].sellingPrice,input.particular[i].subTotal,input.particular[i].IM_TAX,input.particular[i].cgst,input.particular[i].sgst,input.particular[i].igst,input.particular[i].taxSubTotal,input.particular[i].amount);  
	}

 var request = new sql.Request();
   request.input('supp', sql.VarChar(50), input.partyId)
   request.input('date', sql.VarChar(50), input.generatedate)
   request.input('total', sql.Decimal(18, 4), input.amount)
   request.input('taxtot', sql.Decimal(18, 4), input.taxSubTotal)
   request.input('namt', sql.Decimal(18, 4), input.subTotal)
   request.input('Tsgst',sql.Decimal(18, 4), input.tsgst)
   request.input('Tcgst',sql.Decimal(18, 4), input.tcgst)
   request.input('co', sql.Int, CO)
   request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
   request.input('itmdetail', tvp_item)
   request.input('Tigst',sql.Decimal(18, 4), input.tigst)
   request.input('gsttype',sql.VarChar(100), input.taxGType)
   request.input('rmk',sql.VarChar(250), input.remark)
   request.input('warehouse',sql.VarChar(100), input.GR_WH)
   request.input('SInv',sql.VarChar(100), input.invNo)
   request.input('pchno',sql.VarChar(100), input.chalNo)
   request.input('roundoff',sql.VarChar(100), input.roundoff)
   request.input('woramt',sql.VarChar(100), input.woramt)
   request.input('transmode',sql.VarChar(100), input.transmode)
   request.input('vehicleno',sql.VarChar(100), input.vehicleno)
 request.execute('dbo.SI_ALL_Insert', function (err, recordset) {
 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }
 }); 
});


app.post('/api/SI_ALL_update', function (req, res){ 
	var input=req.body;

	var tvp_item = new sql.Table();
	   tvp_item.columns.add('No', sql.Decimal(18, 4));
	   tvp_item.columns.add('IM_ID', sql.VarChar(50));  
	   tvp_item.columns.add('unit', sql.VarChar(50) ); 
	   tvp_item.columns.add('qty', sql.Decimal(18,4));
	   tvp_item.columns.add('rate', sql.Decimal(18,4));
	   tvp_item.columns.add('NA', sql.Decimal(18,4));
	   tvp_item.columns.add('taxID', sql.VarChar(50));
	   tvp_item.columns.add('cgst', sql.Decimal(18,4));
	   tvp_item.columns.add('sgst', sql.Decimal(18,4));
	   tvp_item.columns.add('igst', sql.Decimal(18,4));
	   tvp_item.columns.add('tax', sql.Decimal(18,4));
	   tvp_item.columns.add('total', sql.Decimal(18,4));
	for (var i = 0; i <input.particular.length; i++) {  
		  tvp_item.rows.add(i+1,input.particular[i].IM_ID , input.particular[i].IM_UM,input.particular[i].quantity,input.particular[i].sellingPrice,input.particular[i].subTotal,input.particular[i].IM_TAX,input.particular[i].cgst,input.particular[i].sgst,input.particular[i].igst,input.particular[i].taxSubTotal,input.particular[i].amount);  
	   }
   	console.log(tvp_item);
	var request = new sql.Request();
		request.input('id', sql.VarChar(50), input.id)
	  request.input('supp', sql.VarChar(50), input.partyId)
	  request.input('date', sql.VarChar(50), input.generatedate)
	  request.input('total', sql.Decimal(18, 4), input.amount)
	  request.input('taxtot', sql.Decimal(18, 4), input.taxSubTotal)
	  request.input('namt', sql.Decimal(18, 4), input.subTotal)
	  request.input('Tsgst',sql.Decimal(18, 4), input.tsgst)
	  request.input('Tcgst',sql.Decimal(18, 4), input.tcgst)
	  request.input('co', sql.Int, CO)
	  request.input('FY', sql.Int, FY)
	  request.input('uid', sql.VarChar(50), UID)
	  request.input('itmdetail', tvp_item)
	  request.input('Tigst',sql.Decimal(18, 4), input.tigst)
	  request.input('gsttype',sql.VarChar(100), input.taxGType)
	  request.input('rmk',sql.VarChar(250), input.remark)
	  request.input('warehouse',sql.VarChar(100), input.GR_WH)
	  request.input('SInv',sql.VarChar(100), input.invNo)
	  request.input('pchno',sql.VarChar(100), input.chalNo)
	  request.input('roundoff',sql.VarChar(100), input.roundoff)
	  request.input('woramt',sql.VarChar(100), input.woramt)
	  request.input('transmode',sql.VarChar(100), input.transmode)
	  request.input('vehicleno',sql.VarChar(100), input.vehicleno)
	request.execute('dbo.SI_ALL_update', function (err, recordset) {
	if (err){ console.log(err); }
	else
	{
	res.send(recordset);
	}
	}); 
   });

app.get('/api/retrieve_SI_ALL/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.SI_ALL_retrieve', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
		 });
	})
	
app.delete('/api/delete_SI_ALL/:id', function (req, res) { 
	var id=req.params.id;

	var request = new sql.Request();
		request.input('id', sql.VarChar(50), id)
		request.input('co', sql.Int, CO)
		request.input('FY', sql.Int, FY)
		request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
	request.execute('dbo.SI_ALL_delete', function (err, recordset) {
	if (err){ console.log(err);  }
	else
		{
		res.send(recordset);
		}
 });
});

app.get('/api/Account_masters', function (req, res) {
		var request = new sql.Request();  
        request.query("select * from dbo.AM where AM_ST='Active' and AM_CO='"+CO+"' and AM_CP='"+FY+"'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				res.send(recordset);
			}	
		})
	})
	
app.get('/api/JobCardDetails', function (req, res) {
		var data=req.query.filter;
		var batch=data;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('jobid', sql.VarChar(50), batch)
		 request.execute('dbo.Jobcard_details', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
		});
	})

app.get('/api/JobIntake', function (req, res) {
        var request = new sql.Request();  
        request.query("select JBC_ID as Id,convert(varchar(20),JBC_Date,106) As dat,convert(varchar(20),JBC_JIntakeDate,106) As JIdate,dbo.SuppName(JBC_PartyId,'"+CO+"') As supp,JBC_PBatch as Lot,JBC_JBatch as batch,JBC_ISDoneProcess,dbo.CommaProcess(JBC_Process) as procs,convert(decimal(18,2),JBC_TPCS) as tpcs,convert(decimal(18,2),JBC_TMtr) as tmtr from jobcard where JBC_JIntake=1 and JBC_FY='"+FY+"' and JBC_CO='"+CO+"' and isnull(JBC_JIntakeIsdelte,0)!=1 order by convert(int,substring(JBC_ID,3,len(JBC_ID))) desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else
			{
				res.send(recordset);
			}	
        });
   });
   
app.delete('/api/JobIntakeDel/:id', function (req, res) { 
	var input=req.params.id;
	var request = new sql.Request();
		request.input('id', sql.VarChar(50), input)
		request.input('co', sql.Int, CO)
		request.input('FY', sql.Int, FY)
		request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
	request.execute('dbo.JobCardIntake_delete', function (err, recordset) {
	if (err){ console.log(err); }
	else
		{
		res.send(recordset);
		}
 });
});
	
app.post('/api/JobIntake_Insert', function (req, res){ 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('IM_ID', sql.VarChar(200));  
	tvp_item.columns.add('unit', sql.VarChar(50) ); 
	tvp_item.columns.add('qty', sql.Decimal(18,4));
 for (var i = 0; i <input.RecQtyList.length; i++) {  
	   tvp_item.rows.add(i+1,input.RecQtyList[i].item , input.RecQtyList[i].unit,input.RecQtyList[i].Qty);  
	}
 var request = new sql.Request();
   request.input('party',sql.VarChar(100), input.party1)
   request.input('co', sql.Int, CO)
   request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
   request.input('id', sql.VarChar(100), input.JBC_JBatch)
   request.input('idate', sql.VarChar(100), input.JIDate)
   request.input('det', tvp_item)
  request.execute('dbo.JobCardIntake', function (err, recordset) {
  if (err){ console.log(err);   }
  else
	{
	res.send(recordset);
	}
 }); 
});


app.get('/api/packingbatch', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select JBC_JBatch from JobCard where JBC_PartyId='"+id+"' and JBC_CO='"+CO+"' and JBC_ISProcessFinal='done' and (JBC_IsPack='' or JBC_IsPack is null) and JBC_FY='"+FY+"'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				res.send(recordset);
			}           
        });
 });


app.get('/api/dispatchbatch', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select JBC_JBatch from JobCard where JBC_PartyId='"+id+"' and JBC_CO='"+CO+"' and JBC_IsPack=1 and (JBC_IsDispatch='' or JBC_IsDispatch is null or JBC_IsDispatch=0)", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				res.send(recordset);
			}})
});
	
app.get('/api/packingBatchList', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select row_number() over(order by PCK_ID) AS id,PCK_No as itemName,convert(decimal(18,2),PCK_TPCS) as TPCS,convert(decimal(18,2),PCK_TPMTr) as TMTR from Packing where PCK_Batch='"+id+"' and PCK_CO='"+CO+"' and (PCK_ISdispatch='' or PCK_ISdispatch is null or PCK_ISdispatch=0) and  isnull(PCK_IsDel,0)!=1", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				res.send(recordset);
			}
        });
 });

app.get('/api/jobCardRecord', function (req, res) {
		var id=req.query.filter;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('fy', sql.VarChar(50), FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.jobcardPacking', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
			res.send(recordset);
		 }
	});
})
	
app.get('/api/packingManId', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select count(*) as cnt from Packing where PCK_Batch='"+id+"' and PCK_CO='"+CO+"' and PCK_FY='"+FY+"' and  isnull(PCK_IsDel,0)!=1", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				if(recordset.recordset[0].cnt==0){
				recordset.recordset[0].cnt=1;
				res.send(recordset);
			}else
			{
				recordset.recordset[0].cnt++;
				res.send(recordset);
			}}
        });
    });

app.get('/api/packingBatchID', function (req, res) {
		var id=req.query.filter;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('fy', sql.VarChar(50), FY)
		 request.input('batch', sql.VarChar(50), id)
		 request.execute('dbo.PackingAuId', function (err, recordset) {
		 if (err){ console.log(err); 	 }
		 else{
			 console.log(recordset);
			res.send(recordset);
		 }
	});
})
	
app.get('/api/dispatchID', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select convert(varchar(100),isnull(max(convert(int,dbo.GetNumeric(DSP_ID)+1)),1)) as cnt from Dispatch where DSP_CO='"+CO+"' and DSP_FY='"+FY+"'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				if(recordset.recordset[0].cnt==0){
				recordset.recordset[0].cnt=1;
				res.send(recordset);	
			}else{
				recordset.recordset[0].cnt;
				res.send(recordset);
			}
			}
        });
    });

app.get('/api/PackingDetails', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select PCK_ID as id, dbo.SuppName(PCK_Supp,'"+CO+"') as supp,convert(varchar(20),PCK_Dat,106) As dat,PCK_Batch,PCK_NO,dbo.EmpName(PCK_BY,'"+CO+"') as PCK_BY, convert(decimal(18,4),PCK_TPCS) as tpcs,convert(decimal(18,4),PCK_TPMTr) as tmtr,PCK_ISdispatch,PCK_WH from Packing where PCK_CO='"+CO+"' and PCK_FY='"+FY+"' and (PCK_IsDel is null or PCK_IsDel=0) order by convert(int,substring(PCK_ID,4,len(PCK_ID))) desc ", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				res.send(recordset);
				
			}})
 });
	
app.post('/api/packingInsert', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('IM_ID', sql.VarChar(50));  
	tvp_item.columns.add('unit', sql.VarChar(50) ); 
	tvp_item.columns.add('qty', sql.Decimal(18,4));
	tvp_item.columns.add('pqty', sql.Decimal(18,4));
	tvp_item.columns.add('check', sql.VarChar(50));
	tvp_item.columns.add('SrNo', sql.Decimal(18,4));
	tvp_item.columns.add('rmk', sql.VarChar(100));

 for (var i = 0; i <input.RecQtyList.length; i++) {  
	   tvp_item.rows.add(i+1,input.RecQtyList[i].item , input.RecQtyList[i].unit,input.RecQtyList[i].qty,input.RecQtyList[i].pqty,input.RecQtyList[i].checked,input.RecQtyList[i].JBCd_SrNo,input.RecQtyList[i].rmk);  
	} 
 // create Request object
 var request = new sql.Request();
   request.input('party', sql.VarChar(50), input.PM_NAME)
   request.input('date', sql.VarChar(50), input.JDate)
   request.input('no', sql.VarChar(50), input.packgNo)
   request.input('by', sql.VarChar(250), input.pckby)
   request.input('batch', sql.VarChar(50), input.GRCHK_Batch)
   request.input('co', sql.VarChar(100), CO)
   request.input('FY', sql.VarChar(100), FY)
   request.input('uid', sql.VarChar(100), UID)
   request.input('det',tvp_item)
   request.input('tpcs', sql.Decimal(18,2), input.TPCS) 
   request.input('tmtr', sql.Decimal(18,2), input.TMtr)
   request.input('tpmtr', sql.Decimal(18,2), input.TPMtr)
   request.input('pckid', sql.Decimal(18,2), input.pckMainID)
   request.input('godown', sql.VarChar(20), input.PCK_WH)
   request.input('quality', sql.VarChar(20), input.PCK_Quality)
   request.input('fwidth', sql.VarChar(20), input.PCK_FWidth)
   request.execute('dbo.pacing_insert', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});


app.delete('/api/Packing/:id', function (req, res) { 
 var input=req.params.id;
 console.log(input);
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input)
    request.input('co', sql.Int, CO)
	request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
 request.execute('dbo.Packin_delete', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/Packing_retrieve/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('fy', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.Packin_retrieve', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
	});
})

app.post('/api/DispatcInsert', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('batch', sql.VarChar(50));  
	tvp_item.columns.add('packingID', sql.VarChar(50));  
	tvp_item.columns.add('tmtr', sql.Decimal(18,4)); 
	tvp_item.columns.add('tpcs', sql.Decimal(18,4));
 for (var i = 0; i <input.RecQtyList.length; i++) {  
	   tvp_item.rows.add(i+1,input.RecQtyList[i].batch,input.RecQtyList[i].pckid,input.RecQtyList[i].tmtr,input.RecQtyList[i].tpces);
	} 
 // create Request object
 var request = new sql.Request();
   request.input('supp', sql.VarChar(50), input.PM_NAME)
   request.input('date', sql.VarChar(50), input.JDate)
   request.input('dispNo', sql.VarChar(50), input.dispNo)
   request.input('dispby', sql.VarChar(200), input.dspby)
   request.input('vehNo', sql.VarChar(50), input.vhNo)   
   request.input('co', sql.VarChar(100), CO)
   request.input('FY', sql.VarChar(100), FY)
   request.input('uid', sql.VarChar(100), UID)
   request.input('Packid',tvp_item)
   request.input('transport', sql.VarChar(50), input.Transport)
   request.execute('dbo.Dispat_insert', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});


app.get('/api/DispatchView', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select DSP_ID,DSP_DPNO,convert(varchar(20),DSP_Date,106) as dat,dbo.SuppName(DSP_Supp,'"+CO+"') as supp,DSP_Batch,DSP_PackId,convert(decimal(18,2),DSP_TMR) as tmr,convert(decimal(18,2),DSP_TPCS) as tpcs,DSP_VHNO,dbo.EmpName(DSP_DPBY,'"+CO+"') as emp,DSP_InvStatus from Dispatch where DSP_CO='"+CO+"' and DSP_FY='"+FY+"' and isnull(DSP_ISDel,0)!=1   order by convert(int,substring(DSP_ID,4,len(DSP_ID))) desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}	
			else
			{
				res.send(recordset);
			}	
        });
    });
	


app.get('/api/DispatchReport', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var fdate=data.GR_Fdat;
		var tdate=data.GR_Tdat;
		 var request = new sql.Request();
		 request.input('fdate', sql.VarChar(20), fdate)
		 request.input('tdate', sql.VarChar(20), tdate)
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.execute('dbo.DispatchReport', function (err, recordset) {
		 if (err){ console.log(err); 	 }
		 else{
			res.send(recordset);
		 }
		});
	})
	
app.get('/api/finisgoodReport', function (req, res) {
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.execute('dbo.FINISHGOODREPORT', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
	});
})
	
app.get('/api/packReport', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var fdate=data.GR_Fdat;
		var tdate=data.GR_Tdat;
		 var request = new sql.Request();
		 request.input('fdate', sql.VarChar(20), fdate)
		 request.input('tdate', sql.VarChar(20), tdate)
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.execute('dbo.PackingReport', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
	});
})
	
app.get('/api/ProcessPrint/:id', function (req, res) {
		 var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		  request.input('FY', sql.Int, FY)
		  request.input('id', sql.VarChar(50),id)
		 request.execute('dbo.Print_Process', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
	}});
})
	
app.get('/api/ProcessPrintAdd', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var id=data.id;
		var count=data.count;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		  request.input('FY', sql.Int, FY)
		  request.input('count', sql.Int, count)
		  request.input('id', sql.VarChar(50),id)
		 request.execute('dbo.Print_ProcessAdd', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
			res.send(recordset);
		 }
		});
})

app.post('/api/StockInInsert', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('IM_ID', sql.VarChar(100)); 
	tvp_item.columns.add('unit', sql.VarChar(50));
	tvp_item.columns.add('quantity', sql.Decimal(18,4)); 
	tvp_item.columns.add('rate', sql.Decimal(18,4));
 for (var i = 0; i <input.particular.length; i++) {  
	   tvp_item.rows.add(i+1,input.particular[i].IM_NM,input.particular[i].unit,input.particular[i].quantity,input.particular[i].rate);
	   } 
 // create Request object
 var request = new sql.Request();
   request.input('date', sql.VarChar(50), input.GR_Date)
   request.input('employee', sql.VarChar(200), input.EM_NAME)
   request.input('godown', sql.VarChar(100), input.GR_WH)  
   request.input('rmk', sql.VarChar(100), input.rmk) 
   request.input('co', sql.Int, CO)
   request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
   request.input('type', sql.VarChar(50), input.types)
   request.input('detail',tvp_item)
   request.execute('dbo.stock_in', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/StockInList', function (req, res) {
	var id=req.query.filter;
       var request = new sql.Request();  
        request.query("select STCKIN_ID as id,convert(varchar(20),STCKIN_Date,106) as dat,STCKIN_Godown as godown,STCKIN_EMP as emp from stockIn where STCKIN_CO='"+CO+"' and (STCKIN_ISDEL is null or STCKIN_ISDEL='') and STCKIN_FY='"+FY+"' order by convert(int,substring(STCKIN_ID,4,len(STCKIN_ID))) desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				res.send(recordset);
			}		
		})
 });
	
app.get('/api/StockInId/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		  request.input('id', sql.VarChar(50),id)
		 request.execute('dbo.StockIn_Retrieve', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
			res.send(recordset);
		 }
		});
	})
	
app.delete('/api/StockInId/:id', function (req, res) { 
 var input=req.params.id;

 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input)
    request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
   request.input('FY', sql.Int, FY)
 // query to the database and get the data
 request.execute('dbo.Stock_In_Delete', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});

app.post('/api/StockOutInsert', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('IM_ID', sql.VarChar(100)); 
	tvp_item.columns.add('unit', sql.VarChar(50));
	tvp_item.columns.add('quantity', sql.Decimal(18,4)); 
	tvp_item.columns.add('rate', sql.Decimal(18,4));
 for (var i = 0; i <input.particular.length; i++) {  
	   tvp_item.rows.add(i+1,input.particular[i].IM_NM,input.particular[i].unit,input.particular[i].quantity,input.particular[i].rate);
	   } 
 // create Request object
 var request = new sql.Request();
   request.input('date', sql.VarChar(50), input.GR_Date)
   request.input('employee', sql.VarChar(200), input.EM_NAME)
   request.input('godown', sql.VarChar(100), input.GR_WH)  
   request.input('rmk', sql.VarChar(100), input.rmk) 
   request.input('co', sql.Int, CO)
   request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
   request.input('detail',tvp_item)
   request.execute('dbo.Stock_Out', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/StockOutList', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select STCKOUT_ID as id,convert(varchar(20),STCKOUT_Date,106) as dat,STCKOUT_Godown as godown,STCKOUT_EMP as emp from stockOUT where STCKOUT_CO='"+CO+"' and (STCKOUT_ISDEL is null or STCKOUT_ISDEL='') and STCKOUT_FY='"+FY+"' order by convert(int,substring(STCKOUT_ID,4,len(STCKOUT_ID))) desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}
					
			})
 });
	
app.get('/api/StockOutId/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		  request.input('id', sql.VarChar(50),id)
		  request.input('FY', sql.Int, FY)
		 request.execute('dbo.StockOut_Retrieve', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
			res.send(recordset);
		 }
		});
})
	
app.delete('/api/StockOutId/:id', function (req, res) { 
 var input=req.params.id;
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input)
    request.input('co', sql.Int, CO)
	request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
 request.execute('dbo.Stock_Out_Delete', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});


app.get('/api/Printgreyrecieve/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('fy', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.Print_GreyReceive', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
	});
})

app.get('/api/PrintGreyCheck/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('fy', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.Print_GreyCheking', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
	});
})

app.get('/api/PrintPacking/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('fy', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.Print_Packing', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
	});
})

app.get('/api/PrintJobCard/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('CO', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.Print_jobCard', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
			 console.log(recordset);
			res.send(recordset);
		 }
	});
})

app.get('/api/PrintDispatch/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('CO', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.Print_Dispatch', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
			 console.log(recordset);
			res.send(recordset);
		 }
	});
})

app.get('/api/PrintInvoice/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('CO', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.Print_salesInvoice', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
			 console.log(recordset);
			res.send(recordset);
		 }
	});
})

app.get('/api/PrintInvoice_all/:id', function (req, res) {
	var id=req.params.id;
	 var request = new sql.Request();
	 request.input('CO', sql.Int, CO)
	 request.input('FY', sql.Int, FY)
	 request.input('id', sql.VarChar(50), id)
	 request.execute('dbo.Print_salesInvoice_all', function (err, recordset) {
	 if (err){ console.log(err); 	}
	 else{
		 console.log(recordset);
		res.send(recordset);
	 }
});
})

app.post('/api/EmployeeInsert', function (req, res) { 
 var input=req.body; 
 // create Request object
 var request = new sql.Request();
   request.input('name', sql.VarChar(100), input.EM_Name)
   request.input('mail', sql.VarChar(100), input.EM_mail)
   request.input('mob', sql.VarChar(100), input.EM_Mob)  
   request.input('dob', sql.VarChar(100), input.EM_Dob) 
   request.input('add', sql.VarChar(50), input.EM_Add)
   request.input('city', sql.VarChar(100), input.EM_CITY)
   request.input('dist', sql.VarChar(100), input.EM_Dist)  
   request.input('state', sql.VarChar(100), input.EM_State) 
   request.input('pin', sql.VarChar(50), input.EM_PIN)
   request.input('gender', sql.VarChar(100), input.EM_Gender)
   request.input('qualification', sql.VarChar(100), input.EM_Qualification)  
   request.input('photo', sql.VarChar(100), input.EM_Photo) 
   request.input('adhar', sql.VarChar(50), input.EM_Adhar)
   request.input('blood', sql.VarChar(100), input.EM_Blood)
   request.input('locadd', sql.VarChar(100), input.EM_LocAdd)  
   request.input('homeph', sql.VarChar(100), input.EM_HomePH) 
   request.input('jdate', sql.VarChar(50), input.EM_JDate)
   request.input('dep', sql.VarChar(100), input.EM_Dep)
   request.input('des', sql.VarChar(100), input.EM_Des)  
   request.input('cmail', sql.VarChar(100), input.EM_CMail) 
   request.input('sal', sql.Decimal(18,4), input.EM_Salary)
   request.input('pf', sql.VarChar(100), input.EM_PF)
   request.input('esic', sql.VarChar(100), input.EM_ESIC)  
   request.input('bank', sql.VarChar(100), input.EM_Bank) 
   request.input('branch', sql.VarChar(50), input.EM_Branch)
   request.input('bact', sql.VarChar(100), input.EM_BACT)
   request.input('bAcc', sql.VarChar(100), input.EM_BACC)  
   request.input('ifsc', sql.VarChar(100), input.EM_IFSC) 
   request.input('status', sql.VarChar(100), input.EM_St)  
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
   request.execute('dbo.EM_Insert', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/employeeList', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select * from EM where EM_CO='"+CO+"' order by EM_Name asc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
 });

app.get('/api/Employee/:PM_ID', function (req, res) {
	var id=req.params.PM_ID;
        var request = new sql.Request();  
        request.query("select * from EM where EM_CO='"+CO+"' and EM_ID='"+id+"'", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
 });

app.put('/api/EmployeeUpdate/:id', function (req, res) { 
 var input=req.body; 
 // create Request object
 var request = new sql.Request();
	request.input('id', sql.VarChar(100), input.EM_ID)
   request.input('name', sql.VarChar(100), input.EM_Name)
   request.input('mail', sql.VarChar(100), input.EM_mail)
   request.input('mob', sql.VarChar(100), input.EM_Mob)  
   request.input('dob', sql.VarChar(100), input.EM_Dob) 
   request.input('add', sql.VarChar(50), input.EM_Add)
   request.input('city', sql.VarChar(100), input.EM_CITY)
   request.input('dist', sql.VarChar(100), input.EM_Dist)  
   request.input('state', sql.VarChar(100), input.EM_State) 
   request.input('pin', sql.VarChar(50), input.EM_PIN)
   request.input('gender', sql.VarChar(100), input.EM_Gender)
   request.input('qualification', sql.VarChar(100), input.EM_Qualification)  
   request.input('photo', sql.VarChar(100), input.EM_Photo) 
   request.input('adhar', sql.VarChar(50), input.EM_Adhar)
   request.input('blood', sql.VarChar(100), input.EM_Blood)
   request.input('locadd', sql.VarChar(100), input.EM_LocAdd)  
   request.input('homeph', sql.VarChar(100), input.EM_HomePH) 
   request.input('jdate', sql.VarChar(50), input.EM_JDate)
   request.input('dep', sql.VarChar(100), input.EM_Dep)
   request.input('des', sql.VarChar(100), input.EM_Des)  
   request.input('cmail', sql.VarChar(100), input.EM_CMail) 
   request.input('sal', sql.Decimal(18,4), input.EM_Salary)
   request.input('pf', sql.VarChar(100), input.EM_PF)
   request.input('esic', sql.VarChar(100), input.EM_ESIC)  
   request.input('bank', sql.VarChar(100), input.EM_Bank) 
   request.input('branch', sql.VarChar(50), input.EM_Branch)
   request.input('bact', sql.VarChar(100), input.EM_BACT)
   request.input('bAcc', sql.VarChar(100), input.EM_BACC)  
   request.input('ifsc', sql.VarChar(100), input.EM_IFSC) 
   request.input('status', sql.VarChar(100), input.EM_St)  
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
   request.execute('dbo.EM_updte', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});

app.post('/api/Category', function (req, res) { 
 var input=req.body;
 console.log(input);
 var request = new sql.Request();
   request.input('cate', sql.VarChar(100), input.categoryName)
    request.input('pacte', sql.VarChar(100), input.CAT_NAME)
    request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
 request.execute('dbo.Category_Insert', function (err, recordset) {
 
 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }
 });
});


app.get('/api/getCategory', function (req, res) {
	var id=req.params.PM_ID;
        var request = new sql.Request();  
        request.query("select distinct CAT_NAME from category where (CAT_PNAME is  null or CAT_PNAME='') and CAT_CO='"+CO+"'", function (err, recordset) {
            if (err) {
				console.log(err);
			}else { 
				res.send(recordset);	
			}
			})
 });
	
app.get('/api/getallCategory', function (req, res) {
        var request = new sql.Request();  
        request.query("select CAT_NAME,CAT_PName from category where CAT_CO='"+CO+"'", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
 });
	
app.get('/api/manfuringRole', function (req, res) {
        var request = new sql.Request();  
        request.query("select USR_FRM,USR_RLINK,USR_VIEW,USR_SAVE,USR_DEL,USR_Update from USRROLE where USR_CO='"+CO+"' and USR_UID=dbo.UsrID('"+UID+"','"+CO+"') and USR_TYPE='Manufacturing'", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
    
 });
	
app.get('/api/ReportRole', function (req, res) {
        var request = new sql.Request();  
        request.query("select USR_FRM,USR_RLINK,USR_VIEW,USR_SAVE,USR_DEL,USR_Update from USRROLE where USR_CO='"+CO+"' and USR_UID=dbo.UsrID('"+UID+"','"+CO+"') and USR_TYPE='Report'", function (err, recordset) {
            if (err) {
				console.log(err);
			}else { 
				res.send(recordset);		
			}})
 });
 
 app.get('/api/adminRole', function (req, res) {
        var request = new sql.Request();  
        request.query("select USR_FRM,USR_RLINK,USR_VIEW,USR_SAVE,USR_DEL,USR_Update from USRROLE where USR_CO='"+CO+"' and USR_UID=dbo.UsrID('"+UID+"','"+CO+"') and USR_TYPE='admin'", function (err, recordset) {
            if (err) {
				console.log(err);
			}else { 
				res.send(recordset);		
			}})
 });

 app.get('/api/stockmove', function (req, res) {
        var request = new sql.Request();  
        request.query("select USR_FRM,USR_RLINK,USR_VIEW,USR_SAVE,USR_DEL,USR_Update from USRROLE where USR_CO='"+CO+"' and USR_UID=dbo.UsrID('"+UID+"','"+CO+"') and USR_TYPE='Stock Movement'", function (err, recordset) {
            if (err) {
				console.log(err);
			}else { 
				res.send(recordset);		
			}})
 });

 app.get('/api/acountingview', function (req, res) {
        var request = new sql.Request();  
        request.query("select USR_FRM,USR_RLINK,USR_VIEW,USR_SAVE,USR_DEL,USR_Update from USRROLE where USR_CO='"+CO+"' and USR_UID=dbo.UsrID('"+UID+"','"+CO+"') and USR_TYPE='ACCOUNTING'", function (err, recordset) {
            if (err) {
				console.log(err);
			}else { 
				res.send(recordset);		
			}})
 });
	
app.get('/api/otherRole', function (req, res) {
        var request = new sql.Request();  
        request.query("select USR_FRM,USR_RLINK,USR_VIEW,USR_SAVE,USR_DEL,USR_Update from USRROLE where USR_CO='"+CO+"' and USR_UID=dbo.UsrID('"+UID+"','"+CO+"') and USR_TYPE='other'", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
});
	
app.get('/api/mastersRoles', function (req, res) {
        var request = new sql.Request();  
        request.query("select USR_FRM,USR_RLINK,USR_VIEW,USR_SAVE,USR_DEL,USR_Update from USRROLE where USR_CO='"+CO+"' and USR_UID=dbo.UsrID('"+UID+"','"+CO+"') and USR_TYPE='Masters'", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
});
	
// app.get('/api/UserRoles', function (req, res) {
        // var request = new sql.Request();  
        // request.query("select USR_FRM,USR_RLINK,USR_VIEW,USR_SAVE,USR_DEL,USR_Update,USR_TYPE from USRROLE where USR_CO='"+CO+"' and USR_UID=dbo.UsrID('"+UID+"','"+CO+"')", function (err, recordset) {
            // if (err) {
				// console.log(err);
			// }
			// else { 
				// res.send(recordset);	
			// }})
 // });

 app.get('/api/UserRoles', function (req, res) {
	 console.log(req.query.filter);
		var id=req.query.filter;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('uid', sql.VarChar(50), UID)
		 request.input('fy', sql.VarChar(50), id)
		 request.execute('dbo.GetRoles', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
		 });
	})
	
app.post('/api/tAX_Insert', function (req, res) { 
 var input=req.body;
 var request = new sql.Request();
    request.input('name', sql.VarChar(100), input.TAX_Name)
    request.input('igst', sql.VarChar(100), input.TAX_IGST)
	request.input('sgst', sql.VarChar(100), input.TAX_SGST)
	request.input('cgst', sql.VarChar(100), input.TAX_CGST)
    request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
 request.execute('dbo.Insert_Tax', function (err, recordset) {

 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/TMdetails', function (req, res) {
        var request = new sql.Request();  
        request.query("select TAX_ID,TAX_Name,convert(decimal(18,2),TAX_SGST) as TAX_SGST,convert(decimal(18,2),TAX_CGST) as TAX_CGST,convert(decimal(18,2),TAX_IGST) as TAX_IGST from TAX where TAX_CO='"+CO+"'", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
});

app.get('/api/TMdetailsID', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select TAX_ID,TAX_Name,convert(decimal(18,2),TAX_SGST) as TAX_SGST,convert(decimal(18,2),TAX_CGST) as TAX_CGST,convert(decimal(18,2),TAX_IGST) as TAX_IGST from TAX where TAX_CO='"+CO+"' and TAX_ID='"+id+"'", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
});

app.post('/api/tAX_Update', function (req, res) { 
 var input=req.body;
 var request = new sql.Request();
	request.input('id', sql.VarChar(100), input.TAX_ID)
    request.input('name', sql.VarChar(100), input.TAX_Name)
    request.input('igst', sql.VarChar(100), input.TAX_IGST)
	request.input('sgst', sql.VarChar(100), input.TAX_SGST)
	request.input('cgst', sql.VarChar(100), input.TAX_CGST)
    request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
 request.execute('dbo.Update_Tax', function (err, recordset) {

 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

app.post('/api/ProcInsert', function (req, res) { 
 var input=req.body;
 // create Request object
 var request = new sql.Request();
   request.input('name', sql.VarChar(50), input.procName)
    request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
 request.execute('dbo.Proc_insert', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

app.post('/api/DeptInsert', function (req, res) { 
 var input=req.body;
 // create Request object
 var request = new sql.Request();
   request.input('name', sql.VarChar(50), input.procName)
    request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
 request.execute('dbo.Dept_insert', function (err, recordset) {
 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/getProcess', function (req, res) {
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.execute('dbo.Processdetails_retrieve', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }});
});
	
app.get('/api/getDept', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select DEP_ID as id,DEP_NAME as itemName from Department where DEP_CO='"+CO+"'", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
 });

	
app.post('/api/stockSettlement', function (req, res){ 
 var input=req.body;
 console.log(input);	
 var tvp_item = new sql.Table();  
	tvp_item.columns.add('srNo', sql.Decimal(18, 4)); 
	tvp_item.columns.add('IM_ID', sql.VarChar(50));  
	tvp_item.columns.add('unit', sql.VarChar(50)); 
	tvp_item.columns.add('Pqty', sql.Decimal(18, 4));
	tvp_item.columns.add('Aqty', sql.Decimal(18, 4));
	tvp_item.columns.add('Dqty', sql.Decimal(18, 4));
	tvp_item.columns.add('rmk', sql.VarChar(200)); 
 for (var i = 0; i <input.RecQtyList.length; i++) {  
	   tvp_item.rows.add(i+1,input.RecQtyList[i].IM_NM ,input.RecQtyList[i].unit,input.RecQtyList[i].aqty,input.RecQtyList[i].quantity,input.RecQtyList[i].aqty-input.RecQtyList[i].quantity,  input.RecQtyList[i].rmk);  
	}
 var request = new sql.Request();
   request.input('date', sql.VarChar(50), input.JDate)
   request.input('wh', sql.VarChar(50), input.PCK_WH)
   request.input('emp', sql.VarChar(50), input.pckby)
   request.input('co', sql.VarChar(100), CO)
   request.input('FY', sql.VarChar(100), FY)
   request.input('uid', sql.VarChar(100), UID)
   request.input('det',tvp_item)
 request.execute('dbo.STCKST_Insert', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 }); 
});


app.get('/api/StockSettleRet', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select STKST_ID as id,convert(varchar(20),STKST_date,106) as date,dbo.EmpName(STKST_Emp,'"+CO+"') as emp,STKST_WH as wh from STKST where STKST_CO='"+CO+"' and STKST_FY='"+FY+"' order by convert(int,substring(STKST_ID,5,len(STKST_ID))) desc", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
 });
	
app.get('/api/StockSettleRet/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('fy', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.SattleRetrieve', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }});
})

app.delete('/api/stockSettlementdel/:id', function (req, res) {
	var input=req.params.id;

		var request = new sql.Request();
			request.input('id', sql.VarChar(50), input)
			request.input('co', sql.Int, CO)
			request.input('FY', sql.Int, FY)
			request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
		request.execute('dbo.STCKST_Delete', function (err, recordset) {
		if (err){ console.log(err);   }
		else{
			res.send(recordset);
		}});
  });
  
app.get('/api/stockmonthwise', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select dbo.getemItemName(STKMW_ITM,'"+CO+"') as itm,STKMW_UNI,AIMS_TYPE,STKMW_WH,convert(decimal(18,2),STKMW_OPB) as op,convert(decimal(18,2),STKMW_PI) as PIC,convert(decimal(18,2),STKMW_STKIN) as stkIN,convert(decimal(18,2),STKMW_CONS) as cons,convert(decimal(18,2),STKMW_STKOUT) as out, convert(decimal(18,2),(isnull(STKMW_PI,0)+isnull(STKMW_STKIN,0))-(isnull(STKMW_CONS,0)+isnull(STKMW_STKOUT,0)))  as syscls,convert(decimal(18,2),STKMW_Closing) as cls,case when STKMW_Closing!=-0 then  convert(decimal(18,2),isnull(STKMW_Closing,0)- ((isnull(STKMW_PI,0)+isnull(STKMW_STKIN,0))-(isnull(STKMW_CONS,0)+isnull(STKMW_STKOUT,0)))) else 0 end as diff,STKMW_SDate,STMKMW_EDate,convert(decimal(18,2),isnull(STKMW_CONS,0)*isnull(AIMS_PRATE,0)) as val  from STKMW left join AIMSR on (STKMW_ITM=AIMS_ITM and STKMW_UNI=AIMS_UNIT and STKMW_CO=AIMS_CO and STKMW_FY=AIMS_FY and STKMW_WH=AIMS_WH) where  STKMW_Month='"+id+"' and STKMW_CO='"+CO+"' and STKMW_FY='"+FY+"'", function (err, recordset) {
            if (err) {
				console.log(err);
			}else { 
				res.send(recordset);		
			}})
 });
	
app.get('/api/stockReportDaily', function (req, res) {
	console.log(data);
	 var data=JSON.parse(req.query.filter);
		var fdate=data.GR_Fdat;
		var tdate=data.GR_Tdat;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		  request.input('fdate', sql.VarChar(50), fdate)
		 request.input('tdate', sql.VarChar(5), tdate)
		 request.execute('dbo.StockSattleReport', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
	});
});
	
app.get('/api/monthName', function (req, res) {
        var request = new sql.Request();  
        request.query("select distinct STKMW_Month from STKMW where STKMW_CO='"+CO+"' and STKMW_FY='"+FY+"'", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
  });

app.get('/api/getStockAst', function (req, res) {
		var data=JSON.parse(req.query.filter);
		console.log(data);
		var itm=data.itm;
		var unit=data.uni;
		var wh=data.wh;
		var fdate=data.fdat;
		var tdate=data.tdat;
        var request = new sql.Request();  
        request.query("select dbo.getemItemName(AS_IC,'"+CO+"') as itm,convert(varchar(20),AS_TD,106) as dat,AS_TT,convert(decimal(18,2),AS_QTY) as qty,AS_IO from ASTK where AS_IC=dbo.ItemID('"+itm+"','"+CO+"') and AS_UM='"+unit+"' and AS_WH='"+wh+"' and AS_TD between '"+fdate+"' and '"+tdate+"' and AS_CO='"+CO+"' and AS_FY='"+FY+"' order by AS_TD asc ", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);	
		}})
 });

app.post('/api/COALINSERT', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('IM_ID', sql.VarChar(100)); 
	tvp_item.columns.add('unit', sql.VarChar(50));
	tvp_item.columns.add('machine', sql.VarChar(50));
	tvp_item.columns.add('quantity', sql.Decimal(18,4)); 
 for (var i = 0; i <input.RecQtyList.length; i++) {  
	   tvp_item.rows.add(i+1,input.RecQtyList[i].IM_NM,input.RecQtyList[i].unit,input.RecQtyList[i].machine,input.RecQtyList[i].quantity);
	   } 
 // create Request object
 var request = new sql.Request();
   request.input('date', sql.VarChar(50), input.JDate)
   request.input('employee', sql.VarChar(200), input.emp)
   request.input('godown', sql.VarChar(100), input.GR_WH)  
   request.input('rmk', sql.VarChar(100), input.rmk) 
   request.input('co', sql.Int, CO)
   request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
   request.input('detail',tvp_item)
   request.input('tqty', sql.Decimal(18, 4),input.Tqty);
   request.execute('dbo.COAL_CONSUMPTION', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/coalView', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select COAL_ID as id,convert(varchar(20),COAL_Date,106) as dat,dbo.EmpName(COAL_Emp,'"+CO+"') as emp, COAL_WH from COALC where COAL_CO='"+CO+"' and COAL_FY='"+FY+"' and (COAL_ISDEL is null or COAL_ISDEL='') order by COAL_Date desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}	
			else
			{
				res.send(recordset);
			}	
		})
  });
	app.get('/api/coalView/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.COAL_Retrieve', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
		 res.send(recordset);
		 }});
	});
	
app.delete('/api/coalDel/:id', function (req, res) { 
	var input=req.params.id;
	var request = new sql.Request();
		request.input('id', sql.VarChar(50), input)
		request.input('co', sql.Int, CO)
		request.input('FY', sql.Int, FY)
		request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
		request.execute('dbo.COALC_Delete', function (err, recordset) {
		if (err){ console.log(err);  }
		else
			{
			res.send(recordset);
		}
 });
});

app.post('/api/WATERInsert', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('IM_ID', sql.VarChar(100)); 
	tvp_item.columns.add('unit', sql.VarChar(50));
	tvp_item.columns.add('machine', sql.VarChar(50));
	tvp_item.columns.add('quantity', sql.Decimal(18,4));
	tvp_item.columns.add('rate', sql.Decimal(18,4)); 
 for (var i = 0; i <input.RecQtyList.length; i++) {  
	   tvp_item.rows.add(i+1,input.RecQtyList[i].IM_NM,input.RecQtyList[i].unit,input.RecQtyList[i].vhNo,input.RecQtyList[i].quantity,input.RecQtyList[i].rate);
	   } 
 // create Request object
 var request = new sql.Request();
   request.input('date', sql.VarChar(50), input.JDate)
   request.input('employee', sql.VarChar(200), input.emp)
   request.input('party', sql.VarChar(100), input.PM_ID)  
   request.input('chNo', sql.VarChar(100), input.chNo)  
   request.input('rmk', sql.VarChar(100), input.rmk) 
   request.input('co', sql.Int, CO)
   request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
   request.input('detail',tvp_item)
   request.input('tqty', sql.Decimal(18, 4),input.Tqty);
   request.input('capcity', sql.Decimal(18, 4),input.capc);
   request.input('read', sql.Decimal(18, 4),input.read1);
   request.input('tds', sql.Decimal(18, 4),input.tds);
   request.execute('dbo.WANTERTANK_Insert', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/waterTankview', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select WATNK_ID,dbo.SuppName(WATNK_Party,'"+CO+"') as party,convert(varchar(20),WATNK_Date) as dat, dbo.EmpName(WATNK_Emp,'"+CO+"') as emp,WATNK_CHNo,convert(decimal(18,2),WATNK_Qty) as qty from WANTANK where WATNK_CO='"+CO+"' and WATNK_FY='"+FY+"' and (WATNK_ISdel is null or WATNK_ISdel='') order by convert(int,substring(WATNK_ID,4,len(WATNK_ID))) desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}	
			else
			{
				res.send(recordset);
			}	
			})
 });
	
app.get('/api/watertankview/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.WANTERTANK_Retrieve', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
		 res.send(recordset);
		 }});
	});

app.delete('/api/waterTank/:id', function (req, res) { 
	var input=req.params.id;
	var request = new sql.Request();
		request.input('id', sql.VarChar(50), input)
		request.input('co', sql.Int, CO)
		request.input('FY', sql.Int, FY)
		request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
		request.execute('dbo.WANTERTANK_delete', function (err, recordset) {
		if (err){ console.log(err);  }
		else
			{
			res.send(recordset);
			}
	});
});

app.get('/api/trackReport', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.execute('dbo.Track_report', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
		 res.send(recordset);
		 }});
});

app.get('/api/miniumStock', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select top 10 dbo.getemItemName(AIMS_ITM,'"+CO+"') as country,convert(decimal(18,2),AIMS_Qty) as visits from AIMSR where AIMS_CO='"+CO+"' and AIMS_FY='"+FY+"' order by convert(decimal(18,2),AIMS_QTY) asc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				res.send(recordset);
			}	
		})
 });

app.get('/api/dashboardChart', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.execute('dbo.dashboardChartProc', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
		 res.send(recordset);
		 }});
});

	
app.post('/api/WATERREDINGINSERT', function (req, res) { 
 var input=req.body;
 // create Request object
 var request = new sql.Request();
   request.input('dat', sql.VarChar(50), input.JDate)
   request.input('emp', sql.VarChar(200), input.emp)
   request.input('redin', sql.Decimal(18,4), input.readin)  
   request.input('redout', sql.Decimal(18,4), input.readout)  
   request.input('rmk', sql.VarChar(100), input.rmk) 
   request.input('co', sql.Int, CO)
   request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
   request.input('mfactor', sql.Decimal(18,4), input.mfactor)  
   request.input('rate', sql.Decimal(18,4), input.rate)  
   request.input('time', sql.Decimal(18,4), input.time)  
   request.execute('dbo.WATERREDING_INSERT', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/waterReadview', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select WATRED_ID,dbo.EmpName(WATRED_EMP,'"+CO+"') as emp, convert(varchar(20),WATRED_DAT,106) As dat, WATRED_RIN,WATRED_RMK,convert(decimal(18,2),WATRED_MFactor) as mfactor,convert(decimal(18,4),WATRED_Rate) as rate from WATRED where WATRED_CO='"+CO+"' and WATRED_FY='"+FY+"' order by convert(int,substring(WATRED_ID,5,len(WATRED_ID))) desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}	
			else
			{
				res.send(recordset);
			}	
		})
  });

app.get('/api/waterReadview/:id', function (req, res) {
	var id=req.params.id;
        var request = new sql.Request();  
        request.query("select WATRED_ID,dbo.EmpName(WATRED_EMP,'"+CO+"') as emp, convert(varchar(20),WATRED_DAT,106) As dat, WATRED_RIN as readin,WATRED_RMK as rmk,convert(decimal(18,2),WATRED_MFactor) as mfactor,convert(decimal(18,4),WATRED_Rate) as rate  from WATRED where  WATRED_ID='"+id+"' and WATRED_CO='"+CO+"' and WATRED_FY='"+FY+"' order by WATRED_DAT desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}	
        });
 });

app.post('/api/WATERREDINGUPDATE', function (req, res) { 
 var input=req.body;
 // create Request object
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input.WATRED_ID)
   request.input('remp', sql.VarChar(200), input.emplrd)
   request.input('redout', sql.Decimal(18,4), input.readout)  
   request.input('otime', sql.VarChar(200), input.otime) 
   // request.input('rmk', sql.VarChar(100), input.rmk) 
   request.input('co', sql.Int, CO)
   request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
   request.execute('dbo.WATERREDING_update', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/DyingProcssRecord', function (req, res) {
	 var data=JSON.parse(req.query.filter);
		var fdate=data.GR_Fdat;
		var tdate=data.GR_Tdat;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		  request.input('fdate', sql.VarChar(50), fdate)
		 request.input('tdate', sql.VarChar(5), tdate)
		 request.execute('dbo.Production_Process_DyingReport', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
			res.send(recordset);
		 }
	});
})
	
app.get('/api/FinishingProcRecord', function (req, res) {
		 var data=JSON.parse(req.query.filter);
		var fdate=data.GR_Fdat;
		var tdate=data.GR_Tdat;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('fdate', sql.VarChar(50), fdate)
		 request.input('tdate', sql.VarChar(5), tdate)
		 request.execute('dbo.Production_Process_FinishReport', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
	});	
})
app.get('/api/jobCardCost', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var fdate=data.GR_Fdat;
		var tdate=data.GR_Tdat;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.execute('dbo.JobCardCostReport', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }});
})
	
app.post('/api/StoreInsert', function (req, res) { 
 var input=req.body;
 console.log(input);
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('IM_ID', sql.VarChar(100)); 
	tvp_item.columns.add('unit', sql.VarChar(50));
	tvp_item.columns.add('quantity', sql.Decimal(18,4)); 
	tvp_item.columns.add('rate', sql.Decimal(18,4));
 for (var i = 0; i <input.particular.length; i++) {  
	   tvp_item.rows.add(i+1,input.particular[i].IM_NM,input.particular[i].unit,input.particular[i].quantity,input.particular[i].rate);
	   } 
 // create Request object
 var request = new sql.Request();
   request.input('date', sql.VarChar(50), input.GR_Date)
   request.input('employee', sql.VarChar(200), input.EM_NAME)
   request.input('godown', sql.VarChar(100), input.GR_WH)  
   request.input('machine', sql.VarChar(200), input.machine)
   request.input('dept', sql.VarChar(100), input.dept)  
   request.input('rmk', sql.VarChar(100), input.rmk) 
   request.input('co', sql.Int, CO)
   request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
   request.input('detail',tvp_item)
   request.execute('dbo.store_insert', function (err, recordset) {
 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/StoreList', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select store_id as id,convert(varchar(20),STore_Date,106) as dat,Store_Godown as godown,dbo.EmpName(Store_EMP,'"+CO+"') as emp,dbo.deptName(store_dept,'"+CO+"') as dept,dbo.MachineName(store_Machine,'"+CO+"') as machine,convert(decimal(18,4),store_qty) as tqty from store where store_CO='"+CO+"' and (store_ISDEL is null or store_ISDEL='') and store_FY='"+FY+"' order by convert(int,substring(store_id,4,len(store_id))) desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}
});});

app.get('/api/storeret/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		  request.input('id', sql.VarChar(50),id)
		  request.input('FY', sql.Int, FY)
		 request.execute('dbo.Store_Retrieve', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
		});
})

app.delete('/api/Store_Delete/:id', function (req, res) { 
	var input=req.params.id; 
	var request = new sql.Request();
		request.input('id', sql.VarChar(50), input)
		request.input('co', sql.Int, CO)
		request.input('FY', sql.Int, FY)
		request.input('uid', sql.VarChar(50), UID)
		request.execute('dbo.Store_Delete', function (err, recordset) {
		if (err){ console.log(err);  }
		else{
			res.send(recordset);
			}});
});

app.post('/api/ElectInsert', function (req, res) { 
 var input=req.body;
 // create Request objectf
 var request = new sql.Request();
   request.input('date', sql.VarChar(50), input.GR_Date)
   request.input('time', sql.VarChar(200), input.time)
   request.input('emp', sql.VarChar(100), input.emp)  
   request.input('kw', sql.VarChar(200), input.kw)
   request.input('kva', sql.VarChar(100), input.kva)  
   request.input('mf', sql.VarChar(100), input.mfactor) 
   request.input('unitrate', sql.VarChar(100), input.unitrate) 
   request.input('rmk', sql.VarChar(100), input.rmk) 
   request.input('co', sql.Int, CO)
   request.input('FY', sql.Int, FY)
   request.input('uid', sql.VarChar(50), UID)
   request.input('pkw', sql.VarChar(100), input.pkw) 
   request.input('pkva', sql.VarChar(100), input.pkva) 
   request.execute('dbo.Elec_insert', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/waterprvreding', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select isnull(convert(decimal(18,2),WATRED_RIN),0) as prin from WATRED where WATRED_ID= (Select 'WTRD'+ (convert(varchar(100),isnull(max(convert(int,dbo.GetNumeric(WATRED_ID)+1)-1),1))) from WATRED Where WATRED_CO = '"+CO+"' and WATRED_FY='"+FY+"') and WATRED_CO='"+CO+"' and WATRED_FY='"+FY+"'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}	
			else
			{
				res.send(recordset);
			}	
			})
});

app.get('/api/elecprvdata', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select convert(decimal(18,2),ELE_KW) as pkw,convert(decimal(18,2),ELE_KVA) as pkva from electricity where ELE_ID= (Select 'ELC'+ (convert(varchar(100),isnull(max(convert(int,dbo.GetNumeric(ELE_ID)+1)-1),1))) from Electricity Where ELE_CO = '"+CO+"' and ELE_FY='"+FY+"') and ELE_CO='"+CO+"' and ELE_FY='"+FY+"'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				res.send(recordset);
			}})
 });

 app.get('/api/eleccount', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query(" select count(*) as cnt from Electricity where convert(varchar(20),ELE_Date,105)=convert(varchar(20),getdate(),105) and ELE_CO='"+CO+"' and ELE_FY='"+FY+"' and (ELE_ISdel is null or ELE_ISdel='' or ELE_ISdel=0)", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else{
				res.send(recordset);
			}})
 });

app.get('/api/electrview', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select ELE_ID as id,convert(varchar(20),ELE_Date,106) as dat,dbo.EmpName(ELE_EMP,'"+CO+"') as emp, ELE_TIME,convert(decimal(18,2),ELE_KW) as kw, convert(decimal(18,2),ELE_KVA) as kva ,convert(decimal(18,2),ELE_MF) as mf ,convert(decimal(18,2),ELE_URATE) as rate ,ELE_Rmk from Electricity where ELE_CO='"+CO+"' and ELE_FY='"+FY+"' and (ELE_ISdel is null or ELE_ISdel='') order by  convert(int,substring(ELE_ID,4,len(ELE_ID))) desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}	
			else
			{
				res.send(recordset);
			}	
        });
 });
	
app.get('/api/electrview/:id', function (req, res) {
	var id=req.params.id;
        var request = new sql.Request();  
        request.query("select ELE_ID as id,convert(varchar(20),ELE_Date,106) as dat,dbo.EmpName(ELE_EMP,'"+CO+"') as emp, ELE_TIME as time,convert(decimal(18,2),ELE_KW) as kw, convert(decimal(18,2),ELE_KVA) as kva ,convert(decimal(18,2),ELE_MF) as mfactor ,convert(decimal(18,2),ELE_URATE) as unitrate,ELE_Rmk as rmk,convert(decimal(18,2),ELE_PKW) as pkw,convert(decimal(18,2),ELE_PKVA) as pkva from Electricity where ELE_CO='"+CO+"' and ELE_FY='"+FY+"' and ELE_ID='"+id+"' order by ELE_Date desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}	
			else
			{
				res.send(recordset);
			}	
		})
    });

app.delete('/api/electricdel/:id', function (req, res) {
	var id=req.params.id;
        var request = new sql.Request();  
        request.query("update Electricity set ELE_ISdel=1, ELE_ISdelUID=dbo.UsrID('"+UID+"','"+CO+"') where ELE_CO='"+CO+"' and ELE_FY='"+FY+"' and ELE_ID='"+id+"'", function (err, recordset) {
            if (err){ console.log(err); }
			else
			{	
				return res.send(recordset);
			}})
 });
 
app.get('/api/electricreadreport', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var fdate=data.GR_Fdat;
		var tdate=data.GR_Tdat;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('fy', sql.Int, FY)
		 request.input('fdate', sql.VarChar(20), fdate)
		 request.input('tdate', sql.VarChar(20), tdate)
		 request.execute('dbo.electricity_report', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
		 res.send(recordset);
		 }
	});
});

app.get('/api/waterreadReport', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var fdate=data.GR_Fdat;
		var tdate=data.GR_Tdat;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('fy', sql.Int, FY)
		 request.input('fdate', sql.VarChar(20), fdate)
		 request.input('tdate', sql.VarChar(20), tdate)
		 request.execute('dbo.WaterReading_report', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
		 res.send(recordset);
		 }
	});
});
app.get('/api/waterTANKReport', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var fdate=data.GR_Fdat;
		var tdate=data.GR_Tdat;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('fy', sql.Int, FY)
		 request.input('fdate', sql.VarChar(20), fdate)
		 request.input('tdate', sql.VarChar(20), tdate)
		 request.execute('dbo.WaterTANK_report', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
		 res.send(recordset);
		 }
	});
});

app.get('/api/coalConsuReport', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var fdate=data.GR_Fdat;
		var tdate=data.GR_Tdat;
		 var request = new sql.Request();
		 request.input('co', sql.VarChar(20), CO)
		 request.input('fy', sql.VarChar(20), FY)
		 request.input('fdate', sql.VarChar(20), fdate)
		 request.input('tdate', sql.VarChar(20), tdate)
		 request.execute('dbo.CoalCons_report', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
		 res.send(recordset);
		 }
	});
});

app.post('/api/BrokerInsert', function (req, res) { 
 var input=req.body;

 // create Request object
 var request = new sql.Request();
   request.input('name', sql.VarChar(50), input.PM_NAME)
   request.input('email', sql.VarChar(50), input.PM_EMAIL)
   request.input('mob', sql.VarChar(50), input.PM_MOBILE)
   request.input('city', sql.VarChar(50), input.PM_CITY)
   request.input('area', sql.VarChar(100), input.PM_AREA)
   request.input('dist', sql.VarChar(50), input.PM_LOC)
   request.input('state', sql.VarChar(50), input.PM_STATE)
   request.input('country', sql.VarChar(50), input.PM_COUNTRY)
   request.input('pin', sql.VarChar(50), input.PM_PIN)
   request.input('add', sql.VarChar(50), input.PM_ADD)
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(100), UID)
   request.input('status', sql.VarChar(50), input.PM_STATUS)
   request.input('gstNo', sql.VarChar(50), input.PM_GST)
   request.input('panNo', sql.VarChar(50), input.PM_PANNO)
 request.execute('dbo.BM_Insert', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/BrokerName', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select BKR_Name as PM_NAME from BM where BKR_CO='"+CO+"'", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
        });

app.get('/api/BrokerList', function (req, res){
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select BKR_ID as PM_ID,BKR_Name as PM_NAME,BKR_Mob as PM_MOBILE,BKR_GST as PM_GST,BKR_PAN as PM_PANNO,BKR_Email as PM_EMAIL from BM where BKR_CO='"+CO+"' order by BKR_Name asc", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
  });
 
   
  app.get('/api/broker/:id', function (req, res) {
	  var id=req.params.id;
        var request = new sql.Request();  
        request.query("select BKR_ID as PM_ID, BKR_Name as PM_NAME,BKR_Mob as PM_MOBILE,BKR_GST as PM_GST,BKR_PAN as PM_PANNO,BKR_Email as PM_EMAIL,BKR_CITY as PM_CITY,BKR_AREA as PM_AREA,BKR_DIST as PM_LOC, BKR_STATE as PM_STATE,BKR_COUNTRY as PM_COUNTRY,BKR_PIN as PM_PIN,BKR_ADDRESS as PM_ADD,BKR_Status as  PM_STATUS  from BM where BKR_CO='"+CO+"' and BKR_ID='"+id+"' ", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
  });

app.post('/api/BrokerUpdate', function (req, res) { 
 var input=req.body;
 // create Request object
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input.PM_ID)
   request.input('name', sql.VarChar(50), input.PM_NAME)
   request.input('email', sql.VarChar(50), input.PM_EMAIL)
   request.input('mob', sql.VarChar(50), input.PM_MOBILE)
   request.input('city', sql.VarChar(50), input.PM_CITY)
   request.input('area', sql.VarChar(100), input.PM_AREA)
   request.input('dist', sql.VarChar(50), input.PM_LOC)
   request.input('state', sql.VarChar(50), input.PM_STATE)
   request.input('country', sql.VarChar(50), input.PM_COUNTRY)
   request.input('pin', sql.VarChar(50), input.PM_PIN)
   request.input('add', sql.VarChar(50), input.PM_ADD)
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(100), UID)
   request.input('status', sql.VarChar(50), input.PM_STATUS)
   request.input('gstNo', sql.VarChar(50), input.PM_GST)
   request.input('panNo', sql.VarChar(50), input.PM_PANNO)
 request.execute('dbo.BM_update', function (err, recordset) {
 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }
 });
});

  app.get('/api/brokerdet', function (req, res) {
	  var id=req.params.id;
        var request = new sql.Request();  
        request.query("select BKR_ID as PM_ID, BKR_Name as BrokName from BM where BKR_CO='"+CO+"' and BKR_Status='Active' ", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
 });

app.get('/api/storeReport', function (req, res) {
		var data=JSON.parse(req.query.filter);
		var fdate=data.GR_Fdat;
		var tdate=data.GR_Tdat;
		 var request = new sql.Request();
		 request.input('co', sql.VarChar(20),CO)
		 request.input('fy', sql.VarChar(20),FY)
		 request.input('fdate', sql.VarChar(20),fdate)
		 request.input('tdate', sql.VarChar(20),tdate)
		 request.execute('dbo.store_report', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
		 res.send(recordset);
		 }
	});
});
 app.post('/api/transportInsert', function (req, res) { 
 var input=req.body;
  // create Request object
 var request = new sql.Request();
   request.input('name', sql.VarChar(50), input.PM_NAME)
   request.input('status', sql.VarChar(50), input.PM_STATUS)
   request.input('email', sql.VarChar(50), input.PM_EMAIL)
   request.input('contact', sql.VarChar(50), input.PM_MOBILE)
   request.input('website', sql.VarChar(50), input.PM_WEB)
   request.input('fax', sql.VarChar(50), input.PM_FAX)
   request.input('city', sql.VarChar(50), input.PM_CITY)
   request.input('area', sql.VarChar(100), input.PM_AREA)
   request.input('dist', sql.VarChar(50), input.PM_LOC)
   request.input('add', sql.VarChar(50), input.PM_ADD)
   request.input('state', sql.VarChar(50), input.PM_STATE)
   request.input('country', sql.VarChar(50), input.PM_COUNTRY)
   request.input('pin', sql.VarChar(50), input.PM_PIN)
   request.input('gst', sql.VarChar(50), input.PM_GST)
   request.input('pan', sql.VarChar(50), input.PM_PANNO)
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(100), UID)
 request.execute('dbo.TM_Insert', function (err, recordset) {
 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }
 });
});
 app.get('/api/TransportName', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select distinct TM_NAME as PM_NAME from Transport where TM_CO='"+CO+"'", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
 });
 app.get('/api/TransportAll', function (req, res){
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select TM_ID as PM_ID,TM_Name as PM_Name,TM_Contact as PM_MOBILE, TM_Email as PM_EMAIL,TM_GST as PM_GST,TM_PAN as PM_PANNO from transport where TM_CO='"+CO+"' order by TM_Name asc", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
 });
 app.get('/api/TransportRetreive/:id', function (req, res) {
		var id=req.params.id;
		var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.Trasnport_Retrieve', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
		 res.send(recordset);
		 }
		 });
});
 app.put('/api/transportupdate/:id', function (req, res) { 
 var input=req.body;
 // create Request object
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input.id)
   request.input('name', sql.VarChar(50), input.PM_NAME)
   request.input('status', sql.VarChar(50), input.PM_STATUS)
   request.input('email', sql.VarChar(50), input.PM_EMAIL)
   request.input('contact', sql.VarChar(50), input.PM_MOBILE)
   request.input('website', sql.VarChar(50), input.PM_WEB)
   request.input('fax', sql.VarChar(50), input.PM_FAX)
   request.input('city', sql.VarChar(50), input.PM_CITY)
   request.input('area', sql.VarChar(100), input.PM_AREA)
   request.input('dist', sql.VarChar(50), input.PM_LOC)
   request.input('add', sql.VarChar(50), input.PM_ADD)
   request.input('state', sql.VarChar(50), input.PM_STATE)
   request.input('country', sql.VarChar(50), input.PM_COUNTRY)
   request.input('pin', sql.VarChar(50), input.PM_PIN)
   request.input('gst', sql.VarChar(50), input.PM_GST)
   request.input('pan', sql.VarChar(50), input.PM_PANNO)
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(100), UID)
 request.execute('dbo.TM_update', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/getTransport', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select TM_ID,TM_NAME from Transport where TM_CO='"+CO+"' and TM_Status='Active'", function (err, recordset) {
            if (err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
			}})
 });
 
 app.get('/api/disptachRetrieve/:id', function (req, res) {
		var id=req.params.id;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('fy', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 request.execute('dbo.Dispatch_retrieve', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
		 res.send(recordset);
		 }});
}); 

app.delete('/api/disptachdel/:id', function (req, res) { 
	var input=req.params.id;
	var request = new sql.Request();
	request.input('id', sql.VarChar(50), input)
	request.input('co', sql.Int, CO)
	request.input('FY', sql.Int, FY)
	request.input('uid', sql.VarChar(50), UID)
 // query to the database and get the data
	request.execute('dbo.Packin_delete', function (err, recordset) {
	if (err){ console.log(err);  }
	else{
	res.send(recordset);
	}});
 });

 app.get('/api/disptchId', function (req, res) {
		var supp=req.query.filter;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('fy', sql.Int, FY)
		 request.input('party', sql.VarChar(50), supp)
		 request.execute('dbo.dipatchdetails', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
		 res.send(recordset);
		 }});
}); 


 
 app.get('/api/disptchBatch', function (req, res) {
	var par=JSON.parse(req.query.filter);
	var supp=par.PM_NAME;
	var dipId=par.DSP_DPNO;
        var request = new sql.Request();  
        request.query("select distinct DSP_Batch,dbo.getTransportName(DSP_Transporter,'"+CO+"') as transport from Dispatch where DSP_Supp=dbo.SuppId('"+supp+"','"+CO+"') and DSP_DPNO= '"+dipId+"' and DSP_CO='"+CO+"' and DSP_FY='"+FY+"'", function (err, recordset) {
            if (err) {
				console.log(err);
			}else { 
				res.send(recordset);		
			}});
 });
  app.get('/api/dispatchbatchdetails', function (req, res) {
	var par=JSON.parse(req.query.filter);
	var supp=par.PM_NAME;
	var dipId=par.DSP_DPNO;
	var Batch=par.batch;
        var request = new sql.Request();  
        request.query("select convert(decimal(18,2),DSP_TMR) as mtr,convert(decimal(18,2),DSP_TPCS) as tpcs,dbo.[ProcessNamename](JBC_ProcName,'"+CO+"') as prcName from Dispatch left join JobCard on (DSP_Batch=JBC_JBatch and DSP_CO=JBC_CO and DSP_FY=JBC_FY) where DSP_Supp=dbo.SuppId('"+supp+"','"+CO+"') and DSP_DPNO= '"+dipId+"' and DSP_Batch='"+Batch+"' and DSP_CO='"+CO+"' and DSP_FY='"+FY+"'", function (err, recordset) {
            if (err) {
				console.log(err);
			}else { 
				res.send(recordset);		
			}})
 });

  app.get('/api/InvoiceProcess', function (req, res) {
		var supp=req.query.filter;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.execute('dbo.invoiceProcessList', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
		 res.send(recordset);
		 }});
}); 

  app.get('/api/InvoiceId',function(req, res) {
        var request = new sql.Request();  
        request.query("Select (SELECT convert(varchar, isnull(MAX(convert(int,substring([SI_InvNo],0,CHARINDEX('/', [SI_InvNo])))),0) + 1) from SIC Where  SI_CO = '"+CO+"' and SI_FY ='"+FY+"') +'/' + dbo.[FYYear]('"+FY+"') as id", function (err, recordset) {
            if (err) {
				console.log(err);
			}else { 
				res.send(recordset);		
			}})
 });

 app.post('/api/InvoiceInsert', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('Batch', sql.VarChar(100)); 
	tvp_item.columns.add('ProcName', sql.VarChar(100)); 
	tvp_item.columns.add('PCS', sql.Decimal(18,4));
	tvp_item.columns.add('Mtr', sql.Decimal(18,4)); 
	tvp_item.columns.add('rate', sql.Decimal(18,4));
	tvp_item.columns.add('amt', sql.Decimal(18,4)); 
	for (var i = 0; i <input.batchData.length; i++) {  
	   tvp_item.rows.add(i+1,input.batchData[i].batch,input.batchData[i].procssName,input.batchData[i].pcs,input.batchData[i].mtr,input.batchData[i].rate,input.batchData[i].amt);
	 }
var tvp_item1 = new sql.Table();   
	tvp_item1.columns.add('No', sql.Decimal(18, 4));
	tvp_item1.columns.add('Batch', sql.VarChar(50)); 
	tvp_item1.columns.add('ProcId', sql.VarChar(50));
	tvp_item1.columns.add('rate', sql.Decimal(18,4));
	tvp_item1.columns.add('amt', sql.Decimal(18,4)); 
	for (var i = 0; i <input.addprocesdata.length; i++) {  
	   tvp_item1.rows.add(i+1,input.addprocesdata[i].batch,input.addprocesdata[i].PR_ID,input.addprocesdata[i].rate1,input.addprocesdata[i].amt);
	 }
var tvp_item2 = new sql.Table();   
	tvp_item2.columns.add('No', sql.Decimal(18, 4));
	tvp_item2.columns.add('OthId', sql.VarChar(50)); 
	tvp_item2.columns.add('rate', sql.Decimal(18,4));
	tvp_item2.columns.add('amt', sql.Decimal(18,4)); 
	tvp_item2.columns.add('Typ', sql.VarChar(50)); 
	for (var i = 0; i <input.othrrate.length; i++) {  
	   tvp_item2.rows.add(i+1,input.othrrate[i].PR_ID,input.othrrate[i].rate2,input.othrrate[i].amt,input.othrrate[i].chrgtyp);
	 }
 // create Request object
	var request = new sql.Request();
		request.input('invNo', sql.VarChar(20), input.invNo)
		request.input('dat', sql.VarChar(20), input.JDate)
		request.input('party', sql.VarChar(20), input.PM_ID)
		request.input('dcno', sql.VarChar(20), input.DSP_DPNO)
		request.input('transport', sql.VarChar(20), input.transport)
		request.input('lrno', sql.VarChar(20), input.lrno)
		request.input('lrdate', sql.VarChar(20), input.LRDate)
		request.input('taxty', sql.VarChar(200), input.taxtyp)
		request.input('tpc', sql.Decimal(18,4), input.totalpcs)  
		request.input('tmtr', sql.Decimal(18,4), input.totalMtr)  
		request.input('batamt', sql.Decimal(18,4), input.totalbatamt) 
		request.input('procamt', sql.Decimal(18,4), input.totaleproamt)
		request.input('batprocamt', sql.Decimal(18,4), input.totalbatprocamt)
		request.input('disp', sql.Decimal(18,4), input.disp)
		request.input('disamt', sql.Decimal(18,4), input.disAmt)
		request.input('totwidis', sql.Decimal(18,4), input.totalamtwithdis)
		request.input('othchrg', sql.Decimal(18,4), input.totalothchrg)  
		request.input('othtot', sql.Decimal(18,4), input.totamtwotxt)  
		request.input('sgst', sql.Decimal(18,4), input.sgst) 
		request.input('cgst', sql.Decimal(18,4), input.cgst)
		request.input('igst', sql.Decimal(18,4), input.igst)
		request.input('ttax', sql.Decimal(18,4), input.totTax)
		request.input('total', sql.Decimal(18,4), input.totalamt)
		request.input('roundoff', sql.Decimal(18,4), input.roundoff)
		request.input('finalamt', sql.Decimal(18,4), input.finalamt)
		request.input('taxp', sql.Decimal(18,4), input.taxp)
		request.input('co', sql.Int, CO)
		request.input('fy', sql.Int, FY)
		request.input('uid', sql.VarChar(50), UID)
		request.input('sid',tvp_item)
		request.input('sidp',tvp_item1)
		request.input('sioth',tvp_item2)
		console.log(tvp_item); console.log(tvp_item1); console.log(tvp_item2);
		request.execute('dbo.SI_Insert', function (err, recordset) {
		if (err){ console.log(err);   }else{
			res.send(recordset);
		}});
});


app.get('/api/costReport', function (req, res) {
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.execute('dbo.JobCardCostReport', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
		 });
 });
 
app.get('/api/PurchaseReport', function (req, res) {
	var data=JSON.parse(req.query.filter);
		var fdate=data.GR_Fdat;
		var tdate=data.GR_Tdat;
        var request = new sql.Request();  
        request.query("select PI_ID as id,convert(varchar(20),PI_Date,106) as Dat,dbo.SuppName(PI_Supp,'"+CO+"') as supp,PI_GSTTYP as gstyp,PI_PInvNo as invNo,dbo.getemItemName(PID_ITEM,'"+CO+"') as item, PID_UINT as unit,convert(decimal(18,2),PID_QTY) as qty,IM_HSN,convert(decimal(18,2),PID_NAMT) as NA,convert(decimal(18,2),PID_SGST) as sgst,convert(decimal(18,2),PID_CGST) as cgst,convert(decimal(18,2),PID_IGST) as igst,convert(decimal(18,2),PID_Total) as total,PM_GST as gst from PIC left join PID on (PI_ID=PID_ID and PI_CO=PID_CO and PI_FY=PID_FY) left join IM on (PID_ITEM=IM_ID and PID_CO=IM_CO) left join PM on (PI_Supp=PM_ID and PI_CO=PM_CO) where PI_CO='"+CO+"' and PI_FY='"+FY+"' and (PI_Isdel is null or PI_Isdel='' or PI_Isdel=0) and PI_Date between '"+fdate+"' and '"+tdate+"'  order by convert(int,substring(PI_ID,3,len(PI_ID))) desc  ", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
 });

 app.get('/api/PurchaseReportdetails', function (req, res) {
	var id=req.query.filter;
		// var id=id.GR_Fdat;
		// var tdate=data.GR_Tdat;
        var request = new sql.Request();  
        request.query("select dbo.getemItemName(PID_ITEM,'"+CO+"') as itm,PID_UINT as unit,convert(decimal(18,2),PID_QTY) as qty,convert(decimal(18,2),PID_Rate) as rate,case when isnull(PID_SGST,0)=0 then 0.00 else convert(decimal(18,2),PID_SGSTP) end  as sgstp,convert(decimal(18,2),PID_SGST) as sgst,case when isnull(PID_CGST,0)=0 then 0.00 else convert(decimal(18,2),PID_CGSTP) end  as Cgstp,convert(decimal(18,2),PID_CGST) as cgst,case when isnull(PID_IGST,0)=0 then 0.0 else convert(decimal(18,2),PID_IGSTP) end  as igstp,convert(decimal(18,2),PID_IGST) as igst,convert(decimal(18,2),PID_TTAX) as tottax,convert(decimal(18,2),PID_Total) as total from PID where PID_ID='"+id+"' and PID_CO='"+CO+"' and PID_FY='"+FY+"'  ", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
 });
 
 app.get('/api/salesReport', function (req, res) {
	var data=JSON.parse(req.query.filter);
		var fdate=data.GR_Fdat;
		var tdate=data.GR_Tdat;
        var request = new sql.Request();  
        request.query("select SI_ID as id,convert(varchar(20),SI_Date,106) as Dat,dbo.SuppName(SI_Supp,'"+CO+"') as supp,SI_GSTTYP as gstyp,SI_SInvNo as invNo,dbo.getemItemName(SID_ITEM,'"+CO+"') as item, SID_UINT as unit,convert(decimal(18,2),SID_QTY) as qty,IM_HSN,convert(decimal(18,2),SID_NAMT) as NA,convert(decimal(18,2),SID_SGST) as sgst,convert(decimal(18,2),SID_CGST) as cgst,convert(decimal(18,2),SID_IGST) as igst,convert(decimal(18,2),SID_Total) total,PM_GST as gst from SIC_ALL left join SID_ALL on (SI_ID=SID_ID and SI_CO=SID_CO and SI_FY=SID_FY) left join IM on (SID_ITEM=IM_ID and SID_CO=IM_CO) left join PM on (SI_Supp=PM_ID and SI_CO=PM_CO) where SI_CO='"+CO+"' and SI_FY='"+FY+"' and (SI_Isdel is null or SI_Isdel='' or SI_Isdel=0) and SI_Date between '"+fdate+"' and '"+tdate+"'  order by convert(int,substring(SI_ID,3,len(SI_ID))) desc  ", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
 });

 app.get('/api/SalesReportdetails', function (req, res) {
	var id=req.query.filter;
		// var id=id.GR_Fdat;
		// var tdate=data.GR_Tdat;
        var request = new sql.Request();  
        request.query("select dbo.getemItemName(SID_ITEM,'"+CO+"') as itm,SID_UINT as unit,convert(decimal(18,2),SID_QTY) as qty,convert(decimal(18,2),SID_Rate) as rate,case when isnull(SID_SGST,0)=0 then 0.00 else convert(decimal(18,2),SID_SGSTP) end  as sgstp,convert(decimal(18,2),SID_SGST) as sgst,case when isnull(SID_CGST,0)=0 then 0.00 else convert(decimal(18,2),SID_CGSTP) end  as Cgstp,convert(decimal(18,2),SID_CGST) as cgst,case when isnull(SID_IGST,0)=0 then 0.0 else convert(decimal(18,2),SID_IGSTP) end  as igstp,convert(decimal(18,2),SID_IGST) as igst,convert(decimal(18,2),SID_TTAX) as tottax,convert(decimal(18,2),SID_Total) as total from SID_ALL where SID_ID='"+id+"' and SID_CO='"+CO+"' and SID_FY='"+FY+"'  ", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
 });

 app.get('/api/CostReportDetails', function (req, res) {
		var id=req.query.filter;
		 var request = new sql.Request();
		 request.input('id', sql.VarChar(50), id)
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.execute('dbo.Costreportdetails', function (err, recordset) {
		 if (err){ console.log(err); 	}
		 else{
			 console.log(recordset);
			res.send(recordset);
		 }
		 });
 });
 
 app.get('/api/dispTrackDetail', function (req, res) {
	var data=JSON.parse(req.query.filter);
		var batch=data.GR_Batch;
		var id=data.JBC_DispNo;
        var request = new sql.Request();  
        request.query("select dsp_id as id,dbo.suppname(dsp_supp,'"+CO+"') as supp,convert(varchar(20),dsp_date,106) as dat,dsp_packid,convert(decimal(18,2),dsp_tmr) as tmtr,convert(decimal(18,2),dsp_tpcs) as tpcs,dsp_vhno as vehicleno,DSP_DPNO as dcNo,dbo.getTransportName(DSP_Transporter,'"+CO+"') as trans from dispatch where dsp_batch='"+batch+"'  and dsp_co='"+CO+"' and dsp_fy='"+FY+"' and (dsp_isdel='' or dsp_isdel is null) ", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
 });
 
  app.get('/api/invTrackDetails', function (req, res) {
	var id=req.query.filter;
        var request = new sql.Request();  
        request.query("select distinct convert(varchar(20),si_date,106) as dat,SI_InvNo as invNo,SI_LRNo as lrNo,si_dcno,dbo.gettransportname(si_trnasport,1) as trans,si_taxtyp,convert(decimal(18,2),si_tpcs) as tpcs,convert(decimal(18,2),si_tmtr) as tmtr,convert(decimal(18,2),si_ttax)  as tax,convert(decimal(18,2),si_finalamt) as amt from sic left join SID on (SI_ID=SID_ID and SI_CO=SID_CO and SI_FY=SID_FY) where SID_Batch='"+id+"' and si_co='"+CO+"' and si_fy='"+FY+"' and (si_isdel is null or si_isdel='')", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
 });
 
 app.get('/api/invoiceView', function (req, res) {
        var request = new sql.Request();  
        request.query("select SI_ID as id,SI_InvNo as invNo,dbo.SuppName(SI_Party,1) as supp,convert(varchar(20),SI_Date,106) as dat,dbo.getTransportName(SI_Trnasport,1) as trams,SI_DCNO as dcNo,SI_LRNo as lrNo,SI_TaxTyp,convert(decimal(18,2),SI_Tpcs) as tpcs,convert(decimal(18,2),SI_TMtr) as tmtr,convert(decimal(18,2),SI_Ttax)  as tax,convert(decimal(18,2),SI_FinalAmt) as amt from SIC where SI_CO='"+CO+"' and SI_FY='"+FY+"' and (SI_IsDel is null or SI_IsDel='')  order by  convert(int,substring(SI_ID,3,len(SI_ID))) desc,SI_Date desc", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
 });
 
 app.get('/api/sicretrieve', function (req, res) {
		 var id=req.query.filter;
		 var request = new sql.Request();
		 request.input('co', sql.Int, CO)
		 request.input('FY', sql.Int, FY)
		 request.input('id', sql.VarChar(50), id)
		 console.log(id);
		 request.execute('dbo.SIC_Retreive', function (err, recordset) {
		 if (err){ console.log(err); }
		 else{
			res.send(recordset);
		 }
		});
 });
 
 app.get('/api/invdelte', function (req, res) { 
	 var id=req.query.filter;
		var request = new sql.Request();
			request.input('id', sql.VarChar(50), id)
			request.input('co', sql.Int, CO)
			request.input('fy', sql.Int, FY)
			request.input('uid', sql.VarChar(50), UID)
		request.execute('dbo.si_delete', function (err, recordset) {
		if (err){ console.log(err); }
		else{
			res.send(recordset);
		 }});
 });
 
 app.get('/api/jobcardProcStatus', function (req, res) {
	 	var batch=req.query.filter;
        var request = new sql.Request();  
        request.query("select dbo.CommaProcess(JBC_Process) as totprco,case when (JBC_ISDoneProcess is not null or  JBC_ISDoneProcess!='') then dbo.[CommaProcesswithcomma](JBC_ISDoneProcess) else dbo.CommaProcess(JBC_Process) end as donproc from JOBcard where JBC_JBatch='"+batch+"' and JBC_CO='"+CO+"' and JBC_FY='"+FY+"' and isnull(JBC_JIntakeIsdelte,0)!=1 and isnull(JBC_Isdelted,0)!=1 ", function (err, recordset) {
            if (err) {
				console.log(err);
			}
			else { 
				res.send(recordset);		
			}})
 });
 
app.post('/api/procNameInsert', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('Name', sql.VarChar(100)); 
 for (var i = 0; i <input.length; i++) {  
	   tvp_item.rows.add(i+1,input[i].Proc_name);} 
 var request = new sql.Request();
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
   request.input('det',tvp_item)
   request.execute('dbo.ProcName_insert', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }});
});

app.post('/api/procTypeInsert', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('Name', sql.VarChar(100)); 
 for (var i = 0; i <input.length; i++) {  
	   tvp_item.rows.add(i+1,input[i].Proc_typ);} 
 var request = new sql.Request();
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
   request.input('det',tvp_item)
   request.execute('dbo.ProcType_insert', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }});
}); 

app.post('/api/costfreeProcInert', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('Name', sql.VarChar(100)); 
 for (var i = 0; i <input.length; i++) {  
	   tvp_item.rows.add(i+1,input[i].Proc_wocost);} 
 var request = new sql.Request();
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
   request.input('det',tvp_item)
   request.execute('dbo.ProcCOstfree_insert', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }});
}); 

 app.get('/api/procRetrieve', function (req, res) { 
	 var id=req.query.filter;
		var request = new sql.Request();
			request.input('co', sql.Int, CO)
		request.execute('dbo.AllProcRetreive', function (err, recordset) {
		if (err){ console.log(err);  }
		else{
			res.send(recordset);
		}});
 });
 
 app.post('/api/pronameedit', function (req, res) { 
 var input=req.body;
 var id=input.id;
 var name=input.name;
 var request = new sql.Request();
   request.input('co', sql.Int, CO)
   request.input('id', sql.VarChar(50), id)
   request.input('name', sql.VarChar(50), name)
   request.execute('dbo.ProcNameedit', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }});
}); 

 app.post('/api/pronametypeedit', function (req, res) { 
 var input=req.body;
 var id=input.id;
 var name=input.name;
 var request = new sql.Request();
   request.input('co', sql.Int, CO)
   request.input('id', sql.VarChar(50), id)
   request.input('name', sql.VarChar(50), name)
   request.execute('dbo.ProcNameTypeedit', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }});
});

 app.post('/api/proctypeedit', function (req, res) { 
 var input=req.body;
 var id=input.id;
 var name=input.name;
 var request = new sql.Request();
   request.input('co', sql.Int, CO)
   request.input('id', sql.VarChar(50), id)
   request.input('name', sql.VarChar(50), name)
   request.execute('dbo.ProcessEidt', function (err, recordset) {
 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }});
}); 

 app.post('/api/proctypestatusedit', function (req, res) { 
 var input=req.body;
 var id=input.id;
 var name=input.name;
 var request = new sql.Request();
   request.input('co', sql.Int, CO)
   request.input('id', sql.VarChar(50), id)
   request.input('name', sql.VarChar(50), name)
   request.execute('dbo.ProcessStatusEidt', function (err, recordset) {
 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }});
}); 

 app.post('/api/editcostfreeproc', function (req, res) { 
 var input=req.body;
 var id=input.id;
 var name=input.name;
 var request = new sql.Request();
   request.input('co', sql.Int, CO)
   request.input('id', sql.VarChar(50), id)
   request.input('name', sql.VarChar(50), name)
   request.execute('dbo.ProcesscostfreeEdit', function (err, recordset) {
 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }});
}); 

 app.post('/api/editcostfreeStatusproc', function (req, res) { 
 var input=req.body;
 var id=input.id;
 var name=input.name;
 var request = new sql.Request();
   request.input('co', sql.Int, CO)
   request.input('id', sql.VarChar(50), id)
   request.input('name', sql.VarChar(50), name)
   request.execute('dbo.ProcesscostfreeSatusEdit', function (err, recordset) {
 if (err){ console.log(err); }
 else
 {
 res.send(recordset);
 }});
}); 

  app.get('/api/stockinreport', function (req, res) {
	  var data=JSON.parse(req.query.filter);
	  var fdate=data.GR_Fdat;
	  var tdate=data.GR_Tdat;
        var request = new sql.Request();  
        request.query("select STCKIN_ID as id,convert(varchar(20),STCKIN_Date,106) as dat,STCKIN_Godown as wh,dbo.getemItemName(STCKIND_ITEM,'"+CO+"') as itm,STCKIND_UNIT,convert(decimal(18,2),STCKIND_Qty) as qty,convert(decimal(18,2),STCKIND_RATE) as rat,convert(decimal(18,2),(isnull(STCKIND_Qty,0)*isnull(STCKIND_Rate,0))) as amt,STCKIN_RMK as rmk from stockIn left join StockIndetails on (STCKIN_ID=STCKIND_ID and STCKIN_CO=STCKIND_CO and STCKIN_FY=STCKIND_FY) where STCKIN_CO='"+CO+"' and STCKIN_FY='"+FY+"' and STCKIN_Date between '"+fdate+"' and '"+tdate+"'   order by STCKIN_Date desc", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else
			{
				res.send(recordset);
			}			
			});
 });
 
   app.get('/api/stockoutreport', function (req, res) {
	  var data=JSON.parse(req.query.filter);
	  var fdate=data.GR_Fdat;
	  var tdate=data.GR_Tdat;
        var request = new sql.Request();  
        request.query("select STCKOUT_ID as id,convert(varchar(20),STCKOUT_Date,106) as dat,STCKOUT_Godown as wh,dbo.getemItemName(STCKOUTD_ITEM,'"+CO+"') as itm,STCKOUTD_UNIT,convert(decimal(18,2),STCKOUTD_Qty) as qty,convert(decimal(18,2),STCKOUTD_RATE) as rat,convert(decimal(18,2),(isnull(STCKOUTD_Qty,0)*isnull(STCKOUTD_Rate,0))) as amt,STCKOUT_RMK as rmk from stockOut left join StockOutdetails on (STCKOUT_ID=STCKOUTD_ID and STCKOUT_CO=STCKOUTD_CO and STCKOUT_FY=STCKOUTD_FY) where STCKOUT_CO='"+FY+"' and STCKOUT_FY='"+FY+"' and STCKOUT_Date between '"+fdate+"' and '"+tdate+"'   order by STCKOUT_Date desc  ", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else
			{
				res.send(recordset);
			}			
			})
 });
 
app.post('/api/othChargeInsert', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('Name', sql.VarChar(100)); 
 for (var i = 0; i <input.length; i++) {  
	   tvp_item.rows.add(i+1,input[i].Proc_name);} 
 var request = new sql.Request();
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
   request.input('det',tvp_item)
   request.execute('dbo.Othercharge_insert', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);;
 }});
 });

 app.get('/api/othchrgeRet', function (req, res) { 
	 var id=req.query.filter;
		var request = new sql.Request();
			request.input('co', sql.Int, CO)
		request.execute('dbo.OthrCharge_retrieve', function (err, recordset) {
		if (err){ console.log(err);  }
		else{
			res.send(recordset);
		}});
 });
 
 

 app.post('/api/othrchrgedit', function (req, res) { 
 var input=req.body;
 var id=input.id;
 var name=input.name;
 console.log(input);
	var request = new sql.Request();
		request.input('co', sql.Int, CO)
		request.input('id', sql.VarChar(50), id)
		request.input('name', sql.VarChar(50), name)
		request.execute('dbo.othchrgeedit', function (err, recordset) {
	if (err){ console.log(err);   }
		else
		{
		res.send(recordset);
	}});
}); 

app.post('/api/InvProcInsert', function (req, res) { 
 var input=req.body;
 console.log(input);
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.Decimal(18, 4));
	tvp_item.columns.add('Name', sql.VarChar(100)); 
 for (var i = 0; i <input.length; i++) {  
	   tvp_item.rows.add(i+1,input[i].procname);} 
 var request = new sql.Request();
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(50), UID)
   request.input('det',tvp_item)
   request.execute('dbo.InvoiceProc_insert', function (err, recordset) {
 if (err){ console.log(err);   }
 else
 {
 res.send(recordset);
 }});
});

 app.post('/api/invProcedit', function (req, res) {
 var input=req.body;
 var id=input.id;
 var name=input.name;
	var request = new sql.Request();
		request.input('co', sql.Int, CO)
		request.input('id', sql.VarChar(50), id)
		request.input('name', sql.VarChar(50), name)
		request.execute('dbo.InvoiceProc_Update', function (err, recordset) {
	if (err){ console.log(err); }
		else
		{
		res.send(recordset);
	}});
}); 

app.post('/api/usrInsert', function (req, res) { 
 var input=req.body;
 // create Request object
 var request = new sql.Request();
   request.input('name', sql.VarChar(50), input.name)
   request.input('pass', sql.VarChar(50), input.confirmPassword)
   request.input('empid', sql.VarChar(50), input.emp)
   request.input('co', sql.Int, CO)
 request.execute('dbo.User_insert', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

app.post('/api/passwordupdate', function (req, res) { 
 var input=req.body;
 // create Request object
 var request = new sql.Request();
   request.input('id', sql.VarChar(50), input.emp)
   request.input('pass', sql.VarChar(50), input.confpass)
   request.input('co', sql.Int, CO)
 request.execute('dbo.updatePassword', function (err, recordset) {
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

app.get('/api/userName', function (req, res) { 
	 var usrname=req.query.filter;
		var request = new sql.Request();
			request.input('co', sql.Int, CO)
		request.execute('dbo.usrRecord', function (err, recordset) {
		if (err){ console.log(err); }
		else{
			res.send(recordset);
		}});
 });
 
 
app.get('/api/usrRoles', function (req, res) { 
	 var input=JSON.parse(req.query.filter);
	 var frm=input.frm;
	 var usrname=input.emp;

		var request = new sql.Request();
			request.input('frmtyp', sql.VarChar(50), frm)
			request.input('usrname', sql.VarChar(50), usrname)
			request.input('co', sql.Int, CO)
		request.execute('dbo.USERACEESS', function (err, recordset) {
		if (err){ console.log(err);  }
		else{
			res.send(recordset);
		}});
 });
 
app.post('/api/userRoleInsert', function (req, res) { 
	var input=req.body;
	var tvp_item = new sql.Table();   
		tvp_item.columns.add('No', sql.Decimal(18, 4));
		tvp_item.columns.add('FRMN', sql.VarChar(50)); 
		tvp_item.columns.add('TYP', sql.VarChar(50));
		tvp_item.columns.add('Rlink', sql.VarChar(50)); 
		tvp_item.columns.add('save', sql.VarChar(10));
		tvp_item.columns.add('view', sql.VarChar(10)); 
		tvp_item.columns.add('delete', sql.VarChar(10)); 
		console.log(input.usrroles);
		for (var i = 0; i <input.usrroles.length; i++) {  
			tvp_item.rows.add(i+1,input.usrroles[i].name,input.usrroles[i].typ,input.usrroles[i].rlink,input.usrroles[i].saver,input.usrroles[i].viewr,input.usrroles[i].delr);} 
			var request = new sql.Request();
			request.input('co', sql.Int, CO)
			request.input('username', sql.VarChar(50), input.emp)
			request.input('type', sql.VarChar(50), input.frm)
			request.input('details',tvp_item)
			
			request.execute('dbo.InsertUserRoles', function (err, recordset) {
			if (err){ console.log(err);  }
			else
				{
				res.send(recordset);
			}});
});

app.post('/api/voucheerPayment', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.VarChar(50));  
	tvp_item.columns.add('DA', sql.VarChar(50)); 
	tvp_item.columns.add('BPT', sql.VarChar(50));
	tvp_item.columns.add('CHNO', sql.VarChar(50));
	tvp_item.columns.add('CHDAT', sql.VarChar(50));
	tvp_item.columns.add('AMT', sql.Decimal(18, 4));
	tvp_item.columns.add('RMK', sql.VarChar(50));
	for (var i = 0; i <input.particular.length; i++) {  
	   tvp_item.rows.add(i+1,input.particular[i].partyId, input.particular[i].bankpaytype,input.particular[i].chequeno,input.particular[i].chequdedate,input.particular[i].amount,input.particular[i].rmk);  
	} 
	var tvp_item2 = new sql.Table();   
	tvp_item2.columns.add('No', sql.VarChar(50));  
	tvp_item2.columns.add('IM_ID', sql.VarChar(50)); 
	tvp_item2.columns.add('Party_invid', sql.VarChar(50));
	tvp_item2.columns.add('amt', sql.Decimal(18,2)); 
	tvp_item2.columns.add('payamt', sql.Decimal(18,2));
	for (var i = 0; i <input.invoieList.length; i++) {  
		tvp_item2.rows.add(i+1,input.invoieList[i].id, input.invoieList[i].itemName, input.invoieList[i].amt, input.invoieList[i].payamt);  
	 } 
   var request = new sql.Request();
   request.input('date', sql.VarChar(20), input.generatedate)
   request.input('pytp', sql.VarChar(10), input.Pay_typ)
   request.input('accname', sql.VarChar(20), input.accname)
   request.input('tbl2', tvp_item2)
   request.input('invoicenolist', sql.VarChar(200), input.invoicePartyIdlist)
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(10), UID)
   request.input('fy', sql.Int, FY)
   request.input('tbl',tvp_item)
   console.log(input);
 request.execute('dbo.MVP_Insert', function (err, recordset) {
 
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

 app.get('/api/voucherPaymentretrieve', function (req, res) {
        var request = new sql.Request();  
        request.query("select MVP_ID as id , convert(varchar(20),MVP_DT,106) as dat,MVP_PYMNTT as PYTYP,dbo.ACCOUNTNAME( MVP_BNKAC,'"+CO+"') as AC,dbo.ACCOUNTNAME(MVP_PAYAC,'"+CO+"') as PAYEE , convert(decimal(18,2),MVP_Amt) as amt,MVP_RMK as rmk from MVP where MVP_CO='"+CO+"' and MVP_FY='"+FY+"' and (MVP_IsDel is null or MVP_IsDel='' or MVP_IsDel!=1)  ", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else
			{
				res.send(recordset);
			}			
		})
 });
 
  app.get('/api/voucherPayRetrievedetails/:id', function (req, res) { 
	 var id=req.params.id;
		var request = new sql.Request();
			request.input('id', sql.VarChar(50), id)
			request.input('co', sql.Int, CO)
			request.input('fy', sql.Int, FY)
		request.execute('dbo.MVP_Retrieve', function (err, recordset) {
		if (err){ console.log(err); }
		else{
			res.send(recordset);
		 }});
 });
 
 app.get('/api/voucherpaymentdel', function (req, res) { 
	 var input=JSON.parse(req.query.filter);
	 var request = new sql.Request();
	 request.input('id', sql.VarChar(50), input.id)
	 request.input('payacc', sql.VarChar(50), input.party)
	 request.input('amt', sql.VarChar(50), input.amount)
	 request.input('co', sql.Int, CO)
	 request.input('FY', sql.Int, FY)
	 request.input('uid', sql.VarChar(50), UID)
 // // query to the database and get the data
	 request.execute('dbo.MVP_Delete', function (err, recordset) {
	 if (err){ console.log(err);  }
	 else{
	 res.send(recordset);
	 }});
 });

app.post('/api/voucheerReciept', function (req, res) { 
 var input=req.body;
 var tvp_item = new sql.Table();   
	tvp_item.columns.add('No', sql.VarChar(50));  
	tvp_item.columns.add('DA', sql.VarChar(50)); 
	tvp_item.columns.add('BPT', sql.VarChar(50));
	tvp_item.columns.add('CHNO', sql.VarChar(50));
	tvp_item.columns.add('CHDAT', sql.VarChar(50));
	tvp_item.columns.add('AMT', sql.Decimal(18, 4));
	tvp_item.columns.add('RMK', sql.VarChar(50));
	for (var i = 0; i <input.particular.length; i++) {  
	   tvp_item.rows.add(i+1,input.particular[i].partyId, input.particular[i].bankpaytype,input.particular[i].chequeno,input.particular[i].chequdedate,input.particular[i].amount,input.particular[i].rmk);  
	} 
	var tvp_item2 = new sql.Table();   
	tvp_item2.columns.add('No', sql.VarChar(50));  
	tvp_item2.columns.add('IM_ID', sql.VarChar(50)); 
	tvp_item2.columns.add('Party_invid', sql.VarChar(50));
	tvp_item2.columns.add('amt', sql.Decimal(18,2)); 
	tvp_item2.columns.add('payamt', sql.Decimal(18,2));
	for (var i = 0; i <input.invoieList.length; i++) {  
		tvp_item2.rows.add(i+1,input.invoieList[i].id, input.invoieList[i].itemName, input.invoieList[i].amt, input.invoieList[i].payamt);  
	 } 

	var request = new sql.Request();
   request.input('date', sql.VarChar(20), input.generatedate)
   request.input('pytp', sql.VarChar(10), input.Pay_typ)
   request.input('accname', sql.VarChar(20), input.accname)
   request.input('tbl2', tvp_item2)
   request.input('invoicenolist', sql.VarChar(200), input.invoicePartyIdlist)
   request.input('co', sql.Int, CO)
   request.input('uid', sql.VarChar(10), UID)
   request.input('fy', sql.Int, FY)
   request.input('tbl',tvp_item)
   console.log(input);
 request.execute('dbo.MVR_Insert', function (err, recordset) {
 
 if (err){ console.log(err);  }
 else
 {
 res.send(recordset);
 }
 });
});

 app.get('/api/voucherRecieptretrieve', function (req, res) {
        var request = new sql.Request();  
        request.query("select MVR_ID as id , convert(varchar(20),MVR_DT,106) as dat,MVR_PYMNTT as PYTYP,dbo.ACCOUNTNAME(MVR_BNKAC,'"+CO+"') as AC,dbo.ACCOUNTNAME(MVR_PAYAC,'"+CO+"') as PAYEE , convert(decimal(18,2),MVR_Amt) as amt,MVR_RMK as rmk from MVR where MVR_CO='"+CO+"' and MVR_FY='"+FY+"' and (MVR_IsDel is null or MVR_IsDel='' or MVR_IsDel!=1)  ", function (err, recordset) {
            if (err) { 
				console.log(err);
			}
			else
			{
				res.send(recordset);
			}			
		})
 });

 app.get('/api/getPurchaseInvoiceList', function (req, res) {
	var request = new sql.Request();  
	request.input('co', sql.Int, CO)
	request.input('fy', sql.Int, FY)
	request.query("select distinct PI_ID as id, PI_PInvNo as itemName,(isnull(PI_Total,0)-isnull(PI_PayAmt,0)) as amt,(isnull(PI_Total,0)-isnull(PI_PayAmt,0)) as payamt from PIC where PI_CO='"+CO+"' and PI_FY='"+FY+"' and  (PI_IsDel!=1 or PI_IsDel is null) and (PI_IsPayment!=1 or PI_IsPayment is null or PI_IsPayment=0) ", function (err, recordset) {
		if (err) { 
			console.log(err);
		}else{
			res.send(recordset);
		}			
	})
});

app.get('/api/getSalesInvoiceList', function (req, res) {
	var request = new sql.Request();  
	request.input('co', sql.Int, CO)
	request.input('fy', sql.Int, FY)
	request.query("select distinct SI_ID as id, SI_ID as itemName,(isnull(SI_Total,0)-isnull(SI_PayAmt,0)) as amt,(isnull(SI_Total,0)-isnull(SI_PayAmt,0)) as payamt from SIC_ALL where SI_CO='"+CO+"' and SI_FY='"+FY+"' and  (SI_IsDel!=1 or SI_IsDel is null) and (SI_IsPayment!=1 or SI_IsPayment is null or SI_IsPayment=0) ", function (err, recordset) {
		if (err) { 
			console.log(err);
		}else{
			res.send(recordset);
		}			
	})
});

  app.get('/api/voucherPecieptRetrievedetails/:id', function (req, res) { 
	 var id=req.params.id;
		var request = new sql.Request();
			request.input('id', sql.VarChar(50), id)
			request.input('co', sql.Int, CO)
			request.input('fy', sql.Int, FY)
		request.execute('dbo.MVR_Retrieve', function (err, recordset) {
		if (err){ console.log(err); }
		else{
			res.send(recordset);
		 }});
 });
 
  app.get('/api/voucherrecieptdel', function (req, res) { 
	 var input=JSON.parse(req.query.filter);
	 var request = new sql.Request();
	 request.input('id', sql.VarChar(50), input.id)
	 request.input('payacc', sql.VarChar(50), input.party)
	 request.input('amt', sql.VarChar(50), input.amount)
	 request.input('co', sql.Int, CO)
	 request.input('FY', sql.Int, FY)
	 request.input('uid', sql.VarChar(50), UID)
 // // query to the database and get the datavoucherrecieptdel
	 request.execute('dbo.MVR_Delete', function (err, recordset) {
	 if (err){ console.log(err);  }
	 else{
	 res.send(recordset);
	 }});
 });
 
  app.get('/api/accountlist', function (req, res) {
	var type=req.query.filter;
        var request = new sql.Request();  
        request.query("select AM_ID,AM_AN from AM where AM_CO='"+CO+"' ", function (err, recordset) {
            if(err) { 
				console.log(err);
			}else
			{
				res.send(recordset);
				}})
    });
 
	app.get('/api/Accoutnledger', function (req, res) {
		var request = new sql.Request();
		var input=JSON.parse(req.query.filter);
		console.log(input);
		request.input('accid', sql.VarChar(50), input.PM_ID)
		request.input('date', sql.VarChar(20), input.GR_Fdat)
		request.input('edate', sql.VarChar(20), input.GR_Tdat)
		request.input('co', sql.Int, CO)
		request.input('fyID', sql.Int, FY)	
		request.execute('dbo.AccountLedger', function (err, recordset) {
		if (err){ console.log(err); }
		else{
		   res.send(recordset);
		}
		});
})	
	
var server = app.listen(5000,function(){
    console.log('Server is running..');
});