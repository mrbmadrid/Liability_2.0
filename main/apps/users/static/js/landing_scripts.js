
jQuery(document).ready(function() {
    /*
        Login form validation
    */
    $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    $('.login-form').on('submit', function(e) {
    	
    	$(this).find('input[type="text"], input[type="password"], textarea').each(function(){
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	
    });
    
    /*
        Registration form validation
    */
    $('.registration-form input[type="text"], .registration-form textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    $('.registration-form').on('submit', function(e) {
    	
    	$(this).find('input[type="text"], textarea').each(function(){
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	
    });

    /*
        Ajax username/email validation
    */

    $('#form-username').on('change', function(){
        $.get( "username_validation/"+$(this).val(), function(res) {
            if(res == "taken"){
                $('#username-taken').html("This username is not available.")
            }else{
                $('#username-taken').html("")
            }
        });
    })

    $('#form-email').on('change', function(){
        $.get( "email_validation/"+$(this).val(), function(res) {
            if(res == "registered"){
                $('#email-registered').html("This email is already associated with an account.")
            }else{
                $('email-registered').html("")
            }
        });
    })
    
    
});
