function replaceCkeditorNano(elementID, height) {
    CKEDITOR.replace(elementID, {
        height: height,
        removePlugins: ['Form', 'exportpdf', 'Source', 'Save', 'Templates', 'NewPage', 'Preview', 'Print', 'NumberedList', 'BulletedList', 'Indent', 'Outdent', 'CreateDiv', 'BidiLtr', 'BidiRtl', 'Language', 'Link', 'Unlink', 'Anchor', 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe', 'about'],
        allowedContent: 'p h1 h2',
    });
}

function replaceCkeditorMinimal(elementID, height) {
    CKEDITOR.replace(elementID, {
        height: height,
        removePlugins: ['Save', 'Templates', 'NewPage', 'exportpdf', 'Preview', 'Print', 'CreateDiv', 'Flash', 'HorizontalRule', 'about', 'Radio', 'Checkbox', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField', 'Form', 'Source', 'Anchor', 'Unlink', 'Link', 'Image', 'SpecialChar', 'Smiley', 'Iframe', 'PageBreak'],
        extraPlugins: 'filebrowser',
        filebrowserBrowseUrl: '/images', //upload  location
        filebrowserUploadMethod: 'form',
        filebrowserUploadUrl: '/cloudinary-upload' //route
    });
}

function replaceCkeditorNomal(elementID, height) {
    CKEDITOR.replace(elementID, {
        height: height,
        removePlugins: ['Save', 'Templates', 'NewPage', 'exportpdf', 'Preview', 'Print', 'CreateDiv', 'Flash', 'HorizontalRule', 'about'],
        extraPlugins: 'filebrowser',
        filebrowserBrowseUrl: '/images', //upload  location
        filebrowserUploadMethod: 'form',
        filebrowserUploadUrl: '/cloudinary-upload' //route
    });
}

function replaceCkeditorFull(elementID, height) {
    CKEDITOR.replace(elementID, {
        height: height,
        extraPlugins: 'filebrowser',
        removePlugins: "exportpdf",
        filebrowserBrowseUrl: '/images', //upload  location
        filebrowserUploadMethod: 'form',
        filebrowserUploadUrl: '/cloudinary-upload' //route
    });
}

function slugify(text) {
    return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

function createSlug(inputTitle, inputSlug) {
    let inputTitleElement = $(inputTitle);
    let inputSlugElement = $(inputSlug);

    inputTitleElement.on('change', function(e) {
        let title = inputTitleElement.val();

        inputSlugElement.val(slugify(title));
    });
    inputSlugElement.on('focusout', function(e) {
        let slug = inputTitleElement.val();

        inputSlugElement.val(slugify(slug));
    });
}

function readURL(input, imgReview) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $(imgReview).attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function uploadImage(buttonFiles, imgReview) {
    let btnFile = $(buttonFiles);

    btnFile.change(function() {
        readURL(this, imgReview);
    });
}