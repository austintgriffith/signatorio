const fs = require('fs');
const awsCreds = JSON.parse(fs.readFileSync("aws.json").toString().trim())
const s3 = require('s3');
const AWS = require('aws-sdk')

function uploadToS3(site,target) {
    //Setup
    var client = s3.createClient({
      s3Options: awsCreds,
    });
    uploadParams = buildS3Params(site)
  
    //Prep index
    let index = fs.readFileSync("build/index.html").toString();
    index = index.split("\"\/").join("\"");
    fs.writeFileSync("build/index.html",index);
  
    //Upload
    fs.readdir( uploadParams.localDir , function( err, files ) {
      if( err ) {
        console.error( "Could not list the directory.", err );
        process.exit( 1 );
      }
  
      var uploader = client.uploadDir(uploadParams);
      uploader.on('error', function(err) {
        console.error("unable to sync:", err.stack);
      });
      uploader.on('progress', function() {
        console.log("progress", uploader.progressAmount, uploader.progressTotal);
      });
      uploader.on('end', function() {
        console.log("done uploading "+site);
        var cloudfront = new AWS.CloudFront(new AWS.Config(awsCreds));
        var cfparams = {
        DistributionId: target,
        InvalidationBatch: {
            CallerReference: ''+(new Date()),
            Paths: {
            Quantity: 1,
            Items: ["/*"]
            }
        }
        };
        cloudfront.createInvalidation(cfparams, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        });
      });
    })
  }


function buildS3Params(site) {
    site = site.toLowerCase()
  
    if(site.indexOf(".") <0){
      site = site + ".io"
    }
  
    var uploadParams = {
      localDir: "build",
      s3Params: {
        Bucket: site,
        Prefix: "",
        ACL: "public-read"
      }
    }
  
    return uploadParams
  }



  uploadToS3("signator.io","EQ7GCXD60HYON")