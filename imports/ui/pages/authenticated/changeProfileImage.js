Template.changeProfileImage.onRendered( () => {
  cropInit();
  //console.log('check in changeProfileImage...');
});

Template.changeProfileImage.helpers({
});

Template.changeProfileImage.events({
  'click .cancelChangeProfileImage': function() {
    Session.set('showProfileCard', true);
    Session.set('showChangeProfileImage', false);
  }
});

function cropInit() {
  var console = window.console || { log: function () {} };
  var $image = $('#image');
  var $dataX = $('#dataX');
  var $dataY = $('#dataY');
  var $dataHeight = $('#dataHeight');
  var $dataWidth = $('#dataWidth');
  var $dataRotate = $('#dataRotate');
  var $dataScaleX = $('#dataScaleX');
  var $dataScaleY = $('#dataScaleY');
  var options = {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: parseInt($image.data('aspect-ratio')),
      guides: false,
      highlight: false,
      // autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
      crop: function (e) {
        $dataX.val(Math.round(e.x));
        $dataY.val(Math.round(e.y));
        $dataHeight.val(Math.round(e.height));
        $dataWidth.val(Math.round(e.width));
        $dataRotate.val(e.rotate);
        $dataScaleX.val(e.scaleX);
        $dataScaleY.val(e.scaleY);
      }
  };

  // Cropper
  $image.on({
    'build.cropper': function (e) {
      // console.log(e.type);
    },
    'built.cropper': function (e) {
      // console.log(e.type);
    },
    'cropstart.cropper': function (e) {
      // console.log(e.type, e.action);
    },
    'cropmove.cropper': function (e) {
      // console.log(e.type, e.action);
    },
    'cropend.cropper': function (e) {
      // console.log(e.type, e.action);
    },
    'crop.cropper': function (e) {
      // console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
    },
    'zoom.cropper': function (e) {
      // console.log(e.type, e.ratio);
    }
  }).cropper(options);

  $('.btn-rotate, .btn-crop').addClass('btn-none');

  // Buttons
  if (!$.isFunction(document.createElement('canvas').getContext)) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }

  // Methods
  $('.crop-acts').on('click', '[data-method]', function () {
    var $this = $(this);
    var data = $this.data();
    var $target;
    var result;

    if ($this.prop('disabled') || $this.hasClass('disabled')) {
      return;
    }

    if ($image.data('cropper') && data.method) {
      data = $.extend({}, data); // Clone a new one

      if (typeof data.target !== 'undefined') {
        $target = $(data.target);

        if (typeof data.option === 'undefined') {
          try {
            data.option = JSON.parse($target.val());
          } catch (e) {
            // console.log(e.message);
          }
        }
      }

      result = $image.cropper(data.method, data.option, data.secondOption);

      switch (data.method) {
        case 'scaleX':
        case 'scaleY':
          $(this).data('option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (result) {
            cropIt(data, result);
          }
          break;
      }

      if ($.isPlainObject(result) && $target) {
        try {
          $target.val(JSON.stringify(result));
        } catch (e) {
          // console.log(e.message);
        }
      }

    }
  });

  // Import image
  var $inputImage = $('#inputImageLogo');
  var URL = window.URL || window.webkitURL;
  var blobURL, dataURL;

  if (URL) {
    $inputImage.change(function() {
      var files = this.files;
      var file;
      var opts = {};

      if (!$image.data('cropper')) {
        return;
      }

      if (files && files.length) {
        file = files[0];

        if (/^image\/\w+$/.test(file.type)) {
          loadImage.parseMetaData(file, function(data) {
            if (data.exif && data.exif.get('Orientation') > 1) {
              opts.orientation = data.exif.get('Orientation');
              loadImage(file, function(canvas) {
                dataURL = canvas.toDataURL();
                $image.one('built.cropper', function () {
                  URL.revokeObjectURL(dataURL);
                }).cropper('reset').cropper('replace', dataURL);
                $inputImage.val('');
              }, opts);
            } else {
              blobURL = URL.createObjectURL(file);
              $image.one('built.cropper', function () {
                URL.revokeObjectURL(blobURL);
              }).cropper('reset').cropper('replace', blobURL);
              $inputImage.val('');
            }
          });
          cropSet(file);
        } else {
          window.alert('Please choose an image file.');
        }
      }
    });
  } else {
    $inputImage.prop('disabled', true).parent().addClass('disabled');
  }
}

function cropSet(file) {
  $('.btn-rotate, .btn-crop').removeClass('btn-none');

  var opts = $('.btn-crop').data('option');
      opts.type = file.type; // 'png'; // file.split('.').pop();
      //console.log("ini opts aja in image: ",opts);
      //console.log("ini opts.type in image: ",opts.type);
  
  var name = Meteor.userId();
    opts.name = name;

  //console.log("ini name in image: ",name);

  $('.btn-crop').data('option', opts);
}

function cropIt(data, canvas) {
  $('.btn-crop').addClass('disabled');
  $('.btn-disable').click();
  $('.btn-upload, .btn-rotate, .btn-cancel').addClass('btn-none');
  $('.cropper-loading').removeClass('hidden');
  //console.log("ini data img: ",data);
  //console.log("ini data.option img: ",data.option);
  var paramMap = {};
      paramMap = data.option;
      paramMap.name = paramMap.name;
      paramMap.base64 = canvas.toDataURL();
      paramMap.timestamp = new Date().getTime();
      //console.log("ini paramMap: ",paramMap);
      //console.log("ini paramMap.name: ",paramMap.name);

  var datas = new FormData();

  datas.append('public_id', paramMap.name + '_' + paramMap.timestamp);
  datas.append('file', paramMap.base64);
  datas.append('timestamp', paramMap.timestamp);
  datas.append('api_key', '133869293735318');
  datas.append('upload_preset', 'wsa-user');

  $.ajax({
    method: 'POST',
    url: 'https://api.cloudinary.com/v1_1/bisnispages/image/upload',
    data: datas,
    processData: false,
    contentType: false
  })
  .done(function(response) {
    var oldUrl = Meteor.user().profile.profileImgUrl;
    var media = {};
    media.refType = 'User';
    media.refId = Meteor.userId();
    media.cloudType = 'Cloudinary';
    media.cloudId = response.public_id;
    media.type = 'User.Image';
    media.status = 'Active';
    media.mimeType = response.resource_type + '/' + response.format;
    media.size = response.bytes;
    media.url = response.secure_url;

    Meteor.call('user_upload_media', media, function(error, response) {
      if (error) {
        Bert.alert(error.error.message, 'error');
      } else {
        Meteor.call('user_update_profile_image', Meteor.userId(), media.url, function(error, response) {
          if (error) {
            Bert.alert(error.error.message, 'error');
          } else {
            Session.set('showChangeProfileImage', false);
            Session.set('showProfileCard', true);
          }
        });
      }
    });

    var options     = {};
    options.refType = "User";
    options.refId   = media.refId;
    options.cloudId = response.public_id;
    options.type    = "User.Image";
    options.url     = oldUrl;

    Modules.client.deleteMedia(options, function(error) {
      if (error) {
        throw new Meteor.Error(error);
      }
    });
  })
  .fail(function(response, status) {
    console.log(response, status);
    Bert.alert('Gagal Upload', 'error');
  });
}
