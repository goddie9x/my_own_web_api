CKEDITOR.replace('description', {
    height: 100,
    removePlugins: ['image', 'uploadimage', "exportpdf"],
    extraPlugins: 'filebrowser',
    filebrowserUploadMethod: 'form',
});
CKEDITOR.replace('content', {
    height: 200,
    extraPlugins: 'filebrowser',
    removePlugins: "exportpdf",
    filebrowserBrowseUrl: '/images', //upload  location
    filebrowserUploadMethod: 'form',
    filebrowserUploadUrl: '/cloudinary-upload' //route
});

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