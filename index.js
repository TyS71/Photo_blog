const bodyParser = require('body-parser'),
      mongoose = require('mongoose'), 
      methodOverride = require('method-override'),
      express = require('express'),
      app = express(),
      multer = require('multer'),
      crypto = require('crypto'),
      fs = require('fs'),
      Photo = require('./models/photos.js'),
      Place = require('./models/place.js');

mongoose.connect('mongodb://localhost/brittanySite');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/photos/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
          cb(null, raw.toString('hex') + Date.now());
      });
    }
  })

const upload = multer({
      storage: storage
});


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.get('/', function(req, resp){
      Place.find({}, function(err, found){
            if(err){
                  console.log(err);
            }else{
                  resp.render('home', {places: found});
            }
      })
})

app.post('/', upload.single('image') ,function(req, resp){
      Place.create({
            name: req.body.name,
            description: req.body.description,
            mainImage: req.file.filename
      },function(err, place){
        if(err){
            console.log(err);
        }
        else{
            resp.redirect('/'); 
        }
    });
})

app.get('/addTrip',function(req,resp){
      resp.render('addTrip');
});

app.get('/:id', function(req, resp){
      Place.findById(req.params.id).populate('images').exec( function(err, foundPlace){
          if(err){
           console.log(err);
          }else{
           resp.render('place', {place: foundPlace});
         }
      })
})

app.get('/:id/addImage', function(req, resp){
      Place.findById(req.params.id, function(err, foundPlace){
            if(err){
                  console.log(err)
            }else{
                  resp.render('addImage', {place: foundPlace});
            }
      })
})

app.post('/:id', upload.single('image'), function(req, resp){
      Place.findById(req.params.id, function(err, foundPlace){
            if(err){
                  console.log(err)
            }else{
                  Photo.create({
                        image: req.file.filename
                  }, function(err, image){
                        if(err){
                              console.log(err)
                        }else{
                              image.save();
                              foundPlace.images.push(image);
                              foundPlace.save();
                              resp.redirect('/' + req.params.id);
                        }
                  })
            }
      })
});

app.delete('/:id/:img', function(req, resp){
      Photo.findByIdAndDelete(req.params.img, function(err, foundImage){
            if(err){
                  console.log(err)
            }else{
                  fs.unlink('./public/photos/' + foundImage.image, function(err){
                        if(err){
                              console.log(err);
                        }
                  })
                  resp.redirect('/' + req.params.id);
            }
      })
});

// edit cover image, description, and name;
// make middleware to confirm before you delete an item; also make a delete whole album button;


app.listen(8000, function(){
   console.log('Brittany\'s server running...'); 
});